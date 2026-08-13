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
      iconClass: "bg-brand-primary/10 text-brand-primary",
      valueClass: "text-text-primary",
      hoverClass: "hover:border-brand-primary/40",
    },
    {
      id: "2",
      label: "Kèo đấu trong tháng",
      value: totalMatchInThisMonth,
      icon: UserPlus,
      iconClass: "bg-brand-accent/10 text-brand-accent",
      valueClass: "text-text-primary",
      hoverClass: "hover:border-brand-accent/40",
    },
    {
      id: "3",
      label: "Đang mở",
      value: open,
      icon: CircleDot,
      iconClass: "bg-status-success-bg text-status-success",
      valueClass: "text-status-success",
      hoverClass: "hover:border-status-success/40",
    },
    {
      id: "4",
      label: "Đã ghép đối",
      value: matched,
      icon: Swords,
      iconClass: "bg-status-warning-bg text-status-warning",
      valueClass: "text-status-warning",
      hoverClass: "hover:border-status-warning/40",
    },
    {
      id: "5",
      label: "Đã kết thúc",
      value: finished,
      icon: CheckCircle2,
      iconClass: "bg-status-info-bg text-status-info",
      valueClass: "text-status-info",
      hoverClass: "hover:border-status-info/40",
    },
    {
      id: "6",
      label: "Đã hủy",
      value: cancelled,
      icon: XCircle,
      iconClass: "bg-status-danger-bg text-status-danger",
      valueClass: "text-status-danger",
      hoverClass: "hover:border-status-danger/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {data.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className={`group border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${stat.hoverClass}`}
          >
            <CardContent className="flex flex-col gap-3 p-4">
              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${stat.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <p className="text-xs font-medium text-text-muted">
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

