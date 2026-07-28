// src/components/admin/customers/CustomerStatsCards.tsx
import { Users, UserPlus, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  customers: number,
  totalUserInThisMonth: number,
  online: number,
  bannedCustomers: number,
}

export function CustomerStatsCards({customers, totalUserInThisMonth, online, bannedCustomers}: Props) {

  const data = [{
    id: "1",
    label: "Tổng khách hàng",
    value: customers,
    icon: Users
  },
  {
    id: "2",
    label: "Khách hàng mới (tháng)",
    value: totalUserInThisMonth,
    icon: UserPlus
  },
  {
    id: "3",
    label: "Đang hoạt động",
    value: online,
    icon: ShieldCheck
  },
  {
    id: "4",
    label: "Đã khóa",
    value: bannedCustomers,
    icon: ShieldX
  },]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} className="border">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex h-8 w-8 items-center justify-center border">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs opacity-60">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
