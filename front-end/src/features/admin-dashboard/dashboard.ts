export interface StatCard {
  id: string;
  label: string;
  value: string;
  helperText: string; 
}

export interface RevenuePoint {
  date: string;
  revenue: number; // đơn vị triệu, chỉ dùng để dựng chiều cao cột skeleton
  bookings: number;
}

export interface TimeSlotShare {
  id: string;
  label: string;
  percent: number;
}

export interface ActivityItem {
  id: string;
  description: string;
  time: string;
}

export type BookingStatus =
  | "Đã đặt"
  | "Giữ chỗ"
  | "Chờ xác nhận"
  | "Đã thanh toán";

export interface Booking {
  id: string;
  customerName: string;
  court: string;
  time: string;
  duration: string;
  deposit: string;
  status: BookingStatus;
}

export interface HighlightMatch {
  id: string;
  title: string;
  subtitle: string;
  playerCount: string;
  statusLabel: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
}

export interface OverviewStat{
  monthlyRevenue: number,
  monthlyBookings: number,
  openMatches: number,
  totalCustomers: number,
  reviews: {
    average: number,
    total: number
  } 
}
