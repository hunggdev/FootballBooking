// src/components/admin/feedback/FeedbackPage.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "../layout/PageHeader";
import { FeedbackStatsCards } from "./FeedbackStatsCards";
import { FeedbackList } from "./FeedbackList";

export function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Phản hồi & đánh giá"
        subtitle="Quản lý đánh giá của khách hàng về sân và dịch vụ"
      />
      <FeedbackStatsCards />
      <div className="flex items-center justify-between border p-4">
        <p className="text-sm opacity-60">Danh sách đánh giá gần đây</p>
        <Select>
          <SelectTrigger className="w-48 border">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chưa phản hồi</SelectItem>
            <SelectItem value="replied">Đã phản hồi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FeedbackList />
    </>
  );
}
