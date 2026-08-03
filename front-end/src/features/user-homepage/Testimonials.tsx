import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./TestimonialCard";
import api from "@/lib/api";
import type { Review } from "@/types/review";
import { Loader2, MessageSquare } from "lucide-react";

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

  // Pick top 3-6 latest or highest rated reviews
  const topReviews = reviews.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tổng hợp các đánh giá và cảm nhận thực tế từ các đội bóng đã trải nghiệm dịch vụ.
          </p>
        </div>

        <Button
          variant="link"
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          onClick={() => navigate("/user/reviews")}
        >
          Xem tất cả đánh giá ({reviews.length}) →
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải đánh giá từ khách hàng...
        </div>
      ) : topReviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          Chưa có đánh giá nào từ người chơi. Hãy trải nghiệm và là người đầu tiên để lại nhận xét!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {topReviews.map((r) => (
            <TestimonialCard key={r.reviewId} review={r} />
          ))}
        </div>
      )}
    </section>
  );
}
