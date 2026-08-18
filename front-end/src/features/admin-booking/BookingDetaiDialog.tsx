import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/types/booking";
import { formatTime, formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
}

export function BookingDetailDialog({
  open,
  onOpenChange,
  booking,
}: Props) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            Chi tiết Booking #{booking.bookingId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Customer & Field */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Khách hàng
              </Label>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {booking.user?.fullName ?? "-"}
              </p>

              {booking.user?.email && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {booking.user.email}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Sân
              </Label>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {booking.bookingSlots[0]?.fieldSlot?.field?.name ?? "-"}
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Booking Slots */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-text-primary">
              Danh sách khung giờ
            </h3>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-surface text-left">
                    <th className="border-b border-border p-3 font-semibold text-text-secondary">
                      ID
                    </th>
                    <th className="border-b border-border p-3 font-semibold text-text-secondary">
                      Ngày
                    </th>
                    <th className="border-b border-border p-3 font-semibold text-text-secondary">
                      Khung giờ
                    </th>
                    <th className="border-b border-border p-3 font-semibold text-text-secondary">
                      Giá
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {booking.bookingSlots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-text-muted"
                      >
                        Không có khung giờ nào.
                      </td>
                    </tr>
                  ) : (
                    booking.bookingSlots.map((slot) => (
                      <tr
                        key={slot.bookingSlotId}
                        className="transition-colors hover:bg-surface-hover"
                      >
                        <td className="border-b border-border p-3 text-text-primary">
                          {slot.bookingSlotId}
                        </td>

                        <td className="border-b border-border p-3 text-text-secondary">
                          {formatDate(slot.bookingDate)}
                        </td>

                        <td className="border-b border-border p-3 font-medium text-text-primary">
                          {formatTime(slot.fieldSlot.starttime)} -{" "}
                          {formatTime(slot.fieldSlot.endtime)}
                        </td>

                        <td className="border-b border-border p-3 font-semibold text-brand-primary">
                          {Number(slot.price).toLocaleString("vi-VN")} đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Trạng thái
              </Label>

              <p className="mt-1 text-sm font-bold text-brand-primary">
                {booking.status}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Loại booking
              </Label>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {booking.type}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold text-text-muted">
                Tổng tiền
              </Label>

              <p className="mt-1 text-sm font-bold text-brand-primary">
                {Number(booking.totalPrice).toLocaleString("vi-VN")} đ
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold text-text-muted">
                Đã cọc
              </Label>

              <p className="mt-1 text-sm font-bold text-brand-accent">
                {Number(booking.depositAmount).toLocaleString("vi-VN")} đ
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold text-text-muted">
                Đã thanh toán
              </Label>

              <p className="mt-1 text-sm font-bold text-text-primary">
                {Number(booking.paidAmount).toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>

          {/* Note */}
          {booking.note && (
            <div className="rounded-lg border border-border bg-surface p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Ghi chú
              </Label>

              <p className="mt-1 text-sm text-text-secondary">
                {booking.note}
              </p>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Dates */}
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div>
              <span className="text-text-muted">Tạo ngày: </span>
              <span className="font-medium text-text-secondary">
                {formatDate(booking.createdAt)}
              </span>
            </div>

            <div>
              <span className="text-text-muted">Cập nhật: </span>
              <span className="font-medium text-text-secondary">
                {booking.updatedAt
                  ? formatDate(booking.updatedAt)
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}