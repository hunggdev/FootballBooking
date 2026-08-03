import { prisma } from "../config/database.js";

/**
 * Thống kê tổng quan Dashboard
 * GET /api/dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalFields,
      totalBookings,
      totalInvoices,
      revenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.field.count(),
      prisma.booking.count(),
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    // Thống kê trạng thái booking
    const bookingStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // Top 5 sân được đặt nhiều
    const topFields = await prisma.booking.groupBy({
      by: ["slotId"],
      _count: {
        slotId: true,
      },
      orderBy: {
        _count: {
          slotId: "desc",
        },
      },
      take: 5,
    });

    const fieldStatistics = await Promise.all(
      topFields.map(async (item) => {
        const slot = await prisma.fieldSlot.findUnique({
          where: {
            slotId: item.slotId,
          },
          include: {
            field: {
              select: {
                name: true,
              },
            },
          },
        });

        return {
          slotId: item.slotId,
          fieldName: slot?.field?.name ?? "Không xác định",
          bookingCount: item._count.slotId,
        };
      }),
    );

    return res.status(200).json({
      message: "Lấy thống kê thành công.",
      data: {
        totalUsers,
        totalCustomers,
        totalFields,
        totalBookings,
        totalInvoices,
        totalRevenue: Number(revenue._sum.totalAmount ?? 0),

        bookingStatus,

        topFields: fieldStatistics,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};
