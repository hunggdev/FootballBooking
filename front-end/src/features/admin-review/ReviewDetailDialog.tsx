import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

import type { Review } from "@/types/review";
import { formatDateTime } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
}

export function ReviewDetailDialog({ open, onOpenChange, review }: Props) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            Chi tiết đánh giá #{review.reviewId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Khách hàng */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Khách hàng
            </Label>

            <p className="text-sm font-medium text-text-primary">
              {review.user?.fullName ?? review.userId}
            </p>
          </div>

          {/* Sân */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Sân
            </Label>

            <p className="text-sm font-medium text-text-primary">
              {review.field?.name ?? review.fieldId}
            </p>
          </div>

          {/* Điểm đánh giá */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Điểm đánh giá
            </Label>

            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-brand-accent text-brand-accent" />

              <span className="text-sm font-bold text-brand-accent">
                {review.rating}/5
              </span>
            </div>
          </div>

          {/* Nội dung */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Nội dung đánh giá
            </Label>

            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-sm leading-relaxed text-text-secondary">
                {review.comment || "Không có nội dung"}
              </p>
            </div>
          </div>

          {/* Phản hồi admin */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Phản hồi của quản trị viên
            </Label>

            <div className="rounded-lg border border-border bg-surface p-3">
              {review.reply ? (
                <p className="text-sm leading-relaxed text-text-secondary">
                  {review.reply}
                </p>
              ) : (
                <p className="text-sm italic text-text-muted">Chưa phản hồi</p>
              )}
            </div>
          </div>

          {/* Ngày tạo */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Ngày tạo
              </Label>

              <p className="text-sm text-text-secondary">
                {formatDateTime(review.createdAt)}
              </p>
            </div>

            {/* Cập nhật */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Cập nhật lần cuối
              </Label>

              <p className="text-sm text-text-secondary">
                {formatDateTime(review.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
