// src/components/admin/feedback/FeedbackList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FeedbackReplyDialog } from "./FeedbackReplyDialog";
import type { Feedback } from "../types";

const statusLabel: Record<Feedback["status"], string> = {
  pending: "Chưa phản hồi",
  replied: "Đã phản hồi",
};

const feedbacks: Feedback[] = [
  {
    id: "1",
    customerName: "Trần Văn Bình",
    fieldName: "Sân S - 10/07/2026",
    rating: 4,
    comment: "Sân chất lượng tốt, cỏ mượt, có đèn chiếu sáng đầy đủ. Giá cả hợp lý. Sẽ quay lại!",
    createdAt: "2026-07-10T00:00:00.000Z",
    status: "replied",
    adminReply: "Cảm ơn anh Bình đã đánh giá, hẹn gặp lại lần sau!",
  },
  {
    id: "2",
    customerName: "Lê Thị Mai",
    fieldName: "Sân A Plus - 08/07/2026",
    rating: 5,
    comment: "Sân rộng, vệ sinh sạch sẽ. Nhân viên nhiệt tình hỗ trợ.",
    createdAt: "2026-07-08T00:00:00.000Z",
    status: "pending",
    adminReply: null,
  },
  {
    id: "3",
    customerName: "Nguyễn Hoàng Nam",
    fieldName: "Sân B Champions - 05/07/2026",
    rating: 3,
    comment: "Bãi gửi xe hơi chật, nên bố trí thêm chỗ để xe vào giờ cao điểm.",
    createdAt: "2026-07-05T00:00:00.000Z",
    status: "pending",
    adminReply: null,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function FeedbackList() {
  return (
    <div className="flex flex-col gap-3">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="border">
          <CardContent className="flex items-start gap-3 p-4">
            <Avatar className="h-8 w-8 shrink-0 border">
              <AvatarFallback>{feedback.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{feedback.customerName}</p>
                  <p className="text-xs opacity-60">
                    {feedback.fieldName} · {formatDate(feedback.createdAt)}
                  </p>
                </div>
                <span className="text-xs">{"★".repeat(feedback.rating)}</span>
              </div>
              <p className="mt-2 text-sm opacity-80">{feedback.comment}</p>
              {feedback.adminReply && (
                <div className="mt-2 border p-2 text-xs opacity-70">
                  Phản hồi của bạn: {feedback.adminReply}
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge variant="outline">{statusLabel[feedback.status]}</Badge>
              <FeedbackReplyDialog feedback={feedback} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
