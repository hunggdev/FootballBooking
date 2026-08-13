import { prisma } from "../config/database.js";

/**
 * Tạo đánh giá
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating) {
      return res.status(400).json({
        message: "Thiếu thông tin đánh giá.",
      });
    }
    // Kiểm tra booking
    const booking = await prisma.booking.findUnique({
      where: {
        bookingId: Number(bookingId),
      },
      include: {
        bookingSlots: {
          include: {
            fieldSlot: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Không tìm thấy đơn đặt sân.",
      });
    }

    // Chỉ chủ booking mới được đánh giá
    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền đánh giá đơn này.",
      });
    }

    // Kiểm tra đã review chưa
    const existed = await prisma.review.findUnique({
      where: {
        bookingId: Number(bookingId),
      },
    });

    if (existed) {
      return res.status(400).json({
        message: "Đơn đặt sân này đã được đánh giá.",
      });
    }

    const review = await prisma.review.create({
      data: {
        bookingId: Number(bookingId),
        userId,
        fieldId: booking.bookingSlots[0].fieldSlot.fieldId, 
        rating: Number(rating),
        comment,
      },
      include: {
        user: { select: { userId: true, fullName: true, email: true } },
        field: true,
        booking: true,
      },
    });

    return res.status(201).json({
      message: "Đánh giá thành công.",
      // review,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Lấy tất cả đánh giá (dành cho admin quản lý & phản hồi)
 */
export const getAllReviews = async (req, res) => {
  try {
    const { fieldType, fieldId } = req.query;

    const where = {};
    if (fieldId) {
      where.fieldId = Number(fieldId);
    }
    if (fieldType) {
      where.field = {
        fieldType: fieldType,
      };
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
        field: true,
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("getAllReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Lấy danh sách review của sân
 */
export const getFieldReviews = async (req, res) => {
  try {
    const fieldId = Number(req.params.fieldId);

    const reviews = await prisma.review.findMany({
      where: {
        fieldId,
      },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("getFieldReviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy chi tiết review
 */
export const getReviewById = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    const review = await prisma.review.findUnique({
      where: {
        reviewId,
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
        field: true,
        booking: true,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá.",
      });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Cập nhật review
 */
export const updateReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    const userId = req.user.userId;

    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: {
        reviewId,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá.",
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa.",
      });
    }

    const updated = await prisma.review.update({
      where: {
        reviewId,
      },
      data: {
        rating,
        comment,
      },
    });

    return res.status(200).json({
      message: "Cập nhật đánh giá thành công.",
      review: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Chủ sân/Admin trả lời review
 */
export const replyReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    const { reply } = req.body;

    const review = await prisma.review.findUnique({
      where: {
        reviewId,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá.",
      });
    }

    const updated = await prisma.review.update({
      where: {
        reviewId,
      },
      data: {
        reply,
      },
      include: {
        user: { select: { userId: true, fullName: true, email: true } },
        field: true,
        booking: true,
      },
    });

    return res.status(200).json({
      message: "Phản hồi thành công.",
      review: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

/**
 * Xóa review
 */
export const deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    const userId = req.user.userId;

    const review = await prisma.review.findUnique({
      where: {
        reviewId,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá.",
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa đánh giá này.",
      });
    }

    await prisma.review.delete({
      where: {
        reviewId,
      },
    });

    return res.status(200).json({
      message: "Xóa đánh giá thành công.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};
