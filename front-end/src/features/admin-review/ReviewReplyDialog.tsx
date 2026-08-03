import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
  const [prevReview, setPrevReview] = useState(review);

  // ✅ Thay thế useEffect: Cập nhật state trực tiếp khi prop `review` hoặc `open` thay đổi
  if (review !== prevReview) {
    setPrevReview(review);
    setReply(review?.reply ?? "");
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reply.trim() || isSubmitting) return;
    onSubmit(reply.trim());
  };

  return (
    <Dialog open={open && Boolean(review)} onOpenChange={onOpenChange}>
      <DialogContent>
        {review && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                Phản hồi đánh giá #{review.reviewId}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {review.user?.fullName && (
                <div>
                  <Label className="text-xs text-muted-foreground">Khách hàng</Label>
                  <p className="text-sm font-medium">{review.user.fullName}</p>
                </div>
              )}

              <div>
                <Label>
                  Đánh giá của khách hàng ({review.rating} ⭐)
                </Label>

                <p className="text-sm text-muted-foreground bg-muted/50 p-2.5 rounded-md mt-1">
                  {review.comment || "Không có nội dung"}
                </p>
              </div>

              <div>
                <Label htmlFor="reply">
                  Nội dung phản hồi
                </Label>

                <Textarea
                  id="reply"
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>

              {serverError && (
                <p className="text-sm text-red-500 font-medium">
                  {serverError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || !reply.trim()}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}