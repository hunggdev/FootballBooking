import { prisma } from "../config/database.js";

export const VALID_STATUSES = ["AVAILABLE", "HOLD", "BOOKED", "CLOSED", "MAINTENANCE"];

export const parseTimeStringToDate = (timeStr) => {
  if (!timeStr) return new Date();
  if (timeStr instanceof Date) return timeStr;
  const parts = String(timeStr).trim().split(":");
  const h = (parts[0] || "00").padStart(2, "0");
  const m = (parts[1] || "00").padStart(2, "0");
  return new Date(`1970-01-01T${h}:${m}:00.000Z`);
};

export const formatSlotTime = (dateObj) => {
  if (!dateObj) return "00:00";
  const d = new Date(dateObj);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

export const checkSlotTimeOverlap = async (fieldId, starttimeStr, endtimeStr, excludeSlotId = null) => {
  const existingSlots = await prisma.fieldSlot.findMany({
    where: {
      status: "AVAILABLE", 
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

export const validateFieldSlot = ({ starttime, endtime, price, status }) => {
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