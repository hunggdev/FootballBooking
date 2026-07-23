// src/components/home/PromotionBanner.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PromotionBanner() {
  return (
    <Card className="border">
      <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
        <div>
          <p className="text-sm">Giảm giá</p>
          <p className="text-3xl font-bold">20%</p>
          <p className="text-sm">Tất cả khung giờ vàng</p>
          <p className="text-xs opacity-60">Từ 17:00 - 22:00 hàng ngày</p>
        </div>
        <Button variant="outline" className="w-fit border">
          Đặt ngay
        </Button>
      </CardContent>
    </Card>
  );
}
