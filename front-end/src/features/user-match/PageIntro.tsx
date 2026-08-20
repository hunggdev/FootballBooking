import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, ShieldCheck } from "lucide-react";

const highlights = [
  {
    title: "Tìm kèo dễ dàng",
    description: "Nhiều kèo phù hợp với bạn mỗi ngày",
    icon: Search,
  },
  {
    title: "Kết nối nhanh chóng",
    description: "Giao lưu, kết nối cộng đồng bóng đá đam mê",
    icon: Users,
  },
  {
    title: "Công bằng & minh bạch",
    description: "Thông tin rõ ràng, chơi có trách nhiệm",
    icon: ShieldCheck,
  },
];

export function PageIntro() {
  return (
    <section className="space-y-4">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Kèo đấu
        </h1>

        <p className="mt-1 text-sm text-text-muted">
          Tìm kèo hay – Gặp đối chất – Đá hết mình
        </p>
      </div>

      {/* Highlights */}
      <Card className="border-border bg-surface">
        <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex items-start gap-3
                  rounded-md
                  border border-border
                  bg-elevated
                  p-3
                  transition-colors
                  hover:border-brand-primary/50
                  hover:bg-surface-hover
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border border-brand-primary/30
                    bg-brand-primary/10
                    text-brand-primary
                  "
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}