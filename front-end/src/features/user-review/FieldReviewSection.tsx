import { useState } from "react";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";
import dayjs from "dayjs";

import { useFieldReviews } from "@/stores/useReviewStore";
import { useMyBookings } from "@/stores/useBookingStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FeedbackForm from "@/features/user-review/FeedbackForm";

interface FieldReviewSectionProps {
  fieldId: number;
  fieldName: string;
}

export function FieldReviewSection({
  fieldId,
  fieldName,
}: FieldReviewSectionProps) {
  const { data: reviews = [], isLoading } = useFieldReviews(fieldId);
  const { data: myBookings = [] } = useMyBookings();
  const [openReviewModal, setOpenReviewModal] = useState(false);

  // Check if current user has an unreviewed confirmed booking for THIS field
  const unreviewedBookingForThisField = myBookings.find(
    (b) =>
      b.status === "CONFIRMED" &&
      !b.review &&
      b.fieldSlot?.field?.fieldId === fieldId,
  );

  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (
        reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      ).toFixed(1)
      : "5.0";

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-border bg-surface p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-text-primary">
            <MessageSquare className="h-5 w-5 text-brand-primary" />

            Đánh giá & Nhận xét sân {fieldName}
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Tổng hợp điểm số và ý kiến đóng góp từ các đội bóng đã trải nghiệm
            sân này.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Rating summary */}
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-hover/40 px-3 py-1.5">
            <div className="flex items-center gap-1 text-lg font-bold text-rating-star">
              <Star className="h-5 w-5 fill-rating-star text-rating-star" />
              {avgRating}
            </div>

            <span className="text-xs text-text-secondary">
              ({totalReviews} đánh giá)
            </span>
          </div>

          {/* Review button */}
          {unreviewedBookingForThisField && (
            <Button
              size="sm"
              className="bg-brand-primary font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-hover"
              onClick={() => setOpenReviewModal(true)}
            >
              <MessageSquarePlus className="mr-1.5 h-4 w-4" />
              Đánh giá sân này
            </Button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-sm text-text-secondary">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-primary" />
          Đang tải đánh giá sân...
        </div>
      ) : reviews.length === 0 ? (
        /* Empty */
        <p className="py-6 text-center text-sm text-text-secondary">
          Sân này chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và để
          lại nhận xét!
        </p>
      ) : (
        /* Reviews */
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          {reviews.map((review) => (
            <Card
              key={review.reviewId}
              className="border-border bg-surface shadow-xs"
            >
              <CardHeader className="border-b border-border-subtle bg-surface-hover/30 p-3.5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {review.user?.fullName || "Khách hàng"}
                  </span>

                  <span className="text-[11px] text-text-muted">
                    {review.createdAt
                      ? dayjs(review.createdAt).format("DD/MM/YYYY")
                      : ""}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 p-3.5">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= review.rating
                          ? "fill-rating-star text-rating-star"
                          : "fill-text-muted/10 text-text-muted/40"
                        }`}
                    />
                  ))}

                  <span className="ml-1 text-xs font-bold text-text-secondary">
                    {review.rating}/5
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs italic leading-relaxed text-text-primary/90">
                  "{review.comment || "Không có lời nhắn thêm."}"
                </p>

                {/* Admin reply */}
                {review.reply && (
                  <div className="rounded-md border border-brand-primary/30 bg-brand-primary/10 p-2.5 text-xs">
                    <p className="mb-1 flex items-center gap-1 text-[11px] font-bold text-brand-primary">
                      <ShieldCheck className="h-3 w-3" />
                      Phản hồi từ Quản lý sân:
                    </p>

                    <p className="text-[11px] leading-relaxed text-text-secondary">
                      {review.reply}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog for current user */}
      {unreviewedBookingForThisField && (
        <Dialog
          open={openReviewModal}
          onOpenChange={setOpenReviewModal}
        >
          <DialogContent className="border-border bg-elevated text-text-primary sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <Star className="h-5 w-5 fill-rating-star text-rating-star" />
                Đánh giá chất lượng sân {fieldName}
              </DialogTitle>

              <DialogDescription className="text-text-secondary">
                Chia sẻ đánh giá của bạn về mặt sân, chiếu sáng và thái độ phục
                vụ.
              </DialogDescription>
            </DialogHeader>

            <FeedbackForm
              bookingId={unreviewedBookingForThisField.bookingId}
              onSuccess={() => setOpenReviewModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}