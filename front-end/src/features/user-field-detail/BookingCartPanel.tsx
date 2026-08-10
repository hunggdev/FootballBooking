import { Button } from "@/components/ui/button";
import { CartHoldList } from "./CartHoldList";
import { ServiceSelector } from "./ServiceSelector";
import { BookingSummary } from "./BookingSummary";
import { formatTimeRange } from "@/lib/utils";
import type { HoldSlot } from "@/types/field";
import type { Service } from "@/types/service";
import type { BookingType } from "./booking";

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
    <div className="h-fit space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Vé đặt sân</p>
        <h3 className="text-xl font-bold">{fieldName}</h3>
      </div>

      {holds.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Chọn một khung giờ còn trống ở bên trái để tạm giữ chỗ.
        </p>
      ) : bookingDone ? (
        <div className="space-y-3">
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Đặt sân thành công cho {dateLabel} ·{" "}
            {formatTimeRange(holds[0].starttime, holds[holds.length - 1].endtime)}.
          </p>
          <Button className="w-full" onClick={onViewHistory}>
            Xem lịch sử đặt sân
          </Button>
        </div>
      ) : (
        <>
          <CartHoldList holds={holds} isHolding={isHolding} onRemove={onRemoveHold} />

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