import { prisma } from "../config/database.js";

const TIME_ZONE = "Asia/Ho_Chi_Minh";

/* =========================================================
 * DATE HELPERS
 * ======================================================= */

/**
 * Format DateTime -> YYYY-MM-DD theo giờ Việt Nam
 */
const formatDateKey = (date) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Tạo Date tương ứng với 00:00:00 của ngày hiện tại
 * theo timezone Việt Nam.
 *
 * Việt Nam UTC+7, không có DST.
 */
const getVietnamStartOfDay = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year").value);

  const month = Number(parts.find((p) => p.type === "month").value);

  const day = Number(parts.find((p) => p.type === "day").value);

  // 00:00 Việt Nam = 17:00 UTC ngày hôm trước
  return new Date(Date.UTC(year, month - 1, day) - 7 * 60 * 60 * 1000);
};

/**
 * Tạo ngày kế tiếp theo calendar day Việt Nam.
 */
const addVietnamDays = (date, days) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

/* =========================================================
 * OVERVIEW
 * ======================================================= */

/**
 * Tổng doanh thu trong khoảng thời gian.
 *
 * Doanh thu = Invoice đã PAID
 * và tính theo createdAt.
 */
const getMonthlyRevenue = async (start, end) => {
  const result = await prisma.invoice.aggregate({
    _sum: {
      totalAmount: true,
    },

    where: {
      status: "PAID",
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return Number(result._sum.totalAmount || 0);
};

/**
 * Tổng số booking trong khoảng thời gian.
 *
 * 1 Booking = 1 lần khách đặt sân.
 *
 * Không đếm BookingSlot ở đây.
 */
const getMonthlyBookings = async (start, end) => {
  return prisma.booking.count({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },

      status: {
        not: "CANCELLED",
      },
    },
  });
};

/**
 * Số sân đang ACTIVE.
 */
// const getActiveFields = async () => {
//   return prisma.field.count({
//     where: {
//       status: "ACTIVE",
//     },
//   });
// };

/**
 * Tổng số sân.
 */
// const getTotalFields = async () => {
//   return prisma.field.count();
// };

/**
 * Số kèo đang OPEN.
 */
const getOpenMatches = async () => {
  return prisma.match.count({
    where: {
      status: "OPEN",
    },
  });
};

/**
 * Tổng khách hàng.
 */
const getTotalCustomers = async () => {
  return prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });
};

/**
 * Rating trung bình + tổng số review.
 */
const getReviewStats = async () => {
  const result = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },

    _count: {
      reviewId: true,
    },
  });

  return {
    average: Number(result._avg.rating || 0),
    total: result._count.reviewId,
  };
};

/* =========================================================
 * REVENUE CHART - 7 DAYS
 * ======================================================= */

/**
 * Lấy doanh thu từng ngày trong 7 ngày.
 */
const getRevenue7Days = async (start, end) => {
  start = addVietnamDays(start, -28);
  end = addVietnamDays(end, 0);

  const invoices = await prisma.invoice.findMany({
    where: {
      status: "PAID",

      createdAt: {
        gte: start,
        lt: end,
      },
    },

    select: {
      totalAmount: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  /**
   * Tạo sẵn 7 ngày với revenue = 0.
   */
  const result = [];

  for (let i = 0; i < 28; i++) {
    const date = addVietnamDays(start, i);

    result.push({
      date: formatDateKey(date),
      revenue: 0,
    });
  }

  /**
   * Gom invoice theo ngày.
   */
  for (const invoice of invoices) {
    if (!invoice.createdAt) continue;

    const key = formatDateKey(invoice.createdAt);

    const item = result.find((item) => item.date === key);

    if (item) {
      item.revenue += Number(invoice.totalAmount || 0);
    }
  }

  return result;
};

/**
 * Đếm số booking từng ngày trong 7 ngày.
 */
const getBookingCount7Days = async (start, end) => {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },

      status: {
        not: "CANCELLED",
      },
    },

    select: {
      createdAt: true,
    },
  });

  /**
   * Map:
   *
   * 2026-08-07 -> 10
   * 2026-08-08 -> 15
   */
  const countMap = new Map();

  for (const booking of bookings) {
    const key = formatDateKey(booking.createdAt);

    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  const result = [];

  for (let i = 0; i < 28; i++) {
    const date = addVietnamDays(start, i);

    const key = formatDateKey(date);

    result.push({
      date: key,
      bookings: countMap.get(key) || 0,
    });
  }

  return result;
};

/**
 * Combine:
 *
 * revenue
 * +
 * bookings
 *
 * thành:
 *
 * [
 *   {
 *      date,
 *      revenue,
 *      bookings
 *   }
 * ]
 */
