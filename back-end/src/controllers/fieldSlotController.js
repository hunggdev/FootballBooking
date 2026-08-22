import { prisma } from "../config/database.js";

import {
  VALID_STATUSES,
  parseTimeStringToDate,
  formatSlotTime,
  checkSlotTimeOverlap,
  validateFieldSlot,
} from "../utils/validateFieldSlots.js";

export const createFieldSlot = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);
    const { starttime, endtime, price, status } = req.body;

    if (!fieldId || isNaN(fieldId)) {
      return res.status(400).json({ message: "ID sân không hợp lệ." });
    }

    const error = validateFieldSlot({
      starttime,
      endtime,
      price,
      status,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const field = await prisma.field.findUnique({
      where: {
        fieldId,
      },
    });

    if (!field) {
      return res.status(404).json({
        message: "Không tìm thấy sân.",
      });
    }

    // Kiểm tra chồng chéo thời gian
    const overlapError = await checkSlotTimeOverlap(
      fieldId,
      starttime,
      endtime,
    );
    if (overlapError) {
      return res.status(400).json({ message: overlapError });
    }

    const slotData = {
      fieldId,
      starttime: parseTimeStringToDate(starttime),
      endtime: parseTimeStringToDate(endtime),
      price: Number(price),
      status: status,
    };

    if (status && VALID_STATUSES.includes(status)) {
      slotData.status = status;
    }

    const slot = await prisma.fieldSlot.create({
      data: slotData,
    });

    return res.status(201).json({
      message: "Thêm khung giờ thành công",
      slot,
    });
  } catch (error) {
    console.error("createFieldSlot error:", error);

    return res.status(400).json({
      message: error.message || "Thêm khung giờ thất bại.",
    });
  }
};

export const getFieldSlots = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const slots = await prisma.fieldSlot.findMany({
      where: {
        fieldId,
      },
      orderBy: {
        starttime: "asc",
      },
    });

    return res.status(200).json({
      slots,
    });
  } catch (error) {
    console.error("getFieldSlots error:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi lấy khung giờ.",
    });
  }
};

export const updateFieldSlot = async (req, res) => {
  try {
    const slotId = Number(req.params.slotId);
    const { starttime, endtime, price, status } = req.body;

    if (!slotId || isNaN(slotId)) {
      return res.status(400).json({ message: "ID khung giờ không hợp lệ." });
    }

    const error = validateFieldSlot({
      starttime,
      endtime,
      price,
      status,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const currentSlot = await prisma.fieldSlot.findUnique({
      where: { slotId },
    });

    if (!currentSlot) {
      return res.status(404).json({ message: "Không tìm thấy khung giờ." });
    }

    // Kiểm tra chồng chéo thời gian ngoại trừ khung giờ hiện tại
    const overlapError = await checkSlotTimeOverlap(
      currentSlot.fieldId,
      starttime,
      endtime,
      slotId,
    );
    if (overlapError) {
      return res.status(400).json({ message: overlapError });
    }

    const updateData = {
      starttime: parseTimeStringToDate(starttime),
      endtime: parseTimeStringToDate(endtime),
      price: Number(price),
    };

    if (status && VALID_STATUSES.includes(status)) {
      updateData.status = status;
    }

    const slot = await prisma.fieldSlot.update({
      where: {
        slotId,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Cập nhật thành công",
      slot,
    });
  } catch (error) {
    console.error("updateFieldSlot error:", error);

    return res.status(400).json({
      message: error.message || "Cập nhật khung giờ thất bại.",
    });
  }
};

export const deleteFieldSlot = async (req, res) => {
  try {
    const slotId = Number(req.params.slotId);

    if (!slotId || isNaN(slotId)) {
      return res.status(400).json({ message: "ID khung giờ không hợp lệ." });
    }

    const existedSlot = await prisma.fieldSlot.findUnique({
      where: { slotId },
    });

    const now = new Date();
    const hasBookings = await prisma.bookingSlot.findMany({
      take: 1,
      where: {
        slotId,
        bookingDate: {
          gte: now,
        },
      },
    });

    if (hasBookings.length > 0) {
      return res.status(400).json({
        message: "Khung giờ này đã có đơn đặt sân, không thể xóa.",
      });
    }

    if (!existedSlot) {
      return res.status(404).json({ message: "Không tìm thấy khung giờ." });
    }

    await prisma.fieldSlot.update({
      where: { slotId },
      data: { status: "MAINTENANCE" },
    });

    // await prisma.$transaction([
    //   prisma.slotHold.deleteMany({ where: { slotId } }),
    //   prisma.booking.deleteMany({ where: { slotId } }),
    //   prisma.fieldSlot.delete({ where: { slotId } }),
    // ]);

    return res.status(200).json({
      message: "Xóa khung giờ thành công",
    });
  } catch (error) {
    console.error("deleteFieldSlot error:", error);

    return res.status(400).json({
      message: error.message || "Xóa khung giờ thất bại.",
    });
  }
};
