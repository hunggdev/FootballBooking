// src/components/admin/types.ts
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  hasChevron?: boolean;
}

export interface NavGroup {
  id: string;
  title?: string; // không có title = nhóm đứng riêng (vd: "Tổng quan")
  items: NavItem[];
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  changeLabel?: string;
  icon: LucideIcon;
}

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  description: string;
  time: string;
}

export interface FeaturedOdds {
  id: string;
  title: string; // "7vs7 - Tối Thứ 6"
  location: string; // "Sân A - 14/07 20:00"
  participants: string; // "10/14 người"
  status: "open" | "almost-full" | "closed";
}

export interface SystemAlert {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actionLabel: string;
  urgent?: boolean;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
  bookings: number;
}

export interface DonutSlice {
  label: string;
  percentage: number;
}

export interface BookingRow {
  id: string; // "#DS1267"
  customerName: string;
  fieldName: string;
  dateTime: string; // "14/07/2026 - 20:00"
  duration: string; // "2 giờ"
  deposit: number;
  status: "booked" | "held" | "pending-confirm" | "paid";
}

export interface Customer {
  userId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  totalBookings: number;
  totalSpent: number;
  lastBookingAt?: string | null;
  status: "active" | "inactive" | "banned";
  createdAt: string;
}

export interface CustomerBookingHistoryRow {
  id: string; // "#DS1267"
  fieldName: string;
  dateTime: string;
  amount: number;
  status: "booked" | "held" | "pending-confirm" | "paid" | "cancelled";
}

export interface Account {
  accountId: number;
  fullName: string;
  email: string;
  role: "customer";
  status: "active" | "locked";
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Feedback {
  id: string;
  customerName: string;
  fieldName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  status: "pending" | "replied";
  adminReply?: string | null;
}

export interface TimeSlot {
  id: string;
  starttime: string; // "06:00"
  endtime: string; // "07:00"
  price: number;
  status: "available" | "booked" | "closed";
}

export interface SportsField {
  id: string;
  name: string;
  address: string;
  type: string; // "Sân 5", "Sân 7", "Sân 11"
  status: "active" | "maintenance" | "inactive";
  slotCount: number;
}

export interface Service {
  id: string;
  name: string;
  category: string; // "Nước uống", "Thuê đồ", "Trọng tài"...
  price: number;
  unit: string; // "chai", "bộ", "trận"
  status: "active" | "inactive";
}

export interface OddsMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  handicap: string; // "1.5"
  oddsHome: number;
  oddsAway: number;
  status: "open" | "locked" | "settled";
}

export interface RevenueSummary {
  id: string;
  label: string;
  value: string;
  changeLabel?: string;
}
