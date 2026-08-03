import { useEffect, useState } from "react";
import { Users, UserRound, MapPinned, CalendarDays, Receipt, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import type { StatItem } from "./types";
import api from "@/lib/api";

export default function DashboardOverview() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        const dashboard = res.data.data;

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

        const statKeys = [
          "totalUsers",
          "totalCustomers",
          "totalFields",
          "totalBookings",
          "totalInvoices",
          "totalRevenue",
        ] as const;

        const statsArray: StatItem[] = statKeys.map((key) => ({
          id: key,
          label: labelMap[key],
          value: Number(dashboard[key] ?? 0),
          icon: iconMap[key] ?? Users,
        }));

        setStats(statsArray);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Đang tải Dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tổng quan hệ thống</h2>
      <StatsGrid stats={stats} />
    </div>
  );
}
