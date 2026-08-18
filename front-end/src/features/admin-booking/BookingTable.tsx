import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

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

import type { Booking } from "@/types/booking";

interface Props {
  bookings: Booking[];
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
}

const bookingStatusBadge: Record<string, string> = {
  PENDING:
    "border-status-warning/30 bg-status-warning-bg text-status-warning",

  CONFIRMED:
    "border-status-success/30 bg-status-success-bg text-status-success",

  CANCELLED:
    "border-status-danger/30 bg-status-danger-bg text-status-danger",

  COMPLETED:
    "border-status-info/30 bg-status-info-bg text-status-info",
};

const bookingStatusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã hoàn thành",
};

export function BookingTable({
  bookings,
  onView,
  onEdit,
  onDelete,
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
      <Card className="overflow-hidden border-border bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              {/* ================= HEADER ================= */}
              <TableHeader>
                <TableRow className="border-border bg-elevated hover:bg-elevated">
                  <TableHead className="h-11 px-4 text-center text-xs font-semibold text-text-secondary">
                    ID
                  </TableHead>

                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    Khách hàng
                  </TableHead>

                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    Sân
                  </TableHead>

                  <TableHead className="h-11 px-4 text-right text-xs font-semibold text-text-secondary">
                    Tổng tiền
                  </TableHead>

                  <TableHead className="h-11 px-4 text-right text-xs font-semibold text-text-secondary">
                    Đã cọc
                  </TableHead>

                  <TableHead className="h-11 px-4 text-center text-xs font-semibold text-text-secondary">
                    Trạng thái
                  </TableHead>

                  <TableHead className="h-11 px-4 text-right text-xs font-semibold text-text-secondary">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ================= BODY ================= */}
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow
                      key={booking.bookingId}
                      className="
                        border-border
                        transition-colors
                        duration-150
                        hover:bg-surface-hover
                      "
                    >
                      {/* ID */}
                      <TableCell className="px-4 py-3 text-center">
                        <span className="font-semibold text-text-primary">
                          #{booking.bookingId}
                        </span>
                      </TableCell>

                      {/* KHÁCH HÀNG */}
                      <TableCell className="px-4 py-3">
                        <span className="font-medium text-text-primary">
                          {booking.user?.fullName ?? "-"}
                        </span>
                      </TableCell>

                      {/* SÂN */}
                      <TableCell className="px-4 py-3">
                        <span className="text-sm text-text-secondary">
                          {booking.bookingSlots?.[0]?.fieldSlot?.field?.name ??
                            "-"}
                        </span>
                      </TableCell>

                      {/* TỔNG TIỀN */}
                      <TableCell className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-brand-primary">
                          {Number(
                            booking.totalPrice
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </span>
                      </TableCell>

                      {/* ĐÃ CỌC */}
                      <TableCell className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-brand-accent">
                          {Number(
                            booking.depositAmount
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </span>
                      </TableCell>

                      {/* TRẠNG THÁI */}
                      <TableCell className="px-4 py-3 text-center">
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-md
                            border
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            ${bookingStatusBadge[booking.status] ??
                            "border-border bg-elevated text-text-muted"
                            }
                          `}
                        >
                          {bookingStatusLabel[booking.status] ??
                            booking.status}
                        </span>
                      </TableCell>

                      {/* THAO TÁC */}
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* XEM */}
                          {onView && (
                            <Button
                              size="sm"
                              onClick={() => onView(booking)}
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
                          )}

                          {/* SỬA */}
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(booking)}
                              className="
                                h-8
                                border-border
                                bg-elevated
                                px-2.5
                                text-xs
                                font-medium
                                text-text-secondary
                                shadow-none
                                transition-all
                                duration-200
                                hover:-translate-y-px
                                hover:border-brand-accent/40
                                hover:bg-brand-accent/10
                                hover:text-brand-accent
                              "
                            >
                              <Pencil className="mr-1.5 h-3.5 w-3.5" />
                              Sửa
                            </Button>
                          )}

                          {/* XÓA */}
                          {onDelete && (
                            <Button
                              size="sm"
                              onClick={() => onDelete(booking)}
                              className="
                                h-8
                                border
                                border-status-danger/30
                                bg-status-danger-bg
                                px-2.5
                                text-xs
                                font-medium
                                text-status-danger
                                shadow-none
                                transition-all
                                duration-200
                                hover:-translate-y-px
                                hover:border-status-danger/40
                                hover:bg-status-danger/20
                              "
                            >
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                              Xóa
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-sm text-text-muted"
                    >
                      Không có booking nào.
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