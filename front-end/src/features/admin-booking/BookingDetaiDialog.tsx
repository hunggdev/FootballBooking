// src/features/admin-booking/BookingDetaiDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/types/booking";
import { formatTimeRange, formatDate, formatDateTime } from "@/lib/utils";
import {
  CalendarCheck,
  User,
  Clock,
  MapPin,
  Coffee,
  Receipt,
  Mail,
  Phone,
} from "lucide-react";

import { statusBadge, statusLabel } from "@/types/booking";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
}

export function BookingDetailDialog({ open, onOpenChange, booking }: Props) { 
  if (!booking) return null;

  const services = booking.bookingServices || [];
  const slots = booking.bookingSlots || [];
  const upperStatus = (booking.status || "").toUpperCase();

  const firstSlot = slots[0];
  const fieldName =
    firstSlot?.fieldSlot?.field?.name || booking.field?.name || "Chưa xác định";

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết đơn đặt sân #{booking.bookingId}
                  </DialogTitle>
                  <p className="text-xs text-text-muted mt-0.5">
                    Tạo lúc: {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  statusBadge[upperStatus] ||
                  "border-border bg-elevated text-text-secondary"
                }`}
              >
                {statusLabel[upperStatus] || booking.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Customer & Field Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="rounded-xl border border-border bg-elevated/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Khách hàng
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-sm">
                    {getInitials(booking.user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {booking.user?.fullName || "Khách vãng lai"}
                  </p>
                  <div className="flex flex-col gap-0.5 text-xs text-text-muted mt-0.5">
                    {booking.user?.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" />
                        {booking.user.email}
                      </span>
                    )}
                    {booking.user?.phone && (
                      <span className="flex items-center gap-1 truncate">
                        <Phone className="h-3 w-3" />
                        {booking.user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Field Overview Box */}
            <div className="rounded-xl border border-border bg-elevated/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Sân bóng đã chọn
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-text-primary">
                  {fieldName}
                </p>
                <p className="text-xs text-text-secondary">
                  {firstSlot?.fieldSlot?.field?.fieldType
                    ? `Loại sân: Sân ${firstSlot.fieldSlot.field.fieldType === "FIVE" ? "5" : firstSlot.fieldSlot.field.fieldType === "SEVEN" ? "7" : "11"} người`
                    : "Quy chuẩn sân tiêu chuẩn"}
                </p>
                {booking.note && (
                  <p className="text-xs text-text-muted mt-1 italic">
                    Ghi chú: "{booking.note}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booked Slots List */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Khung giờ đặt sân ({slots.length})
            </p>

            <div className="overflow-hidden rounded-xl border border-border bg-elevated/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-elevated/60 text-text-muted">
                    <th className="p-3 font-semibold">STT</th>
                    <th className="p-3 font-semibold">Ngày đá</th>
                    <th className="p-3 font-semibold">Khung giờ</th>
                    <th className="p-3 font-semibold text-right">Đơn giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {slots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-text-muted"
                      >
                        Chưa có khung giờ nào
                      </td>
                    </tr>
                  ) : (
                    slots.map((slot, idx) => (
                      <tr
                        key={slot.bookingSlotId || idx}
                        className="hover:bg-surface-hover/40"
                      >
                        <td className="p-3 font-mono text-text-muted">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-medium text-text-primary">
                          {formatDate(slot.bookingDate)}
                        </td>
                        <td className="p-3 text-text-secondary">
                          {formatTimeRange(
                            slot.fieldSlot.starttime,
                            slot.fieldSlot.endtime,
                          )}
                        </td>
                        <td className="p-3 text-right font-semibold text-text-primary">
                          {Number(slot.price || 0).toLocaleString("vi-VN")}
                          &nbsp;đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Services List */}
          {services.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5" />
                Dịch vụ đi kèm ({services.length})
              </p>

              <div className="overflow-hidden rounded-xl border border-border bg-elevated/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-elevated/60 text-text-muted">
                      <th className="p-3 font-semibold">Tên dịch vụ</th>
                      <th className="p-3 font-semibold text-center">
                        Số lượng
                      </th>
                      <th className="p-3 font-semibold text-right">Đơn giá</th>
                      <th className="p-3 font-semibold text-right">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {services.map((item, idx) => (
                      <tr
                        key={item.bookingServiceId || idx}
                        className="hover:bg-surface-hover/40"
                      >
                        <td className="p-3 font-medium text-text-primary">
                          {item.service?.name || "Dịch vụ"}
                        </td>
                        <td className="p-3 text-center text-text-secondary">
                          x{item.quantity}
                        </td>
                        <td className="p-3 text-right text-text-secondary">
                          {Number(item.price || 0).toLocaleString("vi-VN")}
                          &nbsp;đ
                        </td>
                        <td className="p-3 text-right font-semibold text-text-primary">
                          {(
                            Number(item.price || 0) * item.quantity
                          ).toLocaleString("vi-VN")}
                          &nbsp;đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Breakdown Card */}
          <div className="rounded-xl border border-border bg-elevated/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Tổng kết thanh toán
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Tổng tiền dịch vụ & tiền sân:</span>
                <span className="font-semibold text-text-primary">
                  {Number(booking.totalPrice || 0).toLocaleString("vi-VN")}
                  &nbsp;đ
                </span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Đã đặt cọc:</span>
                <span className="font-semibold text-status-success">
                  {Number(booking.depositAmount || 0).toLocaleString("vi-VN")}
                  &nbsp;đ
                </span>
              </div>

              {booking.paidAmount !== undefined && (
                <div className="flex justify-between text-text-secondary">
                  <span>Đã thanh toán:</span>
                  <span className="font-semibold text-status-info">
                    {Number(booking.paidAmount || 0).toLocaleString("vi-VN")}
                    &nbsp;đ
                  </span>
                </div>
              )}

              <Separator className="my-2 bg-border" />

              <div className="flex justify-between text-sm font-bold">
                <span className="text-text-primary">
                  Còn lại cần thanh toán:
                </span>
                <span className="text-brand-accent">
                  {Math.max(
                    0,
                    Number(booking.totalPrice || 0) -
                      Number(booking.depositAmount || 0) -
                      Number(booking.paidAmount || 0),
                  ).toLocaleString("vi-VN")}
                  &nbsp;đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end p-4 bg-elevated/40">
          <Button
            variant="outline"
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-6"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