const buildRevenueChart = async (start, end) => {
  const [revenueData, bookingData] = await Promise.all([
    getRevenue7Days(start, end),
    getBookingCount7Days(start, end),
  ]);

  const bookingMap = new Map(
    bookingData.map((item) => [item.date, item.bookings]),
  );

  return revenueData.map((item) => ({
    date: item.date,
    revenue: item.revenue,
    bookings: bookingMap.get(item.date) || 0,
  }));
};

/* =========================================================
 * BOOKING RATE BY TIME
 * ======================================================= */

/**
 * Tỷ lệ booking theo khung giờ:
 *
 * 05:00 - 11:00 -> morning
 * 11:00 - 14:00 -> noon
 * 14:00 - 17:00 -> afternoon
 * 17:00 - 22:00 -> evening
 */
const getBookingRateByTime = async (start, end) => {
  const bookingSlots = await prisma.bookingSlot.findMany({
    where: {
      bookingDate: {
        gte: start,
        lt: end,
      },

      booking: {
        status: {
          not: "CANCELLED",
        },
      },
    },

    select: {
      bookingDate: true,

      fieldSlot: {
        select: {
          starttime: true,
          endtime: true,
        },
      },
    },
  });

  const result = {
    morning: 0,
    noon: 0,
    afternoon: 0,
    evening: 0,
  };

  for (const item of bookingSlots) {
    if (!item.fieldSlot?.starttime) {
      continue;
    }

    /**
     * Vì starttime là @db.Time(6),
     * lấy giờ local của Date object.
     *
     * Không dùng getUTCHours() ở đây để tránh
     * trường hợp 18:00 VN bị thành 11:00 UTC.
     */
    const hour = item.fieldSlot.starttime.getHours();

    if (hour >= 5 && hour < 11) {
      result.morning++;
    } else if (hour >= 11 && hour < 14) {
      result.noon++;
    } else if (hour >= 14 && hour < 17) {
      result.afternoon++;
    } else if (hour >= 17 && hour < 22) {
      result.evening++;
    }
  }

  const total =
    result.morning + result.noon + result.afternoon + result.evening;

  return {
    morning: total ? Math.round((result.morning / total) * 100) : 0,

    noon: total ? Math.round((result.noon / total) * 100) : 0,

    afternoon: total ? Math.round((result.afternoon / total) * 100) : 0,

    evening: total ? Math.round((result.evening / total) * 100) : 0,
  };
};

/* =========================================================
 * RECENT BOOKINGS
 * ======================================================= */

const getRecentBookings = async () => {
  const bookings = await prisma.booking.findMany({
    take: 12,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      bookingId: true,
      status: true,
      type: true,
      depositAmount: true,
      totalPrice: true,
      createdAt: true,

      user: {
        select: {
          userId: true,
          fullName: true,
          image: true,
        },
      },

      field: {
        select: {
          fieldId: true,
          name: true,
        },
      },

      bookingSlots: {
        orderBy: {
          bookingDate: "asc",
        },

        select: {
          bookingDate: true,
          price: true,

          fieldSlot: {
            select: {
              starttime: true,
              endtime: true,
            },
          },
        },
      },
    },
  });

  return bookings;
};

/**
 * Tính tổng thời lượng của một booking.
 *
 * Ví dụ:
 *
 * 18-19
 * 19-20
 *
 * => 2 giờ
 */
const calculateDuration = (bookingSlots) => {
  let minutes = 0;

  for (const item of bookingSlots) {
    if (!item.fieldSlot?.starttime || !item.fieldSlot?.endtime) {
      continue;
    }

    const start = item.fieldSlot.starttime;

    const end = item.fieldSlot.endtime;

    const startMinutes = start.getHours() * 60 + start.getMinutes();

    const endMinutes = end.getHours() * 60 + end.getMinutes();

    let duration = endMinutes - startMinutes;

    /**
     * Trường hợp slot vượt qua 00:00.
     */
    if (duration < 0) {
      duration += 24 * 60;
    }

    minutes += duration;
  }

  return minutes / 60;
};

/**
 * Format recent bookings để FE dùng dễ hơn.
 */
const formatRecentBookings = (bookings) => {
  return bookings.map((booking) => ({
    bookingId: booking.bookingId,

    status: booking.status,

    type: booking.type,

    depositAmount: Number(booking.depositAmount || 0),

    totalPrice: Number(booking.totalPrice || 0),

    createdAt: booking.createdAt,

    user: booking.user,

    field: booking.field,

    duration: calculateDuration(booking.bookingSlots),

    bookingSlots: booking.bookingSlots.map((slot) => ({
      bookingDate: slot.bookingDate,

      price: Number(slot.price || 0),

      fieldSlot: slot.fieldSlot,
    })),
  }));
};

