import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Loader2,
  MessageSquarePlus,
  Filter,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMyBookings } from "@/stores/useBookingStore";
import { useFields } from "@/stores/useFieldStore";
import FeedbackForm from "@/features/user-review/FeedbackForm";
import type { Review } from "@/types/review";
import type { FieldType } from "@/types/field";
import type { Booking } from "@/types/booking";
import dayjs from "dayjs";

export default function ReviewPage() {
  const [selectedType, setSelectedType] = useState<FieldType | "ALL">("ALL");
  const [selectedFieldId, setSelectedFieldId] = useState<number | "ALL">("ALL");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: fields = [] } = useFields();

  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery<Review[]>({
    queryKey: ["user-reviews", selectedType, selectedFieldId],
    queryFn: async () => {
      const params: Record<string, unknown> = {};
      if (selectedType !== "ALL") params.fieldType = selectedType;
      if (selectedFieldId !== "ALL") params.fieldId = selectedFieldId;
      const res = await api.get("/reviews", { params });
      return res.data.reviews ?? [];
    },
    staleTime: 0,
    refetchInterval: 3000,
  });

  const { data: myBookings = [] } = useMyBookings();
  const unreviewedBookings = myBookings.filter((b) => b.status === "CONFIRMED");

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "5.0";

  const handleOpenReview = () => {
    if (unreviewedBookings.length > 0) {
      setSelectedBooking(unreviewedBookings[0]);
    }
    setOpenReviewDialog(true);
  };

  const filteredFields =
    selectedType === "ALL"
      ? fields
      : fields.filter((f) => f.fieldType === selectedType);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Title Header */}
      <div className="rounded-xl border bg-surface p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <MessageSquare className="h-6 w-6 text-brand-primary" />
              Đánh giá chất lượng từng sân bóng
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Xem chi tiết đánh giá, điểm số sao và nhận xét thực tế theo từng
              sân bóng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-lg border bg-surface-hover/30 p-4">
              <div className="flex items-center gap-1.5 text-2xl font-bold text-rating-star">
                <Star className="h-6 w-6 fill-rating-star text-rating-star" />
                {avgRating}
              </div>
              <div className="border-r h-8" />
              <div>
                <p className="text-xs text-text-muted">
                  Tổng số đánh giá
                </p>
                <p className="text-sm font-semibold">{totalReviews} đánh giá</p>
              </div>
            </div>

            {unreviewedBookings.length > 0 && (
              <Button
                onClick={handleOpenReview}
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold shadow-sm"
              >
                <MessageSquarePlus className="mr-1.5 h-4 w-4" />
                Viết đánh giá ({unreviewedBookings.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Options: Court Type & Specific Pitch */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter Buttons */}
          <div className="flex gap-1.5 rounded-lg border bg-surface-hover/30 p-1">
            {(
              [
                { value: "ALL", label: "Tất cả" },
                { value: "FIVE", label: "Sân 5" },
                { value: "SEVEN", label: "Sân 7" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setSelectedType(tab.value);
                  setSelectedFieldId("ALL");
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedType === tab.value
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Specific Field Select */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <select
              value={selectedFieldId}
              onChange={(e) =>
                setSelectedFieldId(
                  e.target.value === "ALL" ? "ALL" : Number(e.target.value),
                )
              }
              className="rounded-lg border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary focus:outline-hidden focus:ring-1 focus:ring-brand-primary"
            >
              <option value="ALL">Tất cả sân cụ thể</option>
              {filteredFields.map((f) => (
                <option key={f.fieldId} value={f.fieldId}>
                  {f.name} ({f.fieldType === "FIVE" ? "Sân 5" : "Sân 7"})
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          Đang hiển thị{" "}
          <span className="font-semibold text-text-primary">
            {reviews.length}
          </span>{" "}
          đánh giá
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-text-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải danh sách
          đánh giá sân...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-status-danger/20 bg-status-danger-bg p-6 text-center text-sm text-status-danger">
          Không thể tải danh sách đánh giá. Vui lòng thử lại sau.
        </div>
      )}

      {/* Reviews Grid */}
      {!isLoading && !error && reviews.length === 0 ? (
        <Card className="py-12 text-center bg-surface">
          <CardContent className="text-text-muted">
            Chưa có đánh giá nào cho sân này.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => {
            const fieldType = review.field?.fieldType;
            const labelMap: Record<string, string> = {
              FIVE: "Sân 5",
              SEVEN: "Sân 7",
              ELEVEN: "Sân 11",
            };
            const fieldTypeLabel = fieldType
              ? labelMap[fieldType] || fieldType
              : null;

            return (
              <Card
                key={review.reviewId}
                className="flex flex-col justify-between border shadow-xs hover:border-brand-primary/30 transition-all bg-surface"
              >
                <CardHeader className="pb-3 border-b bg-surface-hover/10">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-brand-primary">
                        {review.field?.name || `Sân #${review.fieldId}`}
                      </CardTitle>
                      <p className="text-xs text-text-muted mt-0.5">
                        Người đánh giá:{" "}
                        <span className="font-semibold text-text-primary">
                          {review.user?.fullName || "Khách hàng"}
                        </span>
                      </p>
                    </div>

                    {fieldTypeLabel && (
                      <Badge
                        variant="outline"
                        className="border-brand-primary/40 text-brand-primary"
                      >
                        {fieldTypeLabel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3 flex-1">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-rating-star text-rating-star"
                              : "fill-text-muted text-text-muted/30"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold">
                        {review.rating}/5 sao
                      </span>
                    </div>

                    <span className="text-[11px] text-text-muted">
                      {review.createdAt
                        ? dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")
                        : ""}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-text-primary/90 italic">
                    "{review.comment || "Người dùng không để lại lời nhắn."}"
                  </p>

                  {/* Reply from Owner */}
                  {review.reply && (
                    <div className="mt-3 rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-3 text-xs">
                      <p className="flex items-center gap-1.5 font-bold text-brand-primary mb-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Phản hồi từ Quản
                        lý sân:
                      </p>
                      <p className="text-text-muted">{review.reply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
        <DialogContent className="sm:max-w-md border-border bg-elevated text-text-primary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Star className="h-5 w-5 text-rating-star fill-rating-star" />
              Viết đánh giá chất lượng sân
            </DialogTitle>
            <DialogDescription>
              Chọn trận đấu bạn đã hoàn thành để gửi đánh giá chất lượng cho ban
              quản lý.
            </DialogDescription>
          </DialogHeader>

          {unreviewedBookings.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">
              Bạn không có trận đấu nào chưa đánh giá.
            </p>
          ) : (
            <div className="space-y-4">
              {unreviewedBookings.length > 1 && (
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Chọn sân đấu
                  </label>
                  <select
                    className="w-full rounded-md border p-2 text-sm bg-surface"
                    value={selectedBooking?.bookingId}
                    onChange={(e) => {
                      const b = unreviewedBookings.find(
                        (item) => item.bookingId === Number(e.target.value),
                      );
                      if (b) setSelectedBooking(b);
                    }}
                  >
                    {unreviewedBookings
                      .filter(
                        (b, index, arr) =>
                          index ===
                          arr.findIndex(
                            (x) =>
                              x.bookingSlots[0]?.fieldSlot.field.name ===
                              b.bookingSlots[0]?.fieldSlot.field.name,
                          ),
                      )
                      .map((b) => (
                        <option key={b.bookingId} value={b.bookingId}>
                          {b.bookingSlots[0]?.fieldSlot.field.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedBooking && (
                <FeedbackForm
                  bookingId={selectedBooking.bookingId}
                  onSuccess={() => setOpenReviewDialog(false)}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
