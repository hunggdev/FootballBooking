import { prisma } from "../config/database.js";

const VALID_STATUSES = ["AVAILABLE", "HOLD", "BOOKED", "CLOSED", "MAINTENANCE"];

const parseTimeStringToDate = (timeStr) => {
  if (!timeStr) return new Date();
  if (timeStr instanceof Date) return timeStr;
  const parts = String(timeStr).trim().split(":");
  const h = (parts[0] || "00").padStart(2, "0");
  const m = (parts[1] || "00").padStart(2, "0");
  return new Date(`1970-01-01T${h}:${m}:00.000Z`);
};

const formatSlotTime = (dateObj) => {
  if (!dateObj) return "00:00";
  const d = new Date(dateObj);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const checkSlotTimeOverlap = async (fieldId, starttimeStr, endtimeStr, excludeSlotId = null) => {
  const existingSlots = await prisma.fieldSlot.findMany({
    where: {
      fieldId,
      ...(excludeSlotId ? { NOT: { slotId: excludeSlotId } } : {}),
    },
  });

  const newStart = String(starttimeStr).trim();
  const newEnd = String(endtimeStr).trim();

  for (const slot of existingSlots) {
    const existStart = formatSlotTime(slot.starttime);
    const existEnd = formatSlotTime(slot.endtime);

    // Điều kiện chồng chéo thời gian: (newStart < existEnd) VÀ (existStart < newEnd)
    if (newStart < existEnd && existStart < newEnd) {
      return `Khung giờ ${newStart} - ${newEnd} bị trùng/chồng chéo với khung giờ đã có (${existStart} - ${existEnd}).`;
    }
  }

  return null;
};

const validateFieldSlot = ({ starttime, endtime, price, status }) => {
  if (!starttime || !endtime) {
    return "Vui lòng nhập khung giờ";
  }

  if (starttime >= endtime) {
    return "Giờ bắt đầu phải nhỏ hơn giờ kết thúc";
  }

  if (Number(price) <= 0) {
    return "Giá phải lớn hơn 0";
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return "Trạng thái không hợp lệ";
  }

  return null;
};

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
    const overlapError = await checkSlotTimeOverlap(fieldId, starttime, endtime);
    if (overlapError) {
      return res.status(400).json({ message: overlapError });
    }

    const slotData = {
      fieldId,
      starttime: parseTimeStringToDate(starttime),
      endtime: parseTimeStringToDate(endtime),
      price: Number(price),
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
    const overlapError = await checkSlotTimeOverlap(currentSlot.fieldId, starttime, endtime, slotId);
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
      include: { bookings: true },
    });

    if (!existedSlot) {
      return res.status(404).json({ message: "Không tìm thấy khung giờ." });
    }

    const hasConfirmedBookings = existedSlot.bookings.some(
      (b) => b.status === "CONFIRMED" || b.status === "HOLD"
    );

    if (hasConfirmedBookings) {
      return res.status(400).json({
        message: "Khung giờ này đã có đơn đặt sân, không thể xóa.",
      });
    }

    await prisma.$transaction([
      prisma.slotHold.deleteMany({ where: { slotId } }),
      prisma.booking.deleteMany({ where: { slotId } }),
      prisma.fieldSlot.delete({ where: { slotId } }),
    ]);

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
