// src/features/admin-invoice/InvoiceDetailDialog.tsx
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
import type { Invoices } from "@/types/invoice";
import { formatDate, formatDateTime, formatTimeRange } from "@/lib/utils";
import {
  Receipt,
  User,
  Clock,
  MapPin,
  Coffee,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";

interface Props {
  invoice?: Invoices | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusBadge: Record<string, string> = {
  PAID: "border-status-success/20 bg-status-success-bg text-status-success",
  DEPOSITED: "border-status-info/20 bg-status-info-bg text-status-info",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const statusLabel: Record<string, string> = {
  PAID: "Đã thanh toán",
  DEPOSITED: "Đã đặt cọc",
  PENDING: "Chờ thanh toán",
  CANCELLED: "Đã hủy",
};

export function InvoiceDetailDialog({ invoice, open, onOpenChange }: Props) {
  if (!invoice) return null;

  const inv = invoice.invoice;
  const upperStatus = (inv.status || "").toUpperCase();
  const slots = invoice.bookingSlots || [];
  const services = invoice.bookingServices || [];

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
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Hóa đơn thanh toán #{inv.invoiceId}
                  </DialogTitle>
                  <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Đơn đặt #{invoice.bookingId} • Tạo ngày{" "}
                    {formatDateTime(inv.createdAt)}
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
                {statusLabel[upperStatus] || inv.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Customer Card */}
          <div className="rounded-xl border border-border bg-elevated/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Thông tin khách hàng
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-sm">
                  {getInitials(invoice.user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {invoice.user?.fullName || "Khách vãng lai"}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5 text-xs text-text-muted">
                  {invoice.user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {invoice.user.email}
                    </span>
                  )}
                  {invoice.user?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {invoice.user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booked Slots Breakdown */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Chi tiết tiền sân ({slots.length} khung giờ)
            </p>

            <div className="overflow-hidden rounded-xl border border-border bg-elevated/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-elevated/60 text-text-muted">
                    <th className="p-3 font-semibold">STT</th>
                    <th className="p-3 font-semibold">Sân bóng</th>
                    <th className="p-3 font-semibold">Ngày đá</th>
                    <th className="p-3 font-semibold">Khung giờ</th>
                    <th className="p-3 font-semibold text-right">Đơn giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {slots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-text-muted"
                      >
                        Chưa có thông tin khung giờ
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
                          {slot.fieldSlot?.field?.name || "Sân bóng"}
                        </td>
                        <td className="p-3 text-text-secondary">
                          {formatDate(slot.bookingDate)}
                        </td>
                        <td className="p-3 text-text-secondary">
                          {slot.fieldSlot
                            ? formatTimeRange(
                                slot.fieldSlot.starttime,
                                slot.fieldSlot.endtime,
                              )
                            : "--"}
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

          {/* Services Breakdown */}
          {services.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5" />
                Chi tiết dịch vụ phụ trợ ({services.length})
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
                    {services.map((item: any, idx: number) => {
                      const qty = item.quantity || 1;
                      const price = Number(item.price || 0);
                      return (
                        <tr
                          key={item.serviceId || idx}
                          className="hover:bg-surface-hover/40"
                        >
                          <td className="p-3 font-medium text-text-primary">
                            {item.name || item.service?.name || "Dịch vụ"}
                          </td>
                          <td className="p-3 text-center text-text-secondary">
                            x{qty}
                          </td>
                          <td className="p-3 text-right text-text-secondary">
                            {price.toLocaleString("vi-VN")}&nbsp;đ
                          </td>
                          <td className="p-3 text-right font-semibold text-text-primary">
                            {(price * qty).toLocaleString("vi-VN")}&nbsp;đ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Financial Summary Box */}
          <div className="rounded-xl border border-border bg-elevated/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Tổng kết thanh toán hóa đơn
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Tổng tiền sân:</span>
                <span className="font-medium text-text-primary">
                  {Number(inv.fieldAmount || 0).toLocaleString("vi-VN")}&nbsp;đ
                </span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Tổng tiền dịch vụ:</span>
                <span className="font-medium text-text-primary">
                  {Number(inv.serviceAmount || 0).toLocaleString("vi-VN")}
                  &nbsp;đ
                </span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Tiền đã đặt cọc:</span>
                <span className="font-medium text-status-info">
                  {Number(inv.deposit || 0).toLocaleString("vi-VN")}&nbsp;đ
                </span>
              </div>

              <Separator className="my-2 bg-border" />

              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-primary">Tổng cộng hóa đơn:</span>
                <span className="text-brand-accent">
                  {Number(inv.totalAmount || 0).toLocaleString("vi-VN")}&nbsp;đ
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold pt-1">
                <span className="text-text-primary">Còn lại cần thu:</span>
                <span
                  className={
                    Number(inv.remainAmount || 0) > 0
                      ? "text-status-warning"
                      : "text-status-success"
                  }
                >
                  {Number(inv.remainAmount || 0).toLocaleString("vi-VN")}&nbsp;đ
                </span>
              </div>

              {inv.paymentMethod && (
                <div className="pt-2 text-[11px] text-text-muted flex justify-between">
                  <span>Phương thức thanh toán:</span>
                  <span className="font-medium text-text-secondary">
                    {inv.paymentMethod}
                  </span>
                </div>
              )}

              {inv.paidAt && (
                <div className="text-[11px] text-text-muted flex justify-between">
                  <span>Thời gian hoàn tất:</span>
                  <span className="font-medium text-text-secondary">
                    {formatDateTime(inv.paidAt)}
                  </span>
                </div>
              )}
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
