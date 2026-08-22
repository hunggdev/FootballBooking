import {
  Users,
  UserPlus,
  CircleDot,
  Swords,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  matches: number;
  totalMatchInThisMonth: number;
  open: number;
  matched: number;
  finished: number;
  cancelled: number;
}

export function MatchStatsCards({
  matches,
  totalMatchInThisMonth,
  open,
  matched,
  finished,
  cancelled,
}: Props) {
  const data = [
    {
      id: "1",
      label: "Tổng kèo đấu",
      value: matches,
      icon: Users,
      iconClass: "bg-brand-primary/15 text-brand-primary border border-brand-primary/20",
      valueClass: "text-text-primary",
      hoverClass: "hover:border-brand-primary/50 hover:shadow-[0_4px_20px_rgba(34,165,90,0.12)]",
    },
    {
      id: "2",
      label: "Kèo đấu trong tháng",
      value: totalMatchInThisMonth,
      icon: UserPlus,
      iconClass: "bg-brand-accent/15 text-brand-accent border border-brand-accent/20",
      valueClass: "text-text-primary",
      hoverClass: "hover:border-brand-accent/50 hover:shadow-[0_4px_20px_rgba(245,166,35,0.12)]",
    },
    {
      id: "3",
      label: "Đang mở (tìm đối)",
      value: open,
      icon: CircleDot,
      iconClass: "bg-status-success-bg text-status-success border border-status-success/20",
      valueClass: "text-status-success",
      hoverClass: "hover:border-status-success/50 hover:shadow-[0_4px_20px_rgba(34,165,90,0.12)]",
    },
    {
      id: "4",
      label: "Đã ghép đối",
      value: matched,
      icon: Swords,
      iconClass: "bg-status-warning-bg text-status-warning border border-status-warning/20",
      valueClass: "text-status-warning",
      hoverClass: "hover:border-status-warning/50 hover:shadow-[0_4px_20px_rgba(245,166,35,0.12)]",
    },
    {
      id: "5",
      label: "Đã kết thúc",
      value: finished,
      icon: CheckCircle2,
      iconClass: "bg-status-info-bg text-status-info border border-status-info/20",
      valueClass: "text-status-info",
      hoverClass: "hover:border-status-info/50 hover:shadow-[0_4px_20px_rgba(63,124,186,0.12)]",
    },
    {
      id: "6",
      label: "Đã hủy kèo",
      value: cancelled,
      icon: XCircle,
      iconClass: "bg-status-danger-bg text-status-danger border border-status-danger/20",
      valueClass: "text-status-danger",
      hoverClass: "hover:border-status-danger/50 hover:shadow-[0_4px_20px_rgba(221,59,59,0.12)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
      {data.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className={`group rounded-xl border border-border/80 bg-surface transition-all duration-300 hover:-translate-y-1 ${stat.hoverClass}`}
          >
            <CardContent className="flex flex-col gap-2.5 p-4">
              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <p className="text-[11px] font-medium text-text-muted truncate">
                {stat.label}
              </p>

              {/* Value */}
              <p
                className={`text-2xl font-bold tracking-tight ${stat.valueClass}`}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
