import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  customers: number;
  totalUserInThisMonth: number;
  online: number;
  bannedCustomers: number;
}

export function CustomerStatsCards({
  customers,
  totalUserInThisMonth,
  online,
  bannedCustomers,
}: Props) {
  const data = [
    {
      id: "1",
      label: "Tổng khách hàng",
      value: customers,
      icon: Users,
      iconClass:
        "bg-brand-primary/10 text-brand-primary",
      valueClass:
        "text-text-primary",
    },
    {
      id: "2",
      label: "Khách hàng mới (tháng)",
      value: totalUserInThisMonth,
      icon: UserPlus,
      iconClass:
        "bg-brand-accent/10 text-brand-accent",
      valueClass:
        "text-brand-accent",
    },
    {
      id: "3",
      label: "Đang hoạt động",
      value: online,
      icon: ShieldCheck,
      iconClass:
        "bg-status-success-bg text-status-success",
      valueClass:
        "text-status-success",
    },
    {
      id: "4",
      label: "Đã khóa",
      value: bannedCustomers,
      icon: ShieldX,
      iconClass:
        "bg-status-danger-bg text-status-danger",
      valueClass:
        "text-status-danger",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className="group border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-lg"
          >
            <CardContent className="flex flex-col gap-3 p-4">
              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border border-border ${stat.iconClass}`}
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
                {stat.value.toLocaleString("vi-VN")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
