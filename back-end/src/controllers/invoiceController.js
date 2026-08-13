import { prisma } from "../config/database.js";

/**
 * Xuất hóa đơn
 */
export const generateInvoice = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      include: {
        invoice: true,
        bookingServices: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Không tìm thấy đơn đặt sân.",
      });
    }

    if (booking.invoice) {
      return res.status(400).json({
        message: "Đơn đặt sân đã được xuất hóa đơn.",
      });
    }

    const fieldAmount = Number(booking.totalPrice);

    const serviceAmount = booking.bookingServices.reduce(
      (total, service) => total + Number(service.price) * service.quantity,
      0,
    );

    const depositAmount = Number(booking.depositAmount);

    const totalAmount = fieldAmount + serviceAmount;

    const remainAmount = totalAmount - depositAmount;

    const invoice = await prisma.invoice.create({
      data: {
        bookingId: booking.bookingId,
        userId: booking.userId,
        deposit: depositAmount,
        fieldAmount,
        serviceAmount,
        totalAmount,
        remainAmount,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Xuất hóa đơn thành công.",
      invoice,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Lấy danh sách hóa đơn
 */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        booking: true,
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công.",
      invoices,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Lấy chi tiết hóa đơn
 */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        invoiceId: Number(req.params.invoiceId),
      },
      include: {
        booking: {
          include: {
            fieldSlot: true,
            bookingServices: {
              include: {
                service: true,
              },
            },
          },
        },
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn.",
      });
    }

    return res.status(200).json({
      message: "Lấy hóa đơn thành công.",
      invoice,
    });
  } catch (error) {
    console.error("getInvoiceById error:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};
