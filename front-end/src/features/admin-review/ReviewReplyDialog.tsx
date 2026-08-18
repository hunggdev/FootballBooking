import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Review } from "@/types/review";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
  onSubmit: (reply: string) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

export function ReviewReplyDialog({
  open,
  onOpenChange,
  review,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [reply, setReply] = useState(review?.reply ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reply.trim() || isSubmitting) return;

    onSubmit(reply.trim());
  };

  return (
    <Dialog
      open={open && Boolean(review)}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl border-border bg-elevated text-text-primary ring-border">
        {review && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-brand-primary">
                Phản hồi đánh giá #{review.reviewId}
              </DialogTitle>
            </DialogHeader>

            {/* Khách hàng */}
            {review.user?.fullName && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Khách hàng
                </Label>

                <p className="text-sm font-medium text-text-primary">
                  {review.user.fullName}
                </p>
              </div>
            )}

            {/* Đánh giá */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Đánh giá ({review.rating} ⭐)
              </Label>

              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {review.comment || "Không có nội dung"}
                </p>
              </div>
            </div>

            {/* Nội dung phản hồi */}
            <div className="space-y-1">
              <Label
                htmlFor="reply"
                className="text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Nội dung phản hồi
              </Label>

              <Textarea
                id="reply"
                rows={5}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Nhập phản hồi cho khách hàng..."
                disabled={isSubmitting}
                className="
                  border-border
                  bg-surface
                  text-text-primary
                  placeholder:text-text-muted
                  focus-visible:border-brand-accent
                  focus-visible:ring-brand-accent/30
                "
              />
            </div>

            {/* Error */}
            {serverError && (
              <div className="rounded-md border border-status-danger/20 bg-status-danger-bg p-3">
                <p className="text-sm font-medium text-status-danger">
                  {serverError}
                </p>
              </div>
            )}

            <DialogFooter className="border-border bg-elevated">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="
                  border-border
                  bg-transparent
                  text-text-secondary
                  transition-all
                  duration-200
                  hover:border-brand-accent/40
                  hover:bg-brand-accent/10
                  hover:text-brand-accent
                "
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !reply.trim()}
                className="
                  border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover
                "
              >
                {isSubmitting
                  ? "Đang gửi..."
                  : review.reply
                    ? "Cập nhật phản hồi"
                    : "Gửi phản hồi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}