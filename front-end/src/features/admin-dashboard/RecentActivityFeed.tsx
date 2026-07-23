// src/components/admin/dashboard/RecentActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Trophy, CheckCircle2, DollarSign, RotateCcw } from "lucide-react";
import type { ActivityItem } from "./types";

const activities: ActivityItem[] = [
  { id: "1", icon: CalendarCheck, description: "Nguyễn Văn A vừa đặt sân Sân A", time: "18:20 - 14/07/2026" },
  { id: "2", icon: Trophy, description: "Trần Văn Bình vừa tạo kèo 7vs7", time: "17:45 - 14/07/2026" },
  { id: "3", icon: CheckCircle2, description: "Admin xác nhận đặt sân Sân B", time: "17:30 - 14/07/2026" },
  { id: "4", icon: DollarSign, description: "Lê Thị Mai vừa thanh toán thành công", time: "16:50 - 14/07/2026" },
  { id: "5", icon: RotateCcw, description: "Hoàn tiền cọc cho khách hàng #KH1056", time: "15:10 - 14/07/2026" },
];

export function RecentActivityFeed() {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
        <Button variant="link" className="text-sm">
          Xem tất cả →
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 border p-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs opacity-60">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
