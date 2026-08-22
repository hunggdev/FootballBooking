// src/features/admin-dashboard/StatsSummary.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { OverviewStat } from "./dashboard";
import { Coins, CalendarCheck, Swords, Users, Star } from "lucide-react";

interface StatsSummaryProps {
  overviewStats?: OverviewStat;
  isLoading?: boolean;
}

export function StatsSummary({ overviewStats, isLoading }: StatsSummaryProps) {
  const displayStats = [
    {
      id: "1",
      label: "Doanh thu tháng",
      value: overviewStats?.monthlyRevenue
        ? `${Number(overviewStats.monthlyRevenue).toLocaleString("vi-VN")} đ`
        : "0 đ",
      helperText: "Doanh thu thực nhận",
      icon: Coins,
      iconClass:
        "bg-brand-accent/15 text-brand-accent border border-brand-accent/25",
      valueClass: "text-brand-accent font-bold text-xl sm:text-2xl",
      hoverClass:
        "hover:border-brand-accent/50 hover:shadow-[0_4px_20px_rgba(245,166,35,0.12)]",
    },
    {
      id: "2",
      label: "Lượt đặt sân (tháng)",
      value: overviewStats?.monthlyBookings?.toLocaleString("vi-VN") || "0",
      helperText: "Đơn đặt trong tháng",
      icon: CalendarCheck,
      iconClass:
        "bg-brand-primary/15 text-brand-primary border border-brand-primary/25",
      valueClass: "text-text-primary font-bold text-xl sm:text-2xl",
      hoverClass:
        "hover:border-brand-primary/50 hover:shadow-[0_4px_20px_rgba(34,165,90,0.12)]",
    },
    {
      id: "3",
      label: "Kèo đấu đang mở",
      value: overviewStats?.openMatches?.toLocaleString("vi-VN") || "0",
      helperText: "Đang tìm đối thủ",
      icon: Swords,
      iconClass:
        "bg-status-success-bg text-status-success border border-status-success/25",
      valueClass: "text-status-success font-bold text-xl sm:text-2xl",
      hoverClass:
        "hover:border-status-success/50 hover:shadow-[0_4px_20px_rgba(34,165,90,0.12)]",
    },
    {
      id: "4",
      label: "Tổng khách hàng",
      value: overviewStats?.totalCustomers?.toLocaleString("vi-VN") || "0",
      helperText: "Người dùng đăng ký",
      icon: Users,
      iconClass:
        "bg-status-info-bg text-status-info border border-status-info/25",
      valueClass: "text-text-primary font-bold text-xl sm:text-2xl",
      hoverClass:
        "hover:border-status-info/50 hover:shadow-[0_4px_20px_rgba(63,124,186,0.12)]",
    },
    {
      id: "5",
      label: "Đánh giá trung bình",
      value: overviewStats?.reviews?.average
        ? `${Number(overviewStats.reviews.average).toFixed(1)} / 5.0`
        : "5.0 / 5.0",
      helperText: `Từ ${overviewStats?.reviews?.total || 0} lượt đánh giá`,
      icon: Star,
      iconClass: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
      valueClass: "text-amber-400 font-bold text-xl sm:text-2xl",
      hoverClass:
        "hover:border-amber-500/50 hover:shadow-[0_4px_20px_rgba(245,158,11,0.12)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-5">
      {displayStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className={`group rounded-xl border border-border/80 bg-surface transition-all duration-300 hover:-translate-y-1 ${stat.hoverClass}`}
          >
            <CardContent className="flex flex-col gap-2.5 p-4">
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-text-muted truncate">
                  {stat.label}
                </span>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${stat.iconClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-1">
                <p className={`tracking-tight ${stat.valueClass}`}>
                  {isLoading ? (
                    <span className="animate-pulse opacity-40">--</span>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-1 text-[11px] text-text-muted truncate">
                  {stat.helperText}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
