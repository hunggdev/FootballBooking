// src/components/admin/feedback/FeedbackReplyDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Feedback } from "../types";

export function FeedbackReplyDialog({ feedback }: { feedback: Feedback }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border">
          {feedback.status === "replied" ? "Xem phản hồi" : "Trả lời"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg border">
        <DialogHeader>
          <DialogTitle>Trả lời đánh giá của {feedback.customerName}</DialogTitle>
        </DialogHeader>

        <div className="border p-3 text-sm">
          <p className="opacity-60">{feedback.fieldName}</p>
          <p className="mt-1">{feedback.comment}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Nội dung phản hồi</Label>
          <Textarea
            className="border"
            rows={4}
            defaultValue={feedback.adminReply ?? ""}
            placeholder="Nhập phản hồi tới khách hàng..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" className="border">
            Gửi phản hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
