import { prisma } from "../config/database.js";

/**
 * GET /api/notifications
 * Lấy danh sách notification của user hiện tại
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách thông báo",
    });
  }
};

/**
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Error in getUnreadCount:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể lấy số thông báo chưa đọc",
    });
  }
};

/**
 * PATCH /api/notifications/:notificationId/read
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = Number(req.params.notificationId);

    if (Number.isNaN(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "notificationId không hợp lệ",
      });
    }

    // Kiểm tra notification có thuộc user hiện tại không
    const notification = await prisma.notification.findFirst({
      where: {
        notificationId,
        recipientId: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    // Nếu đã đọc rồi
    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: "Thông báo đã được đọc trước đó",
        notification,
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu thông báo là đã đọc",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error in markAsRead:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật thông báo",
    });
  }
};

/**
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu tất cả thông báo là đã đọc",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Error in markAllAsRead:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật thông báo",
    });
  }
};
