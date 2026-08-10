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
        canSelect &&
          !isMine &&
          "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer text-emerald-500 dark:text-emerald-300",
        isMine &&
          "border-emerald-500 bg-emerald-500/15 text-emerald-600 font-bold cursor-pointer ring-1 ring-emerald-500/30 scale-[1.02]",
        isOtherHoldSlot &&
          "cursor-not-allowed border-amber-500/40 bg-amber-500/10 text-amber-600 opacity-80",
        isBooked && "cursor-not-allowed border-red-500 text-muted-foreground opacity-60",
        isMaintenance && "cursor-not-allowed border-muted text-muted-foreground opacity-60"
      )}
    >
      <span className="text-sm font-medium">{formatTimeRange(slot.starttime, slot.endtime)}</span>
      <span className="text-xs text-muted-foreground">{formatCurrency(Number(slot.price))}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{stateLabel}</span>
    </button>
  );
}