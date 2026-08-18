import {
  Building2,
  CalendarCheck2,
  CreditCard,
  Gift,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { QuickFeatureItem } from "@/types/home.ts";

const features: QuickFeatureItem[] = [
  {
    id: "1",
    title: "Nhiều sân lựa chọn",
    subtitle: "Đa dạng vị trí, chất lượng",
  },
  {
    id: "2",
    title: "Đặt sân tức thì",
    subtitle: "Xác nhận trong 10 phút",
  },
  {
    id: "3",
    title: "Thanh toán dễ dàng",
    subtitle: "Nhiều phương thức",
  },
  {
    id: "4",
    title: "Ưu đãi hấp dẫn",
    subtitle: "Giảm giá thường xuyên",
  },
  {
    id: "5",
    title: "Cộng đồng bóng đá",
    subtitle: "Kết nối đam mê",
  },
];

const featureIcons: Record<string, LucideIcon> = {
  "1": Building2,
  "2": CalendarCheck2,
  "3": CreditCard,
  "4": Gift,
  "5": Users,
};

export function QuickFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {features.map((feature) => {
          const Icon = featureIcons[feature.id];

          return (
            <Card
              key={feature.id}
              className="
                group
                border-border
                bg-surface
                text-text-primary
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-brand-primary/50
                hover:bg-surface-hover
                hover:shadow-md
              "
            >
              <CardContent className="flex flex-col gap-3 p-4">
                <div
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg
                    bg-status-success-bg
                    transition-colors
                    duration-200
                    group-hover:bg-brand-primary
                  "
                >
                  <Icon
                    className="
                      h-4 w-4
                      text-brand-primary
                      transition-colors
                      duration-200
                      group-hover:text-white
                    "
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-5 text-text-primary">
                    {feature.title}
                  </p>

                  <p className="text-xs leading-4 text-text-secondary">
                    {feature.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}