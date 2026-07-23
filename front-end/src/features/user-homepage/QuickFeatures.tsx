// src/components/home/QuickFeatures.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { QuickFeatureItem } from "@/types/home.ts";

const features: QuickFeatureItem[] = [
  { id: "1", title: "Nhiều sân lựa chọn", subtitle: "Đa dạng vị trí, chất lượng" },
  { id: "2", title: "Đặt sân tức thì", subtitle: "Xác nhận trong 10 phút" },
  { id: "3", title: "Thanh toán dễ dàng", subtitle: "Nhiều phương thức" },
  { id: "4", title: "Ưu đãi hấp dẫn", subtitle: "Giảm giá thường xuyên" },
  { id: "5", title: "Cộng đồng bóng đá", subtitle: "Kết nối đam mê" },
];

export function QuickFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {features.map((feature) => (
          <Card key={feature.id} className="border">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex h-8 w-8 items-center justify-center border text-xs">
                icon
              </div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs opacity-60">{feature.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
