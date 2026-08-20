import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/booking-format";
import type { BookingType } from "./booking";

interface BookingSummaryProps {
  bookingType: BookingType;
  totalPrice: number;
  deposit: number;
  total: number;
  canConfirm: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
}

export function BookingSummary({
  bookingType,
  totalPrice,
  deposit,
  total,
  canConfirm,
  isConfirming,
  onConfirm,
}: BookingSummaryProps) {
  return (
    <>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-muted">Loại đặt sân</dt>
          <dd className="font-medium text-text-primary">
            {bookingType === "ONE_TIME" ? "Đặt 1 lần" : "Đặt dài hạn"}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-text-muted">Giá sân</dt>
          <dd className="font-medium text-text-primary">
            {formatCurrency(totalPrice)}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-text-muted">Tiền cọc (30%)</dt>
          <dd className="font-medium text-text-primary">
            {formatCurrency(deposit)}
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold text-text-primary">
          Tổng thanh toán
        </span>

        <span className="text-xl font-bold text-brand-accent">
          {formatCurrency(total)}
        </span>
      </div>

      <Button
        className="
          w-full
          bg-brand-primary
          font-semibold
          text-white
          shadow-sm
          transition-all
          hover:bg-brand-primary-hover
          hover:shadow-md
        "
        onClick={onConfirm}
        disabled={!canConfirm || isConfirming}
      >
        {isConfirming ? "Đang xác nhận..." : "Xác nhận đặt sân →"}
      </Button>

      <p className="text-center text-xs text-text-muted">
        Vui lòng nhấn xác nhận trong 10 phút tạm giữ chỗ.
      </p>
    </>
  );
}