/* =========================================================
 * FEATURED MATCHES
 * ======================================================= */

const getFeaturedMatches = async () => {
  const matches = await prisma.match.findMany({
    where: {
      status: {
        in: ["OPEN", "MATCHED"],
      },
    },

    take: 3,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      matchId: true,
      fieldType: true,
      minAge: true,
      maxAge: true,
      timeNote: true,
      description: true,
      costRule: true,
      status: true,

      user: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return matches.map((match) => ({
    ...match,
  }));
};

/* =========================================================
 * RECENT REVIEWS
 * ======================================================= */

const getRecentReviews = async () => {
  const reviews = await prisma.review.findMany({
    take: 5,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      reviewId: true,
      rating: true,
      comment: true,
      reply: true,
      createdAt: true,

      user: {
        select: {
          fullName: true,
          image: true,
        },
      },

      field: {
        select: {
          fieldId: true,
          name: true,
        },
      },
    },
  });

  return reviews;
};

/* =========================================================
 * MAIN DASHBOARD SERVICE
 * ======================================================= */

const desMonth = (from, to, now) => {
  const startOfMonth = from
    ? new Date(from)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = to
    ? new Date(to)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { startOfMonth, endOfMonth };
};

export const getOverview = async ({ from, to } = {}) => {
  const now = new Date();

  /* =======================================================
   * MONTH RANGE
   * ===================================================== */

  const { startOfMonth, endOfMonth } = desMonth(from, to, now);
  /* =======================================================
   * 7 DAYS RANGE
   * ===================================================== */

  const startOf7Days = getVietnamStartOfDay(now);

  const endOf7Days = now;

  /* =======================================================
   * RUN ALL INDEPENDENT QUERIES
   * ===================================================== */

  const [
    monthlyRevenue,
    monthlyBookings,
    // activeFields,
    // totalFields,
    openMatches,
    totalCustomers,
    reviewStats,
  ] = await Promise.all([
    /* Overview */

    getMonthlyRevenue(startOfMonth, endOfMonth),
    getMonthlyBookings(startOfMonth, endOfMonth),

    // getActiveFields(),
    // getTotalFields(),
    getOpenMatches(),
    getTotalCustomers(),
    getReviewStats(),
  ]);

  /* =======================================================
   * FINAL RESPONSE
   * ===================================================== */

  return {
    overview: {
      monthlyRevenue,
      monthlyBookings,
      //   activeFields,
      //   totalFields,
      openMatches,
      totalCustomers,
      reviews: reviewStats,
    },
  };
};

export const getChart = async ({ from, to } = {}) => {
  const now = new Date();

  /* =======================================================
   * MONTH RANGE
   * ===================================================== */

  const { startOfMonth, endOfMonth } = desMonth(from, to, now);

  /* =======================================================
   * 7 DAYS RANGE
   * ===================================================== */

  const startOf7Days = getVietnamStartOfDay(now);

  const endOf7Days = now;

  /* =======================================================
   * RUN ALL INDEPENDENT QUERIES
   * ===================================================== */

  const [revenueChart, bookingRateByTime] = await Promise.all([
    /* Chart */
    buildRevenueChart(startOf7Days, endOf7Days),
    /* Booking rate */
    getBookingRateByTime(startOfMonth, endOfMonth),
  ]);

  /* =======================================================
   * FINAL RESPONSE
   * ===================================================== */

  return {
    chart: revenueChart,
    bookingRateByTime,
  };
};

export const getRecent = async ({ from, to } = {}) => {
  const now = new Date();

  /* =======================================================
   * MONTH RANGE
   * ===================================================== */

  const { startOfMonth, endOfMonth } = desMonth(from, to, now);

  /* =======================================================
   * 7 DAYS RANGE
   * ===================================================== */

  const startOf7Days = getVietnamStartOfDay(now);

  const endOf7Days = now;

  /* =======================================================
   * RUN ALL INDEPENDENT QUERIES
   * ===================================================== */

  const [recentBookings, featuredMatches, recentReviews] = await Promise.all([
    /* Recent */
    getRecentBookings(),
    getFeaturedMatches(),
    getRecentReviews(),
  ]);

  /* =======================================================
   * FORMAT RECENT BOOKINGS
   * ===================================================== */

  const formattedRecentBookings = formatRecentBookings(recentBookings);

  /* =======================================================
   * FINAL RESPONSE
   * ===================================================== */

  return {
    recentBookings: formattedRecentBookings,
    featuredMatches,
    recentReviews,
  };
};
