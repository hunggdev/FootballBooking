import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ShieldCheck } from "lucide-react";
import type { Review } from "@/types/review";
import dayjs from "dayjs";

export function TestimonialCard({ review }: { review: Review }) {
  const userName = review.user?.fullName || "Khách hàng";
  const dateStr = review.createdAt
    ? dayjs(review.createdAt).format("DD/MM/YYYY")
    : "";
  const fieldName = review.field?.name;

  return (
    <Card
      className="
        group
        flex
        flex-col
        justify-between
        overflow-hidden
        rounded-xl
        border-border
        bg-surface
        text-text-primary
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-brand-primary/40
        hover:bg-surface-hover
        hover:shadow-md
      "
    >
      {/* Header */}
      <CardHeader
        className="
          flex
          flex-row
          items-center
          gap-3
          border-b
          border-border
          bg-surface-hover/30
          p-4
        "
      >
        {/* Avatar */}
        <Avatar
          className="
            h-10
            w-10
            shrink-0
            border
            border-brand-primary/30
          "
        >
          <AvatarFallback
            className="
              bg-brand-primary/10
              font-bold
              text-brand-primary
            "
          >
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User information */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-text-primary">
            {userName}
          </p>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
            {fieldName && (
              <>
                <span className="truncate font-medium text-brand-primary">
                  {fieldName}
                </span>

                <span className="shrink-0 text-text-muted">•</span>
              </>
            )}

            <span className="shrink-0">{dateStr}</span>
          </div>
        </div>

        {/* Rating */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-0.5
            rounded-md
            bg-status-warning-bg
            px-1.5
            py-1
          "
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={
                star <= review.rating
                  ? "h-3.5 w-3.5 fill-rating-star text-rating-star"
                  : "h-3.5 w-3.5 fill-transparent text-text-muted/30"
              }
            />
          ))}
        </div>
      </CardHeader>

      {/* Review content */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm leading-6 italic text-text-secondary">
          “{review.comment ||
            "Sân bóng chất lượng tuyệt vời, phục vụ chu đáo."}”
        </p>

        {/* Manager reply */}
        {review.reply && (
          <div
            className="
              mt-auto
              rounded-lg
              border
              border-brand-primary/20
              bg-brand-primary/5
              p-3
            "
          >
            <p
              className="
                mb-1
                flex
                items-center
                gap-1.5
                text-[11px]
                font-bold
                text-brand-primary
              "
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Phản hồi từ Quản lý sân
            </p>

            <p className="text-[11px] leading-5 text-text-secondary">
              {review.reply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}