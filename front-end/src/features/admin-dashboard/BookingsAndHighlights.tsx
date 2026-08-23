// src/features/admin-dashboard/BookingsAndHighlights.tsx
import { Swords, CalendarCheck, Star, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Booking } from "@/types/booking";
import type { Match } from "@/types/match";
import type { Review } from "@/types/review";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/lib/utils";

interface BookingsAndHighlightsProps {
  bookings: Booking[];
  matchs: Match[];
  reviews: Review[];
}

const statusBadge: Record<string, string> = {
  CONFIRMED:
    "border-status-success/20 bg-status-success-bg text-status-success",
  COMPLETED: "border-status-info/20 bg-status-info-bg text-status-info",
  DEPOSITED:
    "border-status-warning/20 bg-status-warning-bg text-status-warning",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
  OPEN: "border-status-success/20 bg-status-success-bg text-status-success",
  MATCHED: "border-status-warning/20 bg-status-warning-bg text-status-warning",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn tất",
  DEPOSITED: "Đã đặt cọc",
  PENDING: "Chờ xử lý",
  CANCELLED: "Đã hủy",
  OPEN: "Đang mở",
  MATCHED: "Đã ghép",
};

export function BookingsAndHighlights({
  bookings,
  matchs,
  reviews,
}: BookingsAndHighlightsProps) {
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ================= CỘT TRÁI: ĐẶT SÂN MỚI NHẤT (7 COLS) ================= */}
      <div className="lg:col-span-7">
        <div className="rounded-xl bg-[#2d3a4f] p-px transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)] h-full">
          <Card className="h-full overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10 flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                    <CalendarCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-text-primary">
                      Đơn đặt sân mới nhất
                    </CardTitle>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {bookings.length} đơn đặt gần đây nhất
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold text-text-secondary hover:text-brand-accent hover:bg-transparent cursor-pointer p-0"
                  onClick={() => navigate("/admin/bookings")}
                >
                  Xem tất cả <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                      <TableHead className="text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Mã đơn
                      </TableHead>
                      <TableHead className="text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Khách hàng
                      </TableHead>
                      <TableHead className="text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Sân bóng
                      </TableHead>
                      <TableHead className="text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Thời gian
                      </TableHead>
                      <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Tiền cọc
                      </TableHead>
                      <TableHead className="text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow className="border-border/60 hover:bg-transparent">
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-xs text-text-muted"
                        >
                          Chưa có đơn đặt sân nào gần đây.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.slice(0, 12).map((booking) => {
                        const upperStatus = (
                          booking.status || ""
                        ).toUpperCase();
                        const firstSlot = booking.bookingSlots?.[0];
                        const fieldName =
                          firstSlot?.fieldSlot?.field?.name ||
                          booking.field?.name ||
                          "Sân bóng";

                        return (
                          <TableRow
                            key={booking.bookingId}
                            className="group border-border/50 transition-colors duration-200 hover:bg-surface-hover/60"
                          >
                            <TableCell className="text-center font-mono text-xs font-semibold text-text-primary">
                              #{booking.bookingId}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7 border border-border/60">
                                  <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[10px] font-bold text-white">
                                    {getInitials(booking.user?.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-xs font-medium text-text-primary">
                                  {booking.user?.fullName || "Khách vãng lai"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span className="truncate text-xs text-text-secondary">
                                {fieldName}
                              </span>
                            </TableCell>

                            <TableCell>
                              <span className="truncate text-xs text-text-secondary">
                                {formatDateTime(booking.createdAt)}
                              </span>
                            </TableCell>

                            <TableCell className="text-right">
                              <span className="text-xs font-semibold text-brand-accent">
                                {Number(
                                  booking.depositAmount || 0,
                                ).toLocaleString("vi-VN")}
                                &nbsp;đ
                              </span>
                            </TableCell>

                            <TableCell className="text-center">
                              <span
                                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                                  statusBadge[upperStatus] ||
                                  "border-border bg-elevated text-text-secondary"
                                }`}
                              >
                                {statusLabel[upperStatus] || booking.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= CỘT PHẢI: KÈO ĐẤU & ĐÁNH GIÁ (5 COLS) ================= */}
      <div className="space-y-6 lg:col-span-5">
        {/* KÈO ĐẤU NỔI BẬT */}
        <Card className="rounded-xl border border-border bg-surface shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-warning-bg text-status-warning border border-status-warning/20">
                <Swords className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Kèo đấu nổi bật
              </CardTitle>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-semibold text-text-secondary hover:text-brand-accent hover:bg-transparent cursor-pointer p-0"
              onClick={() => navigate("/admin/matches")}
            >
              Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-2.5 pt-3">
            {matchs.length === 0 ? (
              <p className="py-6 text-center text-xs text-text-muted">
                Không có kèo đấu nào đang mở.
              </p>
            ) : (
              matchs.slice(0, 3).map((match) => {
                const upperStatus = (match.status || "").toUpperCase();
                return (
                  <div
                    key={match.matchId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-elevated/40 p-3 transition-colors hover:border-border"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                        <Swords className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-text-primary">
                          Kèo sân{" "}
                          {match.fieldType === "FIVE"
                            ? "5 người"
                            : match.fieldType === "SEVEN"
                              ? "7 người"
                              : "11 người"}
                        </p>
                        <p className="truncate text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {match.timeNote || "Chưa có thời gian"}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 ${
                        statusBadge[upperStatus] ||
                        "border-border bg-elevated text-text-secondary"
                      }`}
                    >
                      {statusLabel[upperStatus] || match.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* ĐÁNH GIÁ GẦN ĐÂY */}
        <Card className="rounded-xl border border-border bg-surface shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Đánh giá gần đây
              </CardTitle>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-semibold text-text-secondary hover:text-brand-accent hover:bg-transparent cursor-pointer p-0"
              onClick={() => navigate("/admin/feedback")}
            >
              Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-2.5 pt-3">
            {reviews.length === 0 ? (
              <p className="py-6 text-center text-xs text-text-muted">
                Chưa có đánh giá nào từ khách hàng.
              </p>
            ) : (
              reviews.slice(0, 3).map((review) => (
                <div
                  key={review.reviewId}
                  className="rounded-lg border border-border/60 bg-elevated/40 p-3 transition-colors hover:border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[9px] font-bold text-white">
                          {getInitials(review.user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-xs font-semibold text-text-primary">
                        {review.user?.fullName || "Khách hàng"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-secondary line-clamp-2 italic">
                    "{review.comment || "Không có lời nhận xét"}"
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
