import { cn, formatTimeRange } from "@/lib/utils";
import { formatCurrency } from "@/lib/booking-format";
import type { HoldSlot } from "@/types/field";

interface SlotButtonProps {
  slot: HoldSlot;
  isMine: boolean;
  isOtherHoldSlot: boolean;
  isBooked: boolean;
  isMaintenance: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SlotButton({
  slot,
  isMine,
  isOtherHoldSlot,
  isBooked,
  isMaintenance,
  disabled,
  onClick,
}: SlotButtonProps) {
  const canSelect = !isBooked && !isMaintenance && !isOtherHoldSlot;

  let stateLabel = "Còn trống";
  if (isMine) stateLabel = "Đang giữ (Bạn)";
  else if (isOtherHoldSlot) stateLabel = "Đang có người giữ";
  else if (isBooked) stateLabel = "Đã đặt";
  else if (isMaintenance) stateLabel = "Đóng";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center transition-all duration-100 active:scale-95",

        // 🟢 CÒN TRỐNG
        canSelect &&
        !isMine &&
        "cursor-pointer border-status-success/40 bg-status-success-bg text-status-success hover:border-status-success/60 hover:bg-status-success/10",

        // 🟢 ĐANG GIỮ - BỞI BẠN
        isMine &&
        "cursor-pointer scale-[1.02] border-brand-primary bg-brand-primary/15 font-bold text-brand-primary ring-1 ring-brand-primary/30",

        // 🟡 ĐANG GIỮ - NGƯỜI KHÁC
        isOtherHoldSlot &&
        "cursor-not-allowed border-status-warning/40 bg-status-warning-bg text-status-warning opacity-90",

        // 🔴 ĐÃ ĐẶT
        isBooked &&
        "cursor-not-allowed border-status-danger/40 bg-status-danger-bg text-status-danger opacity-90",

        // ⚫ ĐÓNG / BẢO TRÌ
        isMaintenance &&
        "cursor-not-allowed border-border bg-surface-hover text-text-muted opacity-70"
      )}
    >
      <span className="text-sm font-medium text-text-primary">
        {formatTimeRange(slot.starttime, slot.endtime)}
      </span>

      <span className="text-xs text-text-secondary">
        {formatCurrency(Number(slot.price))}
      </span>

      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wide",

          // 🟢 Còn trống
          canSelect && !isMine && "text-status-success",

          // 🟢 Bạn đang giữ
          isMine && "text-brand-primary",

          // 🟡 Người khác đang giữ
          isOtherHoldSlot && "text-status-warning",

          // 🔴 Đã đặt
          isBooked && "text-status-danger",

          // ⚫ Đóng
          isMaintenance && "text-text-muted"
        )}
      >
        {stateLabel}
      </span>
    </button>
  );
}