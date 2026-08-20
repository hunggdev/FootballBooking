import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookingStatusCount } from "./types";

interface BookingStatusBreakdownProps {
  data: BookingStatusCount[];
}

export function BookingStatusBreakdown({ data }: BookingStatusBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Trạng thái đặt sân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item) => (
          <div key={item.status} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="outline" className="text-[10px]">
                  {item.status}
                </Badge>
                {item.label}
              </span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div className="h-2 w-full rounded-full border">
              <div
                className="h-full rounded-full border-r"
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
