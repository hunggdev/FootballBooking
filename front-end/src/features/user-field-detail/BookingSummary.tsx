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
          <dt className="text-muted-foreground">Loại đặt sân</dt>
          <dd className="font-medium">{bookingType === "ONE_TIME" ? "Đặt 1 lần" : "Đặt dài hạn"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Giá sân</dt>
          <dd className="font-medium">{formatCurrency(totalPrice)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tiền cọc (30%)</dt>
          <dd className="font-medium">{formatCurrency(deposit)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-sm font-semibold">Tổng thanh toán</span>
        <span className="text-xl font-bold text-amber-400">{formatCurrency(total)}</span>
      </div>

      <Button
        className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
        onClick={onConfirm}
        disabled={!canConfirm || isConfirming}
      >
        {isConfirming ? "Đang xác nhận..." : "Xác nhận đặt sân →"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">Vui lòng nhấn xác nhận trong 10 phút tạm giữ chỗ.</p>
    </>
  );
}