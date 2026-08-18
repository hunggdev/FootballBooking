import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";

import type { Review } from "@/types/review";
import { formatDateTime } from "@/lib/utils";

interface Props {
  reviews: Review[];
  onReply: (review: Review) => void;
  onView: (review: Review) => void;
}

export function ReviewTable({
  reviews,
  onReply,
  onView,
}: Props) {
  return (
    <div
      className="
        mt-5
        rounded-xl
        bg-[#2d3a4f]
        p-px
        transition-all
        duration-300
        hover:bg-[image:var(--token-gradient-brand)]
      "
    >
      <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              {/* ================= HEADER ================= */}
              <TableHeader>
                <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                  <TableHead className="w-[7%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    ID
                  </TableHead>

                  <TableHead className="w-[15%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Khách hàng
                  </TableHead>

                  <TableHead className="w-[15%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Sân
                  </TableHead>

                  <TableHead className="w-[20%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Nội dung
                  </TableHead>

                  <TableHead className="w-[10%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Đánh giá
                  </TableHead>

                  <TableHead className="w-[12%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Phản hồi
                  </TableHead>

                  <TableHead className="w-[13%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Ngày tạo
                  </TableHead>

                  <TableHead className="w-[18%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ================= BODY ================= */}
              <TableBody>
                {reviews.map((review) => (
                  <TableRow
                    key={review.reviewId}
                    className="
                      group
                      border-border/50
                      transition-colors
                      duration-200
                      hover:bg-surface-hover/60
                    "
                  >
                    {/* ID */}
                    <TableCell className="text-center">
                      <span className="text-xs font-semibold text-text-muted">
                        #{review.reviewId}
                      </span>
                    </TableCell>

                    {/* KHÁCH HÀNG */}
                    <TableCell>
                      <span
                        className="
                          font-semibold
                          text-text-primary
                          transition-colors
                          duration-200
                          group-hover:text-white
                        "
                      >
                        {review.user?.fullName ?? review.userId}
                      </span>
                    </TableCell>

                    {/* SÂN */}
                    <TableCell>
                      <span className="text-sm text-text-secondary">
                        {review.field?.name ?? review.fieldId}
                      </span>
                    </TableCell>

                    {/* NỘI DUNG */}
                    <TableCell>
                      <div className="max-w-[260px] truncate text-sm text-text-secondary">
                        {review.comment || (
                          <span className="italic text-text-muted">
                            Không có nội dung
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* ĐÁNH GIÁ */}
                    <TableCell className="text-center">
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-brand-accent/20
                          bg-brand-accent/10
                          px-2.5
                          py-1
                          text-[11px]
                          font-bold
                          text-brand-accent
                        "
                      >
                        {review.rating}
                        <span>⭐</span>
                      </span>
                    </TableCell>

                    {/* PHẢN HỒI */}
                    <TableCell className="text-center">
                      {review.reply ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-md
                            border
                            border-status-success/20
                            bg-status-success-bg
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-status-success
                          "
                        >
                          Đã phản hồi
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-md
                            border
                            border-brand-accent/20
                            bg-brand-accent/10
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-brand-accent
                          "
                        >
                          Chưa phản hồi
                        </span>
                      )}
                    </TableCell>

                    {/* NGÀY TẠO */}
                    <TableCell className="text-center">
                      <span className="text-xs text-text-muted">
                        {formatDateTime(review.createdAt)}
                      </span>
                    </TableCell>

                    {/* THAO TÁC */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {/* XEM */}
                        <Button
                          size="sm"
                          onClick={() => onView(review)}
                          className="
                            h-8
                            border
                            border-status-info/20
                            bg-status-info-bg
                            px-2.5
                            text-xs
                            font-medium
                            text-status-info
                            shadow-none
                            transition-all
                            duration-200
                            hover:-translate-y-px
                            hover:border-status-info/30
                            hover:bg-status-info/20
                          "
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Xem
                        </Button>

                        {/* PHẢN HỒI */}
                        <Button
                          size="sm"
                          onClick={() => onReply(review)}
                          className="
                            h-8
                            border
                            border-brand-accent/20
                            bg-brand-accent/10
                            px-2.5
                            text-xs
                            font-medium
                            text-brand-accent
                            shadow-none
                            transition-all
                            duration-200
                            hover:-translate-y-px
                            hover:border-brand-accent/40
                            hover:bg-brand-accent/20
                          "
                        >
                          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                          {review.reply ? "Sửa phản hồi" : "Phản hồi"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* EMPTY */}
                {reviews.length === 0 && (
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-sm text-text-muted"
                    >
                      Không có đánh giá nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}