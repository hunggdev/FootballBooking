import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; 

import { validateUser, validatePhone, validateEmail, duplicateUser } from "../utils/validateUsers.js";

//Xem danh sách khách hàng
export const getCustomers = async (req, res) => {
    try {
        // lấy tất cả user có role = user
        const showAll = req.query.all === "1";
        const users = await prisma.user.findMany({
            where: showAll ? {} : {
                role: "CUSTOMER", 
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
                userId: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
                sessions: {
                    select:{
                        sessionId: true,
                    }
                },
            }
        });

        const customers = users.map((user) => ({
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            status: user.status,
            bookingCount: 0,
            totalSpent: 0,
            createdAt: user.createdAt,
            isOnline: user.sessions.length > 0,
        }));

        // đếm tổng số user có role = user
        const result = await prisma.user.aggregate({
            _count:{
                userId: true,
            },
            where:{
                role:"user"
            }
        })
        
        // đếm số user mới trong tháng này
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const newUserInThisMonth = await prisma.user.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        })

        return res.status(200).json({customers, totalCustomers: result._count.userId, newUserInThisMonth}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

//Xem chi tiết
export const getCustomerById = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const customer = await prisma.user.findUnique({
      where: {
        userId: customerId,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    return res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error("GET CUSTOMER:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

//Tạo account khách hàng
export const createCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;
    console.log({fullName, email, phone, password})

    const error = validateUser({fullName, email, phone, password});
    if (error) {
      return res.status(400).json({ message: error });
    }

    const duplicate = await duplicateUser(email, phone)
    if (duplicate) {
        return res.status(400).json({ message: duplicate });
    }
  
    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    // tạo user mới (với status là active)
    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            passwordHash: hashedPassword,
            role: "CUSTOMER",
            status: "ACTIVE"
        }
    });

    return res.status(200).json({message: "Tạo tài khoản khách hàng thành công", customer: newUser});
    } catch (error) {
        console.error("CREATE CUSTOMER:", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};

//Updat thông tin khách hàng
export const updateCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const {
      fullName,
      phone,
      status,
    } = req.body;

    const customer = await prisma.user.findUnique({
      where: {
        userId: customerId,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    const error = validatePhone(phone)
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!["ACTIVE", "INACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
      });
    }

    const updatedCustomer = await prisma.user.update({
      where: {
        userId: customerId,
      },
      data: {
        fullName: fullName,
        phone: phone,
        status: status,
      },
    });

    return res.status(200).json({
      message: "Cập nhật thông tin khách hàng thành công",
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("UPDATE CUSTOMER:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// Deleted sân
export const deleteCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    const customer = await prisma.user.findUnique({
      where: { userId: customerId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    const updatedCustomer = await prisma.user.update({
      where: { userId: customerId },
      data: {
        status: "BANNED",
      },
    });

    return res.status(200).json({
      message: "Xóa khách hàng thành công",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("DELETE CUSTOMER: ",error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const statsCustomer = async (req, res) => {
  try {
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const [
      customers,
      totalUserInThisMonth,
      activeCustomers,
      inactiveCustomers,
      bannedCustomers,
      online,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
          status: "ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
          status: "INACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
          status: "BANNED",
        },
      }),

      prisma.session.count({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
    ]);
    
    return res.status(200).json({
      customers,
      totalUserInThisMonth,
      online,
      bannedCustomers,
      activeCustomers,
      inactiveCustomers,
    });


  } catch (error) {
    console.error("STATS CUSTOMER:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
}

