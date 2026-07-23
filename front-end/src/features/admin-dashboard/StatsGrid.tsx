// src/components/admin/dashboard/StatsGrid.tsx
import { DollarSign, CalendarCheck, ShieldCheck, Trophy, Users, Star } from "lucide-react";
import { StatCard } from "./StatCard";
import type { StatItem } from "./types";

const stats: StatItem[] = [
  { id: "1", label: "Tổng doanh thu (tháng)", value: "735.000.000đ", changeLabel: "↑ 18.6% so với tháng trước", icon: DollarSign },
  { id: "2", label: "Lượt đặt sân (tháng)", value: "1.247", changeLabel: "↑ 14.3% so với tháng trước", icon: CalendarCheck },
  { id: "3", label: "Sân đang hoạt động", value: "24 / 28 sân", icon: ShieldCheck },
  { id: "4", label: "Kèo đấu đang mở", value: "32", changeLabel: "↑ 8 kèo mới hôm nay", icon: Trophy },
  { id: "5", label: "Khách hàng", value: "2.586", changeLabel: "↑ 12.5% so với tháng trước", icon: Users },
  { id: "6", label: "Đánh giá trung bình", value: "4.8 / 5", changeLabel: "Từ 1.286 đánh giá", icon: Star },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
