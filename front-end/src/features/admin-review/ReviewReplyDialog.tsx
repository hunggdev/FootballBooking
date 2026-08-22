import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import type { Review } from "@/types/review";
import {
  MessageSquare,
  Star,
  User,
  CornerDownRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
    <Dialog open={open && Boolean(review)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {review && (
          <form onSubmit={handleSubmit}>
            {/* Header Section */}
            <div className="bg-elevated/80 p-6 border-b border-border">
              <DialogHeader className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                      <CornerDownRight className="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                        Phản hồi đánh giá #{review.reviewId}
                      </DialogTitle>
                      <p className="text-xs text-text-muted mt-0.5">
                        Gửi câu trả lời chính thức từ Ban quản trị đến khách hàng
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold text-xs px-2.5 py-1"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                    {review.rating}/5 sao
                  </Badge>
                </div>
              </DialogHeader>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {serverError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg p-3.5 text-xs font-medium text-status-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Customer and Review Quote */}
              <div className="rounded-xl border border-border bg-elevated/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <User className="h-3.5 w-3.5" />
                  <span>Khách hàng:</span>
                  <span className="font-semibold text-text-primary">
                    {review.user?.fullName || `Người dùng #${review.userId}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    Ý kiến khách hàng:
                  </p>
                  <p className="text-sm text-text-secondary italic leading-relaxed">
                    {review.comment ? `"${review.comment}"` : "Khách hàng không để lại nhận xét bằng lời."}
                  </p>
                </div>
              </div>

              {/* Reply text area */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reply"
                  className="text-xs font-semibold uppercase tracking-wider text-text-muted block"
                >
                  Nội dung phản hồi của bạn <span className="text-status-danger">*</span>
                </label>
                <Textarea
                  id="reply"
                  rows={5}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Cảm ơn quý khách đã sử dụng dịch vụ của sân..."
                  disabled={isSubmitting}
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 min-h-[110px]"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <Separator className="bg-border" />
            <div className="flex items-center justify-end gap-3 p-4 bg-elevated/40">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-5"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reply.trim()}
                className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang gửi...
                  </span>
                ) : review.reply ? (
                  "Cập nhật phản hồi"
                ) : (
                  "Gửi phản hồi"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}