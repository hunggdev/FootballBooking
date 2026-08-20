import type { AdminStatsData } from "./types";

// TODO: thay bằng dữ liệu thật từ API tổng hợp (COUNT/SUM theo các model bên dưới).
export const mockAdminStats: AdminStatsData = {
  overview: [
    // COUNT(*) FROM users
    { id: "total-users", label: "Tổng người dùng", value: "2.586", helperText: "↑ 12.5% so với tháng trước" },
    // COUNT(*) FROM bookings
    { id: "total-bookings", label: "Tổng đặt sân", value: "1.247", helperText: "↑ 14.3% so với tháng trước" },
    // COUNT(*) FROM field
    { id: "total-fields", label: "Tổng số sân", value: "28", helperText: "Trên toàn hệ thống" },
    // COUNT(*) FROM match WHERE status = 'OPEN'
    { id: "open-matches", label: "Kèo đấu đang mở", value: "32", helperText: "↑ 8 kèo mới hôm nay" },
    // COUNT(*) FROM reviews
    { id: "total-reviews", label: "Tổng đánh giá", value: "1.286", helperText: "Trung bình 4.8 / 5" },
    // COUNT(*) FROM notifications WHERE is_read = false
    { id: "unread-notifications", label: "Thông báo chưa đọc", value: "18", helperText: "Trong 7 ngày qua" },
  ],
  bookingStatusCounts: [
    // COUNT(*) FROM bookings GROUP BY status
    { status: "HOLD", label: "Đang giữ chỗ", count: 42 },
    { status: "CONFIRMED", label: "Đã xác nhận", count: 610 },
    { status: "COMPLETED", label: "Hoàn tất", count: 520 },
    { status: "CANCELLED", label: "Đã huỷ", count: 75 },
  ],
  matchStatusCounts: [
    // COUNT(*) FROM match GROUP BY status
    { status: "OPEN", label: "Đang mở", count: 32 },
    { status: "MATCHED", label: "Đã ghép cặp", count: 58 },
    { status: "FINISHED", label: "Đã kết thúc", count: 214 },
    { status: "CANCELLED", label: "Đã huỷ", count: 12 },
  ],
  revenueSummary: {
    // SUM(total_amount) FROM invoices
    totalInvoiceAmount: 735_000_000,
    // SUM(total_amount) FROM invoices WHERE status = 'PAID'
    paidAmount: 612_000_000,
    // SUM(remain_amount) FROM invoices
    remainAmount: 123_000_000,
    // SUM(deposit) FROM invoices
    depositCollected: 96_500_000,
  },
};
