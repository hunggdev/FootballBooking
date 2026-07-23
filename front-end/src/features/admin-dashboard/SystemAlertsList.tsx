// src/components/admin/dashboard/SystemAlertsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Star } from "lucide-react";
import type { SystemAlert } from "./types";

const alerts: SystemAlert[] = [
  {
    id: "1",
    icon: AlertTriangle,
    title: "Sân D sắp hết hạn bảo trì",
    subtitle: "Hết hạn: 18/07/2026",
    actionLabel: "Xem ngay",
    urgent: true,
  },
  {
    id: "2",
    icon: HelpCircle,
    title: "5 yêu cầu kèo đang chờ xử lý",
    actionLabel: "Xem chi tiết",
  },
  {
    id: "3",
    icon: Star,
    title: "3 phản hồi đánh giá mới",
    actionLabel: "Xem chi tiết",
  },
];

export function SystemAlertsList() {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Cảnh báo hệ thống</CardTitle>
        <Button variant="link" className="text-sm">
          Xem tất cả →
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="flex items-center gap-3 border p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.title}</p>
                {alert.subtitle && <p className="text-xs opacity-60">{alert.subtitle}</p>}
              </div>
              <Button variant="outline" size="sm" className="border">
                {alert.actionLabel}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
