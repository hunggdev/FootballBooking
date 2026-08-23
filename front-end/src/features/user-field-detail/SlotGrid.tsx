import { Loader2 } from "lucide-react";
import { SlotButton } from "./SlotButton";
import type { HoldSlot } from "@/types/field";

interface SlotGridProps {
  slots: HoldSlot[] | undefined;
  holds: HoldSlot[];
  selectedDate: string;
  isLoading: boolean;
  isMutating: boolean;
  bookingDone: boolean;
  onSelectSlot: (slot: HoldSlot) => void;
}

export function SlotGrid({
  slots,
  holds,
  selectedDate,
  isLoading,
  isMutating,
  bookingDone,
  onSelectSlot,
}: SlotGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Sơ đồ khung giờ
        </h2>

        {(isLoading || isMutating) && (
          <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
        )}
      </div>

      {!isLoading && (!slots || slots.length === 0) ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Chưa có khung giờ cho ngày này. Hoặc có thể do bạn chưa ĐĂNG NHẬP.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(slots ?? []).map((slot) => {
            const isMine =
              Boolean(slot.isMyHold) ||
              holds.some(
                (h) =>
                  h.slotId === slot.slotId &&
                  h.bookingDate === selectedDate
              );

            const isOtherHoldSlot =
              slot.status === "HOLD" && !isMine;

            const isBooked = slot.status === "BOOKED";
            const isMaintenance = slot.status === "MAINTENANCE";

            const canSelect =
              (slot.status === "AVAILABLE" || isMine) &&
              !isBooked &&
              !isMaintenance &&
              !isOtherHoldSlot;

            return (
              <SlotButton
                key={slot.slotId}
                slot={slot}
                isMine={isMine}
                isOtherHoldSlot={isOtherHoldSlot}
                isBooked={isBooked}
                isMaintenance={isMaintenance}
                disabled={!canSelect || bookingDone}
                onClick={() => onSelectSlot(slot)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}