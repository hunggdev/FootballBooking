import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3, Tag } from "lucide-react";
import { useNavigate } from "react-router";

export function PromotionBanner() {
  const navigate = useNavigate();
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border-border
        bg-surface
        text-text-primary
        shadow-sm
        transition-all
        duration-300
        hover:border-brand-accent/50
        hover:bg-surface-hover
        hover:shadow-lg
        hover:shadow-black/20
      "
    >
      {/* Decorative background */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-brand-accent/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-brand-accent/15
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          h-36
          w-36
          rounded-full
          bg-brand-primary/10
          blur-3xl
        "
      />

      <CardContent
        className="
          relative
          flex
          h-full
          flex-col
          justify-between
          gap-5
          p-5
        "
      >
        {/* Content */}
        <div>
          {/* Label */}
          <div className="mb-3 flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-status-warning-bg
              "
            >
              <Tag className="h-4 w-4 text-brand-accent" />
            </div>

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-brand-accent
              "
            >
              Ưu đãi đặc biệt
            </span>
          </div>

          {/* Discount */}
          <div className="flex items-baseline gap-2">
            <span
              className="
                text-4xl
                font-extrabold
                tracking-tight
                text-brand-accent
              "
            >
              20%
            </span>

            <span className="text-sm font-semibold text-text-primary">
              GIẢM GIÁ
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-text-primary">
            Tất cả khung giờ vàng
          </p>

          {/* Time */}
          <div className="mt-2 flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-text-muted" />

            <p className="text-xs text-text-secondary">
              Từ 17:00 - 22:00 hàng ngày
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          className="
            w-fit
            border-brand-accent/50
            bg-transparent
            px-5
            text-xs
            font-semibold
            text-brand-accent
            transition-all
            duration-200
            hover:border-brand-accent
            hover:bg-brand-accent
            hover:text-accent-foreground
          "
          onClick={() => navigate("/user/booking")}
        >
          Đặt ngay
          <span className="ml-1.5">→</span>
        </Button>
      </CardContent>
    </Card>
  );
}
