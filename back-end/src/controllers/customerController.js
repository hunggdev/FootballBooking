import { prisma } from "../config/database.js";

export const getCustomers = async (req, res) => {
    try {
        // lấy tất cả user có role = user
        const users = await prisma.user.findMany({
            where: {
                role: "user",
            },
            select: {
                userId: true,
                fullName: true,
                email: true,
                phone: true,
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

        console.log({customers, totalCustomers: result._count.userId, newUserInThisMonth});
        return res.status(200).json({customers, totalCustomers: result._count.userId, newUserInThisMonth}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}