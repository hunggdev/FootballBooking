import { useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  MessageSquarePlus,
  History,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Receipt,
  DollarSign,
} from "lucide-react";
import dayjs from "dayjs";

import { useMyBookings } from "@/stores/useBookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FeedbackForm from "@/features/user-review/FeedbackForm";
import type { Booking } from "@/types/booking";
import { formatTimeRange } from "@/lib/utils";

function formatCurrency(value: number | string) {
  return `${Math.round(Number(value)).toLocaleString("vi-VN")}đ`;
}

const statusBadge: Record<
  Booking["status"],
  { label: string; className: string; icon: React.ElementType }
> = {
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    icon: CheckCircle2,
  },
  HOLD: {
    label: "Đang tạm giữ",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    icon: Clock,
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-red-500/30 bg-red-500/10 text-red-500",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    className: "border-green-500/30 bg-green-500/10 text-green-500",
    icon: CheckCircle2,
  },
};

export default function UserHistoryPage() {
  const { data: bookings = [], isLoading, error } = useMyBookings();
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<Booking | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] =
    useState<Booking | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Lịch sử đặt sân của bạn
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi danh sách sân đã đặt, xem hóa đơn tự động và gửi đánh giá
              chất lượng sân.
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải lịch sử đặt
          sân...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-500">
          Không thể tải lịch sử đặt sân. Vui lòng thử lại sau.
        </div>
      )}

      {/* List */}
      {!isLoading && !error && bookings.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent className="text-muted-foreground">
            Bạn chưa có đơn đặt sân nào. Hãy đặt sân ngay để bắt đầu trận đấu!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const fieldName =
              booking.bookingSlots[0].fieldSlot.field.name ||
              `Sân #${booking.bookingId}`;
            const statusInfo =
              statusBadge[booking.status] || statusBadge.CONFIRMED;
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={booking.bookingId}
                className="border shadow-sm transition-all hover:border-border/80"
              >
                <CardHeader className="pb-3 border-b bg-muted/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold">
                        {fieldName}
                      </CardTitle>
                      <Badge variant="outline" className={statusInfo.className}>
                        <StatusIcon className="mr-1 h-3.5 w-3.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Mã đơn:{" "}
                        <span className="font-mono font-semibold text-foreground">
                          #{booking.bookingId}
                        </span>
                      </span>

                      {booking.invoice && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-7 gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => setSelectedBookingForInvoice(booking)}
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          Hóa đơn #{booking.invoice.invoiceId}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <div className="overflow-y-auto max-h-[100px] custom-scrollbar">
                    {booking.bookingSlots.map((slot) => (
                      <div
                        key={slot.bookingSlotId}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm  "
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          <span>Ngày đá:</span>
                          <span className="font-semibold text-foreground">
                            {dayjs(slot.bookingDate).format("DD/MM/YYYY")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <span>Khung giờ:</span>
                          <span className="font-semibold text-foreground">
                            {formatTimeRange(
                              slot.fieldSlot?.starttime,
                              slot.fieldSlot?.endtime,
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span>Số tiền:</span>
                          <span className="font-semibold text-foreground">
                            {slot.price}VNĐ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Review Section */}
                  {booking.status === "CONFIRMED" && (
                    <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Đánh giá chất lượng sân bóng
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Chia sẻ trải nghiệm mặt sân, hệ thống chiếu sáng &
                            phục vụ để hỗ trợ quản lý sân.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm shrink-0"
                          onClick={() => setSelectedBookingForReview(booking)}
                        >
                          <MessageSquarePlus className="mr-1.5 h-4 w-4" />
                          Đánh giá chất lượng sân
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog
        open={!!selectedBookingForReview}
        onOpenChange={(open) => {
          if (!open) setSelectedBookingForReview(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              Đánh giá chất lượng sân
            </DialogTitle>
            <DialogDescription>
              {selectedBookingForReview?.bookingSlots[0].fieldSlot.field.name}
            </DialogDescription>
          </DialogHeader>

          {selectedBookingForReview && (
            <FeedbackForm
              bookingId={selectedBookingForReview.bookingId}
              onSuccess={() => setSelectedBookingForReview(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog
        open={!!selectedBookingForInvoice}
        onOpenChange={(open) => {
          if (!open) setSelectedBookingForInvoice(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-emerald-500" />
              Hóa đơn thanh toán #
              {selectedBookingForInvoice?.invoice?.invoiceId}
            </DialogTitle>
            <DialogDescription>
              Hóa đơn tự động được tạo cho đơn đặt{" "}
              {
                selectedBookingForInvoice?.bookingSlots[0].fieldSlot?.field
                  ?.name
              }
            </DialogDescription>
          </DialogHeader>

          {selectedBookingForInvoice?.invoice && (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                {selectedBookingForInvoice.bookingSlots.length > 0 && (
                  <div className="overflow-y-auto max-h-[100px] text-[10px] custom-scrollbar">
                    {selectedBookingForInvoice.bookingSlots.map((slot) => (
                      <div
                        key={slot.bookingSlotId}
                        className="flex flex-row justify-between items-center gap-2 text-muted-foreground"
                      >
                        <span className="text-foreground">
                          {dayjs(slot.bookingDate).format("DD/MM/YYYY")}
                        </span>
                        <span className="text-foreground">
                          {formatTimeRange(
                            slot.fieldSlot?.starttime,
                            slot.fieldSlot?.endtime,
                          )}
                        </span>
                        <span className="text-foreground">{slot.price}đ</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiền thuê sân:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      selectedBookingForInvoice.invoice.fieldAmount ||
                        selectedBookingForInvoice.totalPrice,
                    )}
                  </span>
                </div>
                {selectedBookingForInvoice.bookingServices.length > 0 && (
                  <div className="overflow-y-auto max-h-[100px] text-[10px] custom-scrollbar">
                    {selectedBookingForInvoice.bookingServices.map(
                      (service) => (
                        <div
                          key={service.bookingServiceId}
                          className="flex flex-row justify-between items-center gap-2 text-muted-foreground"
                        >
                          <span className="text-foreground min-w-[100px]">
                            {service.service?.name}
                          </span>
                          <span className="text-foreground">
                            x{service.quantity}
                          </span>
                          <span className="text-foreground min-w-[100px] text-right">
                            {formatCurrency(service.price * service.quantity)}đ
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tiền dịch vụ thêm:
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(
                      selectedBookingForInvoice.invoice.serviceAmount || 0,
                    )}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-base text-emerald-500">
                    {formatCurrency(
                      selectedBookingForInvoice.invoice.totalAmount ||
                        selectedBookingForInvoice.totalPrice,
                    )}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-3 space-y-2 bg-emerald-500/5">
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Đã đặt cọc (30%):</span>
                  <span className="font-bold">
                    {formatCurrency(
                      selectedBookingForInvoice.invoice.deposit || 0,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-amber-500">
                  <span>Còn lại thanh toán tại sân:</span>
                  <span className="font-bold">
                    {formatCurrency(
                      selectedBookingForInvoice.invoice.remainAmount || 0,
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>
                  Trạng thái:{" "}
                  <Badge variant="outline" className="ml-1 uppercase">
                    {selectedBookingForInvoice.invoice.status}
                  </Badge>
                </span>
                <span>
                  Ngày tạo:{" "}
                  {dayjs(selectedBookingForInvoice.invoice.createdAt).format(
                    "DD/MM/YYYY HH:mm",
                  )}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
