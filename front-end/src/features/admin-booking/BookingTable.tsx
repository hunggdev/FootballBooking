// src/features/admin-booking/BookingTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  Trash2,
  CalendarCheck,
  Clock,
  Layers,
} from "lucide-react";
import type { Booking } from "@/types/booking";
import { formatDate, formatDateTime, formatTimeRange } from "@/lib/utils";

interface Props {
  bookings: Booking[];
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
}

const statusBadge: Record<string, string> = {
  CONFIRMED:
    "border-status-success/20 bg-status-success-bg text-status-success",
  COMPLETED: "border-status-info/20 bg-status-info-bg text-status-info",
  HOLD: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn thành",
  HOLD: "Đang giữ chỗ",
  PENDING: "Chờ xử lý",
  CANCELLED: "Đã hủy",
};

const fieldTypeBadge: Record<string, string> = {
  FIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  SEVEN: "border-status-info/20 bg-status-info-bg text-status-info",
  ELEVEN: "border-status-indigo/20 bg-status-indigo/15 text-status-indigo",
};

const fieldTypeLabel: Record<string, string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
  ELEVEN: "Sân 11",
};

export function BookingTable({ bookings, onView, onEdit, onDelete }: Props) {
  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="mt-5 rounded-xl bg-[#2d3a4f] p-px transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
      <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <Table>
            {/* ================= HEADER ================= */}
            <TableHeader>
              <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                <TableHead className="w-[6%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Mã đơn
                </TableHead>

                <TableHead className="w-[18%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Khách hàng
                </TableHead>

                <TableHead className="w-[16%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Sân bóng
                </TableHead>

                <TableHead className="w-[15%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Thời gian tạo
                </TableHead>

                <TableHead className="w-[12%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Tổng tiền
                </TableHead>

                <TableHead className="w-[11%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Đã cọc
                </TableHead>

                <TableHead className="w-[10%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Trạng thái
                </TableHead>

                <TableHead className="w-[12%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="py-14 text-center text-sm text-text-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarCheck className="h-8 w-8 text-text-muted/40" />
                      <span>Không có đơn đặt sân nào.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const upperStatus = (booking.status || "").toUpperCase();
                  const firstSlot = booking.bookingSlots?.[0];
                  const fieldName =
                    firstSlot?.fieldSlot?.field?.name ||
                    booking.field?.name ||
                    "Chưa xác định";
                  const fieldType = (
                    firstSlot?.fieldSlot?.field?.fieldType ||
                    booking.field?.fieldType ||
                    ""
                  ).toUpperCase();

                  return (
                    <TableRow
                      key={booking.bookingId}
                      className="group border-border/50 transition-colors duration-200 hover:bg-surface-hover/60"
                    >
                      {/* Mã đơn */}
                      <TableCell className="text-center">
                        <span className="font-mono text-xs font-semibold text-text-primary">
                          #{booking.bookingId}
                        </span>
                      </TableCell>

                      {/* Khách hàng */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
                              {getInitials(booking.user?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex flex-col">
                            <span className="truncate text-xs font-semibold text-text-primary transition-colors duration-200 group-hover:text-white">
                              {booking.user?.fullName || "Khách vãng lai"}
                            </span>
                            <span className="truncate text-[11px] text-text-muted">
                              {booking.user?.phone ||
                                booking.user?.email ||
                                "Chưa có liên hệ"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Sân bóng */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="truncate text-xs font-semibold text-text-primary">
                            {fieldName}
                          </span>
                          {fieldType && (
                            <span
                              className={`inline-flex w-fit items-center rounded-md border px-2 py-0.2 text-[10px] font-medium ${
                                fieldTypeBadge[fieldType] ||
                                "border-border bg-elevated text-text-secondary"
                              }`}
                            >
                              {fieldTypeLabel[fieldType] || fieldType}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Khung giờ đặt */}
                      <TableCell>
                        {firstSlot ? (
                          <div className="flex flex-col gap-0.5 text-xs text-text-secondary">
                            <div className="flex items-center gap-1 font-medium text-text-primary">
                              <Clock className="h-3 w-3 text-brand-primary" />
                              <span className="text-[11px] text-text-muted">
                                {formatDateTime(booking.createdAt)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted">
                            {formatDateTime(booking.createdAt)}
                          </span>
                        )}
                      </TableCell>

                      {/* Tổng tiền */}
                      <TableCell className="text-right">
                        <span className="font-semibold text-xs text-brand-accent">
                          {Number(booking.totalPrice || 0).toLocaleString(
                            "vi-VN",
                          )}
                          &nbsp;đ
                        </span>
                      </TableCell>

                      {/* Đã cọc */}
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-text-secondary">
                          {Number(booking.depositAmount || 0).toLocaleString(
                            "vi-VN",
                          )}
                          &nbsp;đ
                        </span>
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${
                            statusBadge[upperStatus] ||
                            "border-border bg-elevated text-text-secondary"
                          }`}
                        >
                          {statusLabel[upperStatus] || booking.status}
                        </span>
                      </TableCell>

                      {/* Hành động */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* XEM */}
                          {onView && (
                            <Button
                              size="sm"
                              onClick={() => onView(booking)}
                              className="h-8 border border-status-info/20 bg-status-info-bg px-2.5 text-xs font-medium text-status-info shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-info/30 hover:bg-status-info/20 cursor-pointer"
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              Xem
                            </Button>
                          )}

                          {/* SỬA */}
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(booking)}
                              disabled={
                                upperStatus === "COMPLETED" ||
                                upperStatus === "CANCELLED"
                              }
                              className="h-8 border-border bg-transparent px-2.5 text-xs font-medium text-text-secondary shadow-none transition-all duration-200 hover:-translate-y-px hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent cursor-pointer disabled:opacity-40 disabled:hover:translate-y-0"
                            >
                              <Pencil className="mr-1 h-3.5 w-3.5" />
                              Sửa
                            </Button>
                          )}

                          {/* HỦY */}
                          {onDelete && (
                            <Button
                              size="sm"
                              onClick={() => onDelete(booking)}
                              disabled={
                                upperStatus === "COMPLETED" ||
                                upperStatus === "CANCELLED"
                              }
                              className="h-8 border border-status-danger/20 bg-status-danger-bg px-2.5 text-xs font-medium text-status-danger shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-danger/30 hover:bg-status-danger/20 cursor-pointer disabled:opacity-40 disabled:hover:translate-y-0"
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Hủy
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
