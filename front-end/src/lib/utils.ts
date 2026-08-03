import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Định dạng khung giờ (starttime/endtime) trả về từ backend.
 *
 * Field slot chỉ lưu "giờ trong ngày" (kiểu Time trong Postgres), nhưng khi
 * Prisma trả JSON, nó luôn serialize thành chuỗi ISO datetime đầy đủ, ví dụ
 * "1970-01-01T13:00:00.000Z". Nếu hiển thị thẳng chuỗi này (`{slot.starttime}`)
 * hoặc dùng `new Date(...).toLocaleTimeString()` (bị lệch theo múi giờ trình
 * duyệt), giờ hiển thị sẽ sai/không đọc được.
 *
 * Vì backend luôn lưu và trả giờ theo UTC (xem fieldSlotController.js), ta
 * phải đọc giờ/phút bằng getUTCHours/getUTCMinutes để không bị lệch múi giờ.
 */
export function formatTime(value?: string | null): string {
  if (!value) return "--:--";

  // Trường hợp value đã là "HH:mm" hoặc "HH:mm:ss" thuần (không phải ISO)
  const simple = /^(\d{2}):(\d{2})/.exec(value);
  if (simple && !value.includes("T")) {
    return `${simple[1]}:${simple[2]}`;
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) return "--:--";

  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Định dạng khoảng thời gian "starttime - endtime" cho một field slot. */
export function formatTimeRange(starttime?: string | null, endtime?: string | null): string {
  return `${formatTime(starttime)} - ${formatTime(endtime)}`;
}

/** Định dạng ngày/giờ đầy đủ (dùng cho createdAt, updatedAt, ...) theo giờ Việt Nam. */
export function formatDateTime(value?: string | null): string {
  if (!value) return "--";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "--";
  return date.toLocaleString("vi-VN");
}

/** Định dạng ngày (không kèm giờ) theo giờ Việt Nam. */
export function formatDate(value?: string | null): string {
  if (!value) return "--";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("vi-VN");
}
