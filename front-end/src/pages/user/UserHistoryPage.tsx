import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  MessageSquarePlus,
  History,
  Loader2,
  CheckCircle2,
  XCircle,
  Receipt,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  Layers,
  Package,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";

import { useMyBookings, useCancelBooking } from "@/stores/useBookingStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackForm from "@/features/user-review/FeedbackForm";
import { CancelBookingDialog } from "@/features/user-booking/CancelBookingDialog";
import type { Booking, BookingSlot } from "@/types/booking";
import { Pagination } from "@/components/common/Pagination";

import { formatTimeRange } from "@/lib/utils";

const PAGE_SIZE = 10;

function formatCurrency(value: number | string) {
  return `${Math.round(Number(value)).toLocaleString("vi-VN")} đ`;
}

// ── Status config uses existing design tokens ──────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  CONFIRMED: {
    label: "Đã xác nhận",
    badgeClass:
      "border-status-success/25 bg-status-success-bg text-status-success",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    badgeClass: "border-status-info/25 bg-status-info-bg text-status-info",
    icon: CalendarCheck,
  },
  CANCELLED: {
    label: "Đã hủy",
    badgeClass:
      "border-status-danger/25 bg-status-danger-bg text-status-danger",
    icon: XCircle,
  },
};

// ── Single Booking Card ────────────────────────────────────────────────────
function BookingCard({
  booking,
  onReview,
  onViewInvoice,
  onCancel,
}: {
  booking: Booking;
  onReview: (b: Booking) => void;
  onViewInvoice: (b: Booking) => void;
  onCancel: (b: Booking) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const firstSlot = booking.bookingSlots[0];
  const fieldName =
    firstSlot?.fieldSlot?.field?.name ?? `Sân #${booking.bookingId}`;
  const fieldType = firstSlot?.fieldSlot?.field?.fieldType;
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.CONFIRMED;
  const StatusIcon = cfg.icon;
  const isCompleted = booking.status === "COMPLETED";
  const isCancellable = booking.status === "CONFIRMED";
  const hasReviewed = Boolean(booking.review);

  const fieldTypeLabel: Record<string, string> = {
    FIVE: "Sân 5",
    SEVEN: "Sân 7",
    ELEVEN: "Sân 11",
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-border hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {/* ── Card Header ── */}
      <div className="bg-elevated/60 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Field info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text-primary truncate">
                {fieldName}
              </p>
              {fieldType && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border border-brand-primary/20 bg-brand-primary/10 text-brand-primary shrink-0">
                  {fieldTypeLabel[fieldType] ?? fieldType}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Mã đặt sân:{" "}
              <span className="font-mono font-semibold text-text-secondary">
                #{booking.bookingId}
              </span>
              {" · "}
              <span>{dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}</span>
            </p>
          </div>
        </div>

        {/* Right: status badge + invoice button */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={`gap-1 px-2.5 py-1 text-xs font-semibold ${cfg.badgeClass}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {cfg.label}
          </Badge>

          <div className="flex items-center gap-2">
            {booking.invoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewInvoice(booking)}
                className="h-8 gap-1.5 border-border bg-elevated text-text-secondary text-xs hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
              >
                <Receipt className="h-3.5 w-3.5" />
                Hóa đơn
              </Button>
            )}

            {isCancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(booking)}
                className="h-8 gap-1.5 border-status-danger/25 bg-status-danger-bg text-status-danger text-xs hover:border-status-danger/40 hover:bg-status-danger/20 transition-all cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                Hủy đặt sân
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Slot summary strip ── */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border/50 bg-surface">
        {/* First slot quick info */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Calendar className="h-3.5 w-3.5 text-brand-primary shrink-0" />
          <span>{dayjs(firstSlot?.bookingDate).format("DD/MM/YYYY")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock className="h-3.5 w-3.5 text-brand-primary shrink-0" />
          <span>
            {formatTimeRange(
              firstSlot?.fieldSlot?.starttime,
              firstSlot?.fieldSlot?.endtime,
            )}
          </span>
        </div>
        {booking.bookingSlots.length > 1 && (
          <span className="text-xs text-text-muted">
            +{booking.bookingSlots.length - 1} khung giờ khác
          </span>
        )}

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <DollarSign className="h-3.5 w-3.5 text-brand-accent shrink-0" />
            <span className="text-text-muted">Tổng:</span>
            <span className="font-bold text-brand-accent">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Chi tiết
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Expanded detail section ── */}
      {expanded && (
        <div className="px-5 py-4 space-y-4 bg-base/30">
          {/* Booking Slots table */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Danh sách khung giờ đặt
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-elevated/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <span>Ngày đá</span>
                <span className="text-center">Khung giờ</span>
                <span className="text-right">Giá thuê</span>
              </div>
              <div className="divide-y divide-border/40 max-h-[200px] overflow-y-auto custom-scrollbar">
                {booking.bookingSlots.map((slot) => (
                  <div
                    key={slot.bookingSlotId}
                    className="grid grid-cols-3 px-3 py-2.5 text-xs bg-surface hover:bg-surface-hover transition-colors"
                  >
                    <span className="text-text-secondary font-medium">
                      {dayjs(slot.bookingDate).format("DD/MM/YYYY")}
                    </span>
                    <span className="text-center text-text-secondary">
                      {formatTimeRange(
                        slot.fieldSlot?.starttime,
                        slot.fieldSlot?.endtime,
                      )}
                    </span>
                    <span className="text-right font-semibold text-brand-accent">
                      {formatCurrency(slot.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          {booking.bookingServices.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Dịch vụ kèm theo
              </p>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-4 bg-elevated/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  <span className="col-span-1">Dịch vụ</span>
                  <span className="text-center">Số lượng</span>
                  <span className="text-center">Đơn giá</span>
                  <span className="text-right">Thành tiền</span>
                </div>
                <div className="divide-y divide-border/40">
                  {booking.bookingServices.map((svc) => (
                    <div
                      key={svc.bookingServiceId}
                      className="grid grid-cols-4 px-3 py-2.5 text-xs bg-surface hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-center gap-1.5 col-span-1">
                        <Package className="h-3 w-3 text-brand-accent shrink-0" />
                        <span className="text-text-secondary font-medium truncate">
                          {svc.service?.name}
                        </span>
                      </div>
                      <span className="text-center text-text-secondary">
                        x{svc.quantity}
                      </span>
                      <span className="text-center text-text-secondary">
                        {formatCurrency(svc.price)}
                      </span>
                      <span className="text-right font-semibold text-text-primary">
                        {formatCurrency(svc.price * svc.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Financial summary */}
          <div className="rounded-lg border border-border bg-elevated/40 px-4 py-3 space-y-2">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Tiền thuê sân</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(
                  booking.invoice?.fieldAmount ?? booking.totalPrice,
                )}
              </span>
            </div>
            {booking.bookingServices.length > 0 && (
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Tiền dịch vụ thêm</span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(booking.invoice?.serviceAmount ?? 0)}
                </span>
              </div>
            )}
            <Separator className="bg-border/50" />
            <div className="flex justify-between text-sm font-bold">
              <span className="text-text-primary">Tổng cộng</span>
              <span className="text-brand-accent text-base">
                {formatCurrency(
                  booking.invoice?.totalAmount ?? booking.totalPrice,
                )}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Đã đặt cọc (30%)</span>
              <span className="font-semibold text-status-success">
                {formatCurrency(booking.depositAmount)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Còn thanh toán tại sân</span>
              <span className="font-semibold text-status-warning">
                {formatCurrency(
                  booking.invoice?.remainAmount ??
                    booking.totalPrice - booking.depositAmount,
                )}
              </span>
            </div>
          </div>

          {/* Review CTA */}
          {isCompleted && (
            <div className="flex items-center justify-between rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 gap-3">
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  {hasReviewed
                    ? "Đã đánh giá chất lượng sân"
                    : "Đánh giá chất lượng sân bóng"}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {hasReviewed
                    ? "Bạn đã gửi đánh giá cho đơn đặt sân này."
                    : "Chia sẻ trải nghiệm mặt sân, ánh sáng và chất lượng phục vụ."}
                </p>
              </div>
              <Button
                size="sm"
                disabled={hasReviewed}
                onClick={() => onReview(booking)}
                className={`font-semibold shrink-0 ${
                  hasReviewed
                    ? "bg-surface-hover text-text-muted border border-border/60 shadow-none cursor-not-allowed opacity-60"
                    : "bg-brand-primary hover:bg-brand-primary-hover text-white shadow-[0_2px_8px_rgba(34,165,90,0.3)] cursor-pointer"
                }`}
              >
                <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                {hasReviewed ? "Đã đánh giá" : "Đánh giá"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Invoice Dialog ─────────────────────────────────────────────────────────
function InvoiceDialog({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!booking?.invoice) return null;
  const inv = booking.invoice;

  const invoiceStatusConfig: Record<string, { label: string; cls: string }> = {
    PAID: {
      label: "Đã thanh toán",
      cls: "border-status-success/25 bg-status-success-bg text-status-success",
    },
    PENDING: {
      label: "Chờ thanh toán",
      cls: "border-status-warning/25 bg-status-warning-bg text-status-warning",
    },
    DEPOSITED: {
      label: "Đã đặt cọc",
      cls: "border-status-warning/25 bg-status-warning-bg text-status-warning",
    },
    CANCELLED: {
      label: "Đã hủy",
      cls: "border-status-danger/25 bg-status-danger-bg text-status-danger",
    },
  };
  const invStatus =
    invoiceStatusConfig[inv.status] ?? invoiceStatusConfig.PENDING;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header */}
        <div className="bg-elevated/80 p-5 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-text-primary">
                  Hóa đơn #{inv.invoiceId}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {booking.bookingSlots[0]?.fieldSlot?.field?.name}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Slots */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Khung giờ đặt sân
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="divide-y divide-border/40 max-h-[150px] overflow-y-auto custom-scrollbar">
                {booking.bookingSlots.map((slot) => (
                  <div
                    key={slot.bookingSlotId}
                    className="flex items-center justify-between px-3 py-2 text-xs bg-surface hover:bg-surface-hover"
                  >
                    <span className="text-text-secondary">
                      {dayjs(slot.bookingDate).format("DD/MM/YYYY")}
                    </span>
                    <span className="text-text-secondary">
                      {formatTimeRange(
                        slot.fieldSlot?.starttime,
                        slot.fieldSlot?.endtime,
                      )}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(slot.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          {booking.bookingServices.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Dịch vụ kèm
              </p>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="divide-y divide-border/40 max-h-[120px] overflow-y-auto custom-scrollbar">
                  {booking.bookingServices.map((svc) => (
                    <div
                      key={svc.bookingServiceId}
                      className="flex items-center justify-between px-3 py-2 text-xs bg-surface hover:bg-surface-hover"
                    >
                      <span className="text-text-secondary font-medium">
                        {svc.service?.name}
                      </span>
                      <span className="text-text-muted">x{svc.quantity}</span>
                      <span className="font-semibold text-text-primary">
                        {formatCurrency(svc.price * svc.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="rounded-lg border border-border bg-elevated/40 px-4 py-3 space-y-2.5">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Tiền thuê sân</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(inv.fieldAmount)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Tiền dịch vụ</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(inv.serviceAmount)}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between text-sm font-bold">
              <span className="text-text-primary">Tổng cộng</span>
              <span className="text-brand-accent text-base">
                {formatCurrency(inv.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Đã đặt cọc</span>
              <span className="font-semibold text-status-success">
                {formatCurrency(inv.deposit)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">
                Còn lại thanh toán tại sân
              </span>
              <span className="font-semibold text-status-warning">
                {formatCurrency(inv.remainAmount)}
              </span>
            </div>
          </div>

          {/* Invoice meta */}
          <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className={`text-xs ${invStatus.cls}`}>
              <CreditCard className="h-3 w-3 mr-1" />
              {invStatus.label}
            </Badge>
            <span className="text-xs text-text-muted">
              {inv.createdAt
                ? dayjs(inv.createdAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function UserHistoryPage() {
  const { data: bookings = [], isLoading, error } = useMyBookings();
  const cancelBookingMutation = useCancelBooking();

  const [selectedForReview, setSelectedForReview] = useState<Booking | null>(
    null,
  );
  const [selectedForInvoice, setSelectedForInvoice] = useState<Booking | null>(
    null,
  );
  const [selectedForCancel, setSelectedForCancel] = useState<Booking | null>(
    null,
  );
  const [cancelError, setCancelError] = useState<string | null>(null);

  const confirmedCount = bookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "CANCELLED",
  ).length;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return bookings.slice(start, start + PAGE_SIZE);
  }, [bookings, currentPage]);

  const handleCancelConfirm = (cancelReason: string) => {
    if (!selectedForCancel) return;
    setCancelError(null);
    cancelBookingMutation.mutate(
      { bookingId: selectedForCancel.bookingId, cancelReason },
      {
        onSuccess: () => {
          setSelectedForCancel(null);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Hủy booking thất bại. Vui lòng thử lại.";
          setCancelError(msg);
        },
      },
    );
  };
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 py-8">
      {/* ── Page Header ── */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="bg-elevated/80 p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Lịch sử đặt sân
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Xem lại các đơn đặt sân, hóa đơn và gửi đánh giá chất lượng.
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        {!isLoading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-3 divide-x divide-border/50 bg-base/30">
            <div className="flex flex-col items-center py-4 px-2">
              <p className="text-2xl font-bold text-text-primary">
                {bookings.length}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Tổng đặt sân</p>
            </div>
            <div className="flex flex-col items-center py-4 px-2">
              <p className="text-2xl font-bold text-status-success">
                {confirmedCount}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Đang xác nhận</p>
            </div>
            <div className="flex flex-col items-center py-4 px-2">
              <p className="text-2xl font-bold text-status-info">
                {completedCount}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Hoàn thành</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted rounded-xl border border-border bg-surface">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <p className="text-sm">Đang tải lịch sử đặt sân...</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger-bg p-5 text-status-danger">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            Không thể tải lịch sử đặt sân. Vui lòng thử lại sau.
          </p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-16 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <CalendarCheck className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">
              Chưa có đơn đặt sân nào
            </p>
            <p className="text-sm text-text-muted mt-1">
              Hãy đặt sân ngay để bắt đầu trận đấu!
            </p>
          </div>
        </div>
      )}

      {/* ── Booking list ── */}
      {!isLoading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          {paginatedBookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onReview={setSelectedForReview}
              onViewInvoice={setSelectedForInvoice}
              onCancel={(b) => {
                setSelectedForCancel(b);
                setCancelError(null);
              }}
            />
          ))}
        </div>
      )}

      {/* ── Review Dialog ── */}
      <Dialog
        open={!!selectedForReview}
        onOpenChange={(open) => {
          if (!open) setSelectedForReview(null);
        }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-surface text-text-primary">
          <div className="bg-elevated/80 p-5 border-b border-border">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent border border-brand-accent/20">
                  <Star className="h-5 w-5 fill-brand-accent" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-text-primary">
                    Đánh giá chất lượng sân
                  </DialogTitle>
                  <p className="text-xs text-text-muted mt-0.5">
                    {selectedForReview?.bookingSlots[0]?.fieldSlot?.field?.name}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="p-5">
            {selectedForReview && (
              <FeedbackForm
                bookingId={selectedForReview.bookingId}
                onSuccess={() => setSelectedForReview(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Invoice Dialog ── */}
      <InvoiceDialog
        booking={selectedForInvoice}
        open={!!selectedForInvoice}
        onClose={() => setSelectedForInvoice(null)}
      />

      {/* ── Cancel Booking Dialog ── */}
      <CancelBookingDialog
        open={!!selectedForCancel}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedForCancel(null);
            setCancelError(null);
          }
        }}
        bookingId={selectedForCancel?.bookingId ?? null}
        fieldName={selectedForCancel?.bookingSlots[0]?.fieldSlot?.field?.name}
        onConfirm={handleCancelConfirm}
        isSubmitting={cancelBookingMutation.isPending}
        serverError={cancelError}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={bookings.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
