import { Trash2 } from "lucide-react";
import { formatTimeRange } from "@/lib/utils";
import { formatCountdown } from "@/lib/booking-format";
import type { HoldSlot } from "@/types/field";

interface CartHoldItemProps {
  hold: HoldSlot;
  onRemove: (holdId: string) => void;
}

export function CartHoldItem({ hold, onRemove }: CartHoldItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p>Slot {hold.slotId}</p>
        <p className="text-sm text-muted-foreground">
          {hold.bookingDate} · {formatTimeRange(hold.starttime, hold.endtime)}
        </p>
      </div>
      <span className="ml-2 text-sm">{formatCountdown(hold.ttl)}</span>
      <button
        type="button"
        onClick={() => onRemove(hold.holdId)}
        className="ml-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
        title="Bỏ chọn slot này"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Xóa slot</span>
      </button>
    </div>
  );
}