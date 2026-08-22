// src/features/admin-review/ReviewDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Review } from "@/types/review";
import { formatDateTime } from "@/lib/utils";
import {
  Star,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  CornerDownRight,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
}

export function ReviewDetailDialog({ open, onOpenChange, review }: Props) {
  if (!review) return null;

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết đánh giá #{review.reviewId}
                  </DialogTitle>
                  <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Đơn đặt #{review.bookingId} • Tạo ngày {formatDateTime(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Rating Star Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold text-sm">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{review.rating}/5 sao</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Customer & Field Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="rounded-xl border border-border bg-elevated/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Khách hàng đánh giá
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-sm">
                    {getInitials(review.user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {review.user?.fullName || `Khách hàng #${review.userId}`}
                  </p>
                  {review.user?.email && (
                    <p className="text-xs text-text-muted flex items-center gap-1 truncate mt-0.5">
                      <Mail className="h-3 w-3" />
                      {review.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Field Box */}
            <div className="rounded-xl border border-border bg-elevated/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Sân bóng được đánh giá
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-text-primary">
                  {review.field?.name || `Sân bóng #${review.fieldId}`}
                </p>
                <p className="text-xs text-brand-primary">
                  {review.field?.fieldType
                    ? `Sân ${review.field.fieldType === "FIVE" ? "5" : review.field.fieldType === "SEVEN" ? "7" : "11"} người`
                    : "Quy chuẩn sân tiêu chuẩn"}
                </p>
              </div>
            </div>
          </div>

          {/* Rating visual score */}
          <div className="rounded-xl border border-border bg-elevated/30 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Mức độ hài lòng
              </p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">
                {review.rating >= 4
                  ? "Rất hài lòng / Tốt"
                  : review.rating === 3
                  ? "Bình thường"
                  : "Chưa hài lòng"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-border fill-surface"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Customer Comment */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Nội dung nhận xét từ khách hàng
            </p>
            <div className="rounded-xl border border-border bg-elevated/40 p-4 text-sm leading-relaxed text-text-primary">
              {review.comment ? (
                <p className="italic">"{review.comment}"</p>
              ) : (
                <p className="italic text-text-muted text-xs">
                  Khách hàng không để lại nhận xét bằng lời.
                </p>
              )}
            </div>
          </div>

          {/* Admin Reply Box */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
              Phản hồi từ Ban quản trị
            </p>
            <div
              className={`rounded-xl border p-4 text-sm leading-relaxed ${
                review.reply
                  ? "border-brand-primary/30 bg-brand-primary/5 text-text-primary"
                  : "border-dashed border-border bg-elevated/20 text-text-muted"
              }`}
            >
              {review.reply ? (
                <div className="flex items-start gap-2.5">
                  <CornerDownRight className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <p>{review.reply}</p>
                </div>
              ) : (
                <p className="italic text-xs">
                  Chưa có phản hồi từ quản trị viên cho đánh giá này.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-between p-4 bg-elevated/40">
          <p className="text-xs text-text-muted">
            {review.updatedAt &&
              `Cập nhật: ${formatDateTime(review.updatedAt)}`}
          </p>
          <Button
            variant="outline"
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-6"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
