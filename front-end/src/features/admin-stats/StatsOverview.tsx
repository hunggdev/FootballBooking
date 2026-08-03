import { useEffect, useState } from "react";
import { Users, UserRound, MapPinned, CalendarDays, Receipt, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatsGrid } from "@/features/admin-dashboard/StatsGrid";
import type { StatItem } from "@/features/admin-dashboard/types";
import { BookingStatusChart } from "./BookingStatusChart";
import { TopFieldsCard } from "./TopFieldsCard";
import type { DashboardStats } from "./types";
import api from "@/lib/api";

const iconMap: Record<string, LucideIcon> = {
  totalUsers: Users,
  totalCustomers: UserRound,
  totalFields: MapPinned,
  totalBookings: CalendarDays,
  totalInvoices: Receipt,
  totalRevenue: Wallet,
};

const labelMap: Record<string, string> = {
  totalUsers: "Tổng người dùng",
  totalCustomers: "Khách hàng",
  totalFields: "Sân bóng",
  totalBookings: "Lượt đặt sân",
  totalInvoices: "Hóa đơn",
  totalRevenue: "Doanh thu",
};

export default function StatsOverview() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setDashboard(res.data.data);
      } catch (err) {
        console.error("Stats Error:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Đang tải thống kê...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;
  if (!dashboard) return null;

  const stats: StatItem[] = (
    ["totalUsers", "totalCustomers", "totalFields", "totalBookings", "totalInvoices", "totalRevenue"] as const
  ).map((key) => ({
    id: key,
    label: labelMap[key],
    value: dashboard[key],
    icon: iconMap[key],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Thống kê hệ thống</h2>
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BookingStatusChart data={dashboard.bookingStatus} />
        <TopFieldsCard data={dashboard.topFields} />
      </div>
    </div>
  );
}
