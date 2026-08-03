import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import type { Review } from "@/types/review";
import { formatDateTime } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
}

export function ReviewDetailDialog({
  open,
  onOpenChange,
  review,
}: Props) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Chi tiết đánh giá #{review.reviewId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Khách hàng</Label>
            <p>{review.user?.fullName ?? review.userId}</p>
          </div>

          <div>
            <Label>Sân</Label>
            <p>{review.field?.name ?? review.fieldId}</p>
          </div>

          <div>
            <Label>Nội dung đánh giá</Label>
            <p>{review.comment || "Không có nội dung"}</p>
          </div>

          <div>
            <Label>Điểm đánh giá</Label>
            <p>{review.rating} ⭐</p>
          </div>

          <div>
            <Label>Phản hồi của quản trị viên</Label>
            <p>
              {review.reply ?? (
                <span className="text-muted-foreground">
                  Chưa phản hồi
                </span>
              )}
            </p>
          </div>

          <div>
            <Label>Ngày tạo</Label>
            <p>{formatDateTime(review.createdAt)}</p>
          </div>

          <div>
            <Label>Cập nhật lần cuối</Label>
            <p>{formatDateTime(review.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}