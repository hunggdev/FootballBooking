// src/components/home/FieldCard.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FieldItem } from "@/types/home.ts";

const statusLabel: Record<FieldItem["status"], string> = {
  available: "Còn trống",
  "almost-full": "Sắp full",
  full: "Đã đầy",
};

export function FieldCard({ field }: { field: FieldItem }) {
  return (
    <Card className="border">
      {/* Image placeholder */}
      <div className="relative flex h-36 items-center justify-center border-b border-dashed text-xs opacity-60">
        [ Hình ảnh sân ]
        <div className="absolute left-2 top-2">
          <Badge variant="outline">★ {field.rating}</Badge>
        </div>
        <div className="absolute right-2 top-2">
          <Badge variant="outline">{statusLabel[field.status]}</Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-1 p-4">
        <p className="text-sm font-medium">{field.name}</p>
        <p className="text-xs opacity-60">{field.address}</p>
        <p className="text-sm">
          Từ <span className="font-medium">{field.pricePerHour.toLocaleString("vi-VN")}đ</span>/giờ
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {field.isArtificialGrass && <Badge variant="outline">Cỏ nhân tạo</Badge>}
          <Badge variant="outline">{field.capacity}</Badge>
          {field.hasLight && <Badge variant="outline">Có đèn</Badge>}
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button variant="outline" className="w-full border">
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
