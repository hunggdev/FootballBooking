// src/features/admin-customer/CustomerDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";
import { useCustomer } from "@/stores/useCustomerStore";
import { formatDateTime } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Clock,
} from "lucide-react";

interface CustomerDetailDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bookingStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  COMPLETED: {
    label: "Đã hoàn thành",
    className: "border-status-info/20 bg-status-info-bg text-status-info",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-status-success/20 bg-status-success-bg text-status-success",
  },
  PENDING: {
    label: "Chờ xác nhận",
    className: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-status-danger/20 bg-status-danger-bg text-status-danger",
  },
};

const customerStatusBadge: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "border-status-success/30 bg-status-success-bg text-status-success",
  },
  INACTIVE: {
    label: "Ngưng hoạt động",
    className: "border-status-warning/30 bg-status-warning-bg text-status-warning",
  },
  BANNED: {
    label: "Đã khóa",
    className: "border-status-danger/30 bg-status-danger-bg text-status-danger",
  },
};

export function CustomerDetailDialog({
  customerId,
  open,
  onOpenChange,
}: CustomerDetailDialogProps) {
  const { data, isLoading, error } = useCustomer(customerId ?? 0);
  const customer: Customer | undefined = data?.customer;

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const totalSpent =
    customer?.bookings?.reduce(
      (acc, b) =>
        b.status === "COMPLETED" || b.status === "CONFIRMED"
          ? acc + (Number(b.totalPrice || 0))
          : acc,
      0
    ) || customer?.totalSpent || 0;

  const statusInfo = customer?.status
    ? customerStatusBadge[customer.status.toUpperCase()]
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết khách hàng #{customerId}
                  </DialogTitle>
                  {customer?.createdAt && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Thành viên từ: {formatDateTime(customer.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {customer?.isOnline !== undefined && (
                  <Badge
                    variant="outline"
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                      customer.isOnline
                        ? "border-status-success/30 bg-status-success-bg text-status-success"
                        : "border-text-muted/30 bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                        customer.isOnline
                          ? "bg-status-success"
                          : "bg-text-muted"
                      }`}
                    />
                    {customer.isOnline ? "Online" : "Offline"}
                  </Badge>
                )}

                {statusInfo && (
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              <p className="text-sm font-medium">Đang tải thông tin khách hàng...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger-bg p-4 text-status-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Không thể tải thông tin khách hàng. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {customer && (
            <div className="space-y-6">
              {/* Customer Profile Card */}
              <div className="rounded-xl border border-border bg-elevated/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Thông tin cá nhân
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-lg">
                      {getInitials(customer.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-text-primary">
                        {customer.fullName || "Chưa có tên"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1.5 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-text-muted" />
                        {customer.email || "Chưa cập nhật"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-text-muted" />
                        {customer.phone || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-center gap-3.5 rounded-xl border border-border bg-elevated/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium">Tổng số đơn đặt sân</p>
                    <p className="text-lg font-bold text-text-primary mt-0.5">
                      {customer.bookings?.length ?? customer.bookingCount ?? 0}&nbsp;đơn
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-border bg-elevated/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium">Tổng tiền đã đặt</p>
                    <p className="text-lg font-bold text-brand-accent mt-0.5">
                      {Number(totalSpent).toLocaleString("vi-VN")}&nbsp;đ
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking History Table */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Lịch sử đặt sân gần đây ({customer.bookings?.length || 0})
                </p>

                <div className="overflow-hidden rounded-xl border border-border bg-elevated/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-elevated/60 text-text-muted">
                        <th className="p-3 font-semibold">Mã đơn</th>
                        <th className="p-3 font-semibold">Ngày tạo</th>
                        <th className="p-3 font-semibold text-right">Tổng tiền</th>
                        <th className="p-3 font-semibold text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {!customer.bookings || customer.bookings.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-text-muted">
                            Khách hàng này chưa có đơn đặt sân nào.
                          </td>
                        </tr>
                      ) : (
                        customer.bookings.map((booking) => {
                          const upperSt = (booking.status || "").toUpperCase();
                          const stBadge =
                            bookingStatusConfig[upperSt] || {
                              label: booking.status,
                              className:
                                "border-border bg-elevated text-text-secondary",
                            };
                          return (
                            <tr
                              key={booking.bookingId}
                              className="hover:bg-surface-hover/40 transition-colors"
                            >
                              <td className="p-3 font-semibold text-text-primary">
                                #{booking.bookingId}
                              </td>
                              <td className="p-3 text-text-secondary">
                                {formatDateTime(booking.createdAt)}
                              </td>
                              <td className="p-3 text-right font-semibold text-text-primary">
                                {Number(booking.totalPrice || 0).toLocaleString(
                                  "vi-VN"
                                )}
                                &nbsp;đ
                              </td>
                              <td className="p-3 text-center">
                                <Badge
                                  variant="outline"
                                  className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${stBadge.className}`}
                                >
                                  {stBadge.label}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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
