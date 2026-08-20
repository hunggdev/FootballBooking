import { Button } from "@/components/ui/button";
import { CartHoldList } from "./CartHoldList";
import { ServiceSelector } from "./ServiceSelector";
import { BookingSummary } from "./BookingSummary";
import { formatTimeRange } from "@/lib/utils";
import type { HoldSlot } from "@/types/field";
import type { Service } from "@/types/service";
import type { BookingType } from "./booking";
// import type { Socket } from "socket.io-client";

interface BookingCartPanelProps {
  fieldName: string;
  dateLabel: string;
  holds: HoldSlot[];
  bookingDone: boolean;
  isHolding: boolean;
  isConfirming: boolean;
  bookingType: BookingType;
  services: Service[];
  cartItems: { service: Service; quantity: number }[];
  totalPrice: number;
  deposit: number;
  total: number;
  onRemoveHold: (holdId: string) => void;
  onAddService: (id: string | null) => void;
  onChangeQuantity: (id: number, delta: number) => void;
  onRemoveService: (id: number) => void;
  onConfirm: () => void;
  onViewHistory: () => void;
}

export function BookingCartPanel({
  fieldName,
  dateLabel,
  holds,
  bookingDone,
  isHolding,
  isConfirming,
  bookingType,
  services,
  cartItems,
  totalPrice,
  deposit,
  total,
  onRemoveHold,
  onAddService,
  onChangeQuantity,
  onRemoveService,
  onConfirm,
  onViewHistory,
}: BookingCartPanelProps) {
  return (
    <div className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted">
          Vé đặt sân
        </p>

        <h3 className="text-xl font-bold text-text-primary">
          {fieldName}
        </h3>
      </div>

      {holds.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface-hover/40 p-4 text-center text-sm text-text-muted">
          Chọn một khung giờ còn trống ở bên trái để tạm giữ chỗ.
        </p>
      ) : bookingDone ? (
        <div className="space-y-3">
          <p className="rounded-lg border border-brand-primary/40 bg-brand-primary/10 p-4 text-sm text-brand-primary">
            Đặt sân thành công cho {dateLabel} ·{" "}
            {formatTimeRange(
              holds[0].starttime,
              holds[holds.length - 1].endtime
            )}.
          </p>

          <Button
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover"
            onClick={onViewHistory}
          >
            Xem lịch sử đặt sân
          </Button>
        </div>
      ) : (
        <>
          <CartHoldList
            holds={holds}
            isHolding={isHolding}
            onRemove={onRemoveHold}
          />

          <BookingSummary
            bookingType={bookingType}
            totalPrice={totalPrice}
            deposit={deposit}
            total={total}
            canConfirm={holds.length > 0}
            isConfirming={isConfirming}
            onConfirm={onConfirm}
          />

          <ServiceSelector
            services={services}
            cartItems={cartItems}
            onAdd={onAddService}
            onChangeQuantity={onChangeQuantity}
            onRemove={onRemoveService}
          />
        </>
      )}
    </div>
  );
}