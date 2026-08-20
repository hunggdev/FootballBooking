import type {
  ActivityItem,
  Booking,
  HighlightMatch,
  RevenuePoint,
  StatCard,
  SystemAlert,
  TimeSlotShare,
} from "@/types/dashboard";

export const statCards: StatCard[] = [
  { id: "revenue", label: "Tổng doanh thu (tháng)", value: "735.000.000đ", helperText: "↑ 18.6% so với tháng trước" },
  { id: "bookings", label: "Lượt đặt sân (tháng)", value: "1.247", helperText: "↑ 14.3% so với tháng trước" },
  { id: "active-courts", label: "Sân đang hoạt động", value: "24", helperText: "/ 28 sân" },
  { id: "open-matches", label: "Kèo đấu đang mở", value: "32", helperText: "↑ 8 kèo mới hôm nay" },
  { id: "customers", label: "Khách hàng", value: "2.586", helperText: "↑ 12.5% so với tháng trước" },
  { id: "rating", label: "Đánh giá trung bình", value: "4.8 / 5", helperText: "Từ 1.286 đánh giá" },
];

export const revenuePoints: RevenuePoint[] = [
  { date: "08/07", revenue: 90, bookings: 60 },
  { date: "09/07", revenue: 70, bookings: 45 },
  { date: "10/07", revenue: 110, bookings: 80 },
  { date: "11/07", revenue: 75, bookings: 50 },
  { date: "12/07", revenue: 130, bookings: 95 },
  { date: "13/07", revenue: 140, bookings: 100 },
  { date: "14/07", revenue: 120, bookings: 85 },
];

export const timeSlotShares: TimeSlotShare[] = [
  { id: "morning", label: "Sáng (05-11h)", percent: 28 },
  { id: "noon", label: "Trưa (11-14h)", percent: 19 },
  { id: "afternoon", label: "Chiều (14-17h)", percent: 25 },
  { id: "evening", label: "Tối (17-22h)", percent: 28 },
];

export const activityItems: ActivityItem[] = [
  { id: "a1", description: "Nguyễn Văn A vừa đặt Sân A 18:20", time: "14/07/2026" },
  { id: "a2", description: "Trần Văn Bình vừa tạo kèo 7vs7 17:45", time: "14/07/2026" },
  { id: "a3", description: "Admin xác nhận đặt sân Sân B 17:30", time: "14/07/2026" },
  { id: "a4", description: "Lê Thị Mai vừa thanh toán thành công 16:50", time: "14/07/2026" },
  { id: "a5", description: "Hoàn tiền cọc cho khách hàng #KH1056 15:10", time: "14/07/2026" },
];

export const bookings: Booking[] = [
  { id: "#DS1267", customerName: "Nguyễn Văn A", court: "Sân A", time: "14/07/2026 - 20:00", duration: "2 giờ", deposit: "200.000đ", status: "Đã đặt" },
  { id: "#DS1266", customerName: "Trần Văn Bình", court: "Sân B", time: "14/07/2026 - 18:00", duration: "1.5 giờ", deposit: "150.000đ", status: "Giữ chỗ" },
  { id: "#DS1265", customerName: "Lê Thị Mai", court: "Sân C", time: "15/07/2026 - 19:00", duration: "2 giờ", deposit: "200.000đ", status: "Chờ xác nhận" },
  { id: "#DS1264", customerName: "Phạm Minh Tuấn", court: "Sân A", time: "15/07/2026 - 17:00", duration: "2 giờ", deposit: "200.000đ", status: "Đã thanh toán" },
  { id: "#DS1263", customerName: "Hoàng Đức Anh", court: "Sân D", time: "16/07/2026 - 20:00", duration: "2 giờ", deposit: "200.000đ", status: "Đã đặt" },
];

export const highlightMatches: HighlightMatch[] = [
  { id: "m1", title: "7vs7 - Tối Thứ 6", subtitle: "Sân A - 14/07 20:00", playerCount: "10/14 người", statusLabel: "Mở" },
  { id: "m2", title: "5vs5 - Cuối tuần", subtitle: "Sân B - 15/07 18:00", playerCount: "8/10 người", statusLabel: "Mở" },
  { id: "m3", title: "11vs11 - Giao hữu", subtitle: "Sân C - 16/07 19:30", playerCount: "18/22 người", statusLabel: "Sắp đầy" },
];

export const systemAlerts: SystemAlert[] = [
  { id: "s1", title: "Sân D sắp hết hạn bảo trì", description: "Hết hạn: 18/07/2026", actionLabel: "Xem ngay" },
  { id: "s2", title: "5 yêu cầu kèo đang chờ xử lý", description: "", actionLabel: "Xem chi tiết" },
  { id: "s3", title: "3 phản hồi đánh giá mới", description: "", actionLabel: "Xem chi tiết" },
];
