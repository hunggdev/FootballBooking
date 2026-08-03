// src/components/admin/customers/CustomerStatsCards.tsx
import { Users, UserPlus, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  matches: number,
  totalMatchInThisMonth: number,
  open: number,
  matched: number,
  finished: number,
  cancelled: number,
}

export function MatchStatsCards({matches, totalMatchInThisMonth, open, matched, finished, cancelled}: Props) {

  const data = [{
    id: "1",
    label: "Tổng kèo đấu",
    value: matches,
    icon: Users
  },
  {
    id: "2",
    label: "Số kèo đấu trong tháng mới",
    value: totalMatchInThisMonth,
    icon: UserPlus
  },
  {
    id: "3",
    label: "Đang mở",
    value: open,
    icon: ShieldCheck
  },
  {
    id: "4",
    label: "Đã đặt",
    value: matched,
    icon: ShieldX
  },
  {
    id: "5",
    label: "Đã kết thúc",
    value: finished,
    icon: ShieldX
  },
  {
    id: "6",
    label: "Đã hủy",
    value: cancelled,
    icon: ShieldX
  },]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
