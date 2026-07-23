// src/components/admin/dashboard/FeaturedOddsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Swords } from "lucide-react";
import type { FeaturedOdds } from "./types";

const statusLabel: Record<FeaturedOdds["status"], string> = {
  open: "Mở",
  "almost-full": "Sắp đầy",
  closed: "Đã đóng",
};

const odds: FeaturedOdds[] = [
  { id: "1", title: "7vs7 - Tối Thứ 6", location: "Sân A - 14/07 20:00", participants: "10/14 người", status: "open" },
  { id: "2", title: "5vs5 - Cuối tuần", location: "Sân B - 15/07 18:00", participants: "8/10 người", status: "open" },
  { id: "3", title: "11vs11 - Giao hữu", location: "Sân C - 16/07 19:30", participants: "18/22 người", status: "almost-full" },
];

const icons = [Trophy, Users, Swords];

export function FeaturedOddsList() {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Kèo đấu nổi bật</CardTitle>
        <Button variant="link" className="text-sm">
          Xem tất cả →
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {odds.map((item, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <div key={item.id} className="flex items-center gap-3 border p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs opacity-60">{item.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs opacity-60">{item.participants}</span>
                <Badge variant="outline">{statusLabel[item.status]}</Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
