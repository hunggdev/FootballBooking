// src/components/admin/dashboard/RevenueChartCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChartDataPoint } from "./types";

const data: ChartDataPoint[] = [
  { label: "08/07", revenue: 175, bookings: 60 },
  { label: "09/07", revenue: 130, bookings: 45 },
  { label: "10/07", revenue: 110, bookings: 40 },
  { label: "11/07", revenue: 150, bookings: 55 },
  { label: "12/07", revenue: 105, bookings: 42 },
  { label: "13/07", revenue: 155, bookings: 58 },
  { label: "14/07", revenue: 140, bookings: 50 },
];

// Chiều cao cột tính theo % so với giá trị lớn nhất, chỉ minh họa bố cục - không dùng màu
const maxRevenue = Math.max(...data.map((d) => d.revenue));

export function RevenueChartCard() {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Doanh thu 7 ngày qua</CardTitle>
        <Select>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="7 ngày qua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 ngày qua</SelectItem>
            <SelectItem value="30d">30 ngày qua</SelectItem>
            <SelectItem value="90d">90 ngày qua</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex gap-4 text-xs opacity-60">
          <span>■ Doanh thu (đ)</span>
          <span>■ Lượt đặt sân</span>
        </div>
        <div className="flex h-56 items-end justify-between gap-3 border-b border-l px-2 pb-2">
          {data.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-48 w-full items-end justify-center gap-1">
                <div
                  className="w-3 border"
                  style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
                />
                <div
                  className="w-3 border"
                  style={{ height: `${(point.bookings / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="text-[11px] opacity-60">{point.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
