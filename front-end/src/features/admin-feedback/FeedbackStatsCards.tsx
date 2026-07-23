// src/components/admin/feedback/FeedbackStatsCards.tsx
import { Star, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { id: "1", label: "Tổng đánh giá", value: "1.286", icon: MessageSquare },
  { id: "2", label: "Đánh giá trung bình", value: "4.8 / 5", icon: Star },
  { id: "3", label: "Chưa phản hồi", value: "18", icon: Clock },
];

export function FeedbackStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
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
