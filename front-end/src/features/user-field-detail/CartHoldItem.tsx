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
        <p className="font-medium text-text-primary">Slot {hold.slotId}</p>

        <p className="text-xs text-text-secondary">
          {hold.bookingDate} · {formatTimeRange(hold.starttime, hold.endtime)}
        </p>
      </div>

      <span className="ml-2 text-sm font-semibold text-status-warning">
        {formatCountdown(hold.ttl ?? 0)}
      </span>

      <button
        type="button"
        onClick={() => {
          if (hold.holdId) {
            onRemove(hold.holdId);
          }
        }}
        className="
          ml-3
          rounded-md
          p-2
          text-text-muted
          transition-colors
          hover:bg-status-danger-bg
          hover:text-status-danger
          focus:outline-none
          focus:ring-2
          focus:ring-status-danger/20
        "
        title="Bỏ chọn slot này"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Xóa slot</span>
      </button>
    </div>
  );
}
