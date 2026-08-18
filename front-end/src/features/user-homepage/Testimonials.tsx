import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./TestimonialCard";
import api from "@/lib/api";
import type { Review } from "@/types/review";
import {
  Loader2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export function Testimonials() {
  const navigate = useNavigate();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["homepage-reviews"],
    queryFn: async () => {
      const res = await api.get("/reviews");
      return res.data.reviews ?? [];
    },
    staleTime: 0,
    refetchInterval: 5000,
  });

  const topReviews = reviews.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {/* Section label */}
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-brand-primary" />

            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Đánh giá
            </span>
          </div>

          {/* Title */}
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-text-primary">
            <MessageSquare className="h-5 w-5 text-brand-primary" />
            Khách hàng nói gì về chúng tôi
          </h2>

          {/* Description */}
          <p className="mt-1 max-w-2xl text-xs leading-5 text-text-secondary">
            Tổng hợp các đánh giá và cảm nhận thực tế từ các đội bóng
            đã trải nghiệm dịch vụ.
          </p>
        </div>

        {/* View all */}
        <Button
          variant="ghost"
          className="
            shrink-0
            self-start
            px-2
            text-sm
            font-semibold
            text-brand-primary
            hover:bg-brand-primary/10
            hover:text-brand-primary
            sm:self-auto
          "
          onClick={() => navigate("/user/reviews")}
        >
          Xem tất cả đánh giá ({reviews.length})
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* ================= CONTENT ================= */}
      {isLoading ? (
        <div
          className="
            flex
            min-h-[220px]
            items-center
            justify-center
            rounded-xl
            border
            border-border
            bg-surface
            text-sm
            text-text-secondary
          "
        >
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-primary" />

          Đang tải đánh giá từ khách hàng...
        </div>
      ) : topReviews.length === 0 ? (
        <div
          className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-border
            bg-surface
            px-6
            text-center
          "
        >
          <div
            className="
              mb-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-brand-primary/10
            "
          >
            <MessageSquare className="h-5 w-5 text-brand-primary" />
          </div>

          <p className="text-sm font-semibold text-text-primary">
            Chưa có đánh giá nào
          </p>

          <p className="mt-1 max-w-md text-xs leading-5 text-text-secondary">
            Hãy trải nghiệm dịch vụ và trở thành người đầu tiên
            để lại nhận xét về sân bóng.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {topReviews.map((review) => (
            <TestimonialCard
              key={review.reviewId}
              review={review}
            />
          ))}
        </div>
      )}
    </section>
  );
}