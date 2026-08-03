import { useState } from "react";
import { Star, ShieldCheck, MessageSquare, Loader2, MessageSquarePlus } from "lucide-react";
import dayjs from "dayjs";

import { useFieldReviews } from "@/stores/useReviewStore";
import { useMyBookings } from "@/stores/useBookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function FieldReviewSection({ fieldId, fieldName }: FieldReviewSectionProps) {
  const { data: reviews = [], isLoading } = useFieldReviews(fieldId);
  const { data: myBookings = [] } = useMyBookings();
  const [openReviewModal, setOpenReviewModal] = useState(false);

  // Check if current user has an unreviewed confirmed booking for THIS field
  const unreviewedBookingForThisField = myBookings.find(
    (b) =>
      b.status === "CONFIRMED" &&
      !b.review &&
      b.fieldSlot?.field?.fieldId === fieldId
  );

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 mt-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            Đánh giá & Nhận xét sân {fieldName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tổng hợp điểm số và ý kiến đóng góp từ các đội bóng đã trải nghiệm sân này.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5">
            <div className="flex items-center gap-1 font-bold text-amber-400 text-lg">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              {avgRating}
            </div>
            <span className="text-xs text-muted-foreground">({totalReviews} đánh giá)</span>
          </div>

          {unreviewedBookingForThisField && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
              onClick={() => setOpenReviewModal(true)}
            >
              <MessageSquarePlus className="mr-1.5 h-4 w-4" />
              Đánh giá sân này
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải đánh giá sân...
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Sân này chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và để lại nhận xét!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {reviews.map((review) => (
            <Card key={review.reviewId} className="border shadow-xs">
              <CardHeader className="p-3.5 pb-2 bg-muted/10 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {review.user?.fullName || "Khách hàng"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {review.createdAt ? dayjs(review.createdAt).format("DD/MM/YYYY") : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-3.5 space-y-2.5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold">{review.rating}/5</span>
                </div>

                <p className="text-xs italic text-foreground/90">
                  "{review.comment || "Không có lời nhắn thêm."}"
                </p>

                {review.reply && (
                  <div className="rounded-md border border-primary/30 bg-primary/10 p-2.5 text-xs">
                    <p className="flex items-center gap-1 font-bold text-primary mb-0.5 text-[11px]">
                      <ShieldCheck className="h-3 w-3" /> Phản hồi từ Quản lý sân:
                    </p>
                    <p className="text-muted-foreground text-[11px]">{review.reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog for current user */}
      {unreviewedBookingForThisField && (
        <Dialog open={openReviewModal} onOpenChange={setOpenReviewModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                Đánh giá chất lượng sân {fieldName}
              </DialogTitle>
              <DialogDescription>
                Chia sẻ đánh giá của bạn về mặt sân, chiếu sáng và thái độ phục vụ.
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
