// src/components/admin/dashboard/BookingTimeDonutCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonutSlice } from "./types";

const slices: DonutSlice[] = [
  { label: "Sáng (05-11h)", percentage: 28 },
  { label: "Trưa (11-14h)", percentage: 19 },
  { label: "Chiều (14-17h)", percentage: 25 },
  { label: "Tối (17-22h)", percentage: 28 },
];

export function BookingTimeDonutCard() {
  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-base">Tỷ lệ đặt sân theo khung giờ</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        {/* Placeholder cho donut chart - chỉ dựng khung, không dùng màu */}
        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border text-xs opacity-60">
            Donut chart
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 text-sm">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between border-b pb-1 last:border-b-0">
              <span className="flex items-center gap-2 opacity-80">
                <span className="h-2 w-2 border" />
                {slice.label}
              </span>
              <span className="font-medium">{slice.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
