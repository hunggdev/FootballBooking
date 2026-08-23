import { Loader2 } from "lucide-react";
import { CartHoldItem } from "./CartHoldItem";
import type { HoldSlot } from "@/types/field";

interface CartHoldListProps {
  holds: HoldSlot[];
  isHolding: boolean;
  onRemove: (holdId: string) => void;
}

export function CartHoldList({ holds, isHolding, onRemove }: CartHoldListProps) {
  return (
    <>
      {isHolding && !holds.length && (
        <div className="flex items-center gap-2 rounded-lg border border-status-warning/30 bg-status-warning-bg p-3 text-sm text-status-warning">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang giữ chỗ...
        </div>
      )}
      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {holds.map((hold) => (
          <CartHoldItem key={hold.holdId} hold={hold} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}