import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useField, useFieldSlotsByDate } from "@/stores/useFieldStore";
import { useServices } from "@/stores/useServiceStore";
import { useConfirmBooking, useHoldSlot } from "@/stores/useBookingStore";

import { FIELD_TYPE_LABEL } from "@/types/field";
import type { FieldSlot } from "@/types/field";
import type { Service } from "@/types/service";
import { FieldReviewSection } from "@/features/user-review/FieldReviewSection";

import { cn, formatTimeRange } from "@/lib/utils";

const WEEKDAY_LABEL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
type BookingType = "ONE_TIME" | "LONG_TERM";

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function formatCountdown(totalSeconds: number) {
  const sec = Math.max(0, totalSeconds);
  const minutes = Math.floor(sec / 60);
  const remainingSeconds = sec % 60;
  if (minutes > 0) {
    return `${minutes} phút ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds} giây`;
  }
  return `${remainingSeconds} giây`;
}

export default function FieldDetailPage() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const numericFieldId = Number(fieldId);

  const urlSlotId = searchParams.get("slotId");
  const urlDate = searchParams.get("date");

  const [bookingType, setBookingType] = useState<BookingType>("ONE_TIME");
  const [selectedDate, setSelectedDate] = useState(() => urlDate || dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState<FieldSlot | null>(null);
  const [hold, setHold] = useState<{ holdId: number; expiresAt: string } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [bookingDone, setBookingDone] = useState(false);
  const [hasAutoSelectedUrlSlot, setHasAutoSelectedUrlSlot] = useState(false);

  const { data: field, isLoading: isFieldLoading } = useField(numericFieldId);
  const {
    data: slots,
    isLoading: isSlotsLoading,
    refetch: refetchSlots,
  } = useFieldSlotsByDate(numericFieldId, selectedDate);
  const { data: services } = useServices();

  const holdSlotMutation = useHoldSlot();
  const confirmBookingMutation = useConfirmBooking();
  const isHolding = holdSlotMutation.isPending;
  const isConfirming = confirmBookingMutation.isPending;

  const activeServices = useMemo(
    () => (services ?? []).filter((s) => s.status === "ACTIVE"),
    [services]
  );

  const resetSelection = () => {
    setSelectedSlot(null);
    setHold(null);
    setCart({});
  };

  const changeDate = (newDate: string) => {
    setSelectedDate(newDate);
    resetSelection();
    setBookingDone(false);
  };

  // Đếm ngược cho lần giữ chỗ đang hoạt động (10s)
  useEffect(() => {
    if (!hold) return;

    const tick = () => {
      const diff = Math.round((new Date(hold.expiresAt).getTime() - Date.now()) / 1000);
      setSecondsLeft(diff);

      if (diff <= 0) {
        setHold(null);
        setSelectedSlot(null);
        toast.error("Hết 10 phút tạm giữ chỗ mà chưa đặt. Trạng thái khung giờ đã quay về CÒN TRỐNG ban đầu.");
        refetchSlots();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hold, refetchSlots]);

  const handleSelectSlot = async (slot: FieldSlot) => {
    const canSelect = slot.status === "AVAILABLE" || Boolean(slot.isMyHold);
    if (!canSelect || bookingDone || isHolding) return;

    setSelectedSlot(slot);
    setHold(null);

    try {
      const result = await holdSlotMutation.mutateAsync({
        slotId: slot.slotId,
        bookingDate: selectedDate,
      });
      setHold({ holdId: result.holdId, expiresAt: result.expiresAt });
      refetchSlots();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Khung giờ vừa được người khác giữ.";
      toast.error(message);
      setSelectedSlot(null);
      refetchSlots();
    }
  };

  useEffect(() => {
    if (urlSlotId && slots && !selectedSlot && !hold && !isHolding && !hasAutoSelectedUrlSlot) {
      setHasAutoSelectedUrlSlot(true);
      const targetSlot = slots.find((s) => s.slotId === Number(urlSlotId));
      if (targetSlot && (targetSlot.status === "AVAILABLE" || targetSlot.isMyHold)) {
        handleSelectSlot(targetSlot);
      }
    }
  }, [slots, urlSlotId, hasAutoSelectedUrlSlot]);

  if (isFieldLoading) {
    return <p className="p-6 text-center text-sm text-muted-foreground">Đang tải chi tiết sân...</p>;
  }

  if (!field) {
    return <p className="p-6 text-center text-sm text-muted-foreground">Không tìm thấy sân.</p>;
  }

  const handleConfirm = async () => {
    if (!selectedSlot || !hold) return;

    const payloadServices = Object.entries(cart).map(([id, qty]) => ({
      serviceId: Number(id),
      quantity: qty,
    }));

    try {
      await confirmBookingMutation.mutateAsync({
        slotId: selectedSlot.slotId,
        bookingDate: selectedDate,
        type: bookingType,
        depositAmount: Math.round((Number(selectedSlot.price) * 0.3) / 1000) * 1000,
        services: payloadServices,
      });

      setBookingDone(true);
      setHold(null);
      toast.success("Xác nhận đặt sân thành công!");
      refetchSlots();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đặt sân thất bại.";
      toast.error(message);
      setHold(null);
      setSelectedSlot(null);
      refetchSlots();
    }
  };

  const addService = (serviceId: string | null) => {
    if (!serviceId) return;
    const id = Number(serviceId);
    setCart((prev) => ({ ...prev, [id]: prev[id] ? prev[id] + 1 : 1 }));
  };

  const changeQuantity = (serviceId: number, delta: number) => {
    setCart((prev) => {
      const next = (prev[serviceId] ?? 0) + delta;
      if (next <= 0) {
        return Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId));
      }
      return { ...prev, [serviceId]: next };
    });
  };

  const removeService = (serviceId: number) => {
    setCart((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId))
    );
  };

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => ({
      service: activeServices.find((s) => s.serviceId === Number(id)),
      quantity,
    }))
    .filter((item): item is { service: Service; quantity: number } => !!item.service);

  const servicesTotal = cartItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const slotPrice = selectedSlot ? Number(selectedSlot.price) : 0;
  const total = slotPrice + servicesTotal;
  const deposit = selectedSlot ? Math.round((slotPrice * 0.3) / 1000) * 1000 : 0;

  const dateObj = dayjs(selectedDate);
  const dateLabel = `${WEEKDAY_LABEL[dateObj.day()]}, ${dateObj.format("DD/MM")}`;

  return (
    <div className="dark bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        {/* Field header */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{field.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {field.description ?? "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng."}
              </p>
            </div>
            <Badge variant="outline">{FIELD_TYPE_LABEL[field.fieldType]}</Badge>
          </div>
        </div>

        {/* Loại đặt sân */}
        <div className="flex gap-2 border-b">
          {(
            [
              { value: "ONE_TIME", label: "Đặt 1 lần" },
              { value: "LONG_TERM", label: "Đặt dài hạn" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              disabled={bookingDone}
              onClick={() => setBookingType(tab.value)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                bookingType === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {bookingType === "LONG_TERM" && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400">
            Đặt dài hạn: khung giờ bạn chọn bên dưới sẽ được đăng ký giữ cố định theo yêu cầu dài
            hạn. Nhân viên sân sẽ liên hệ xác nhận lịch định kỳ sau khi bạn hoàn tất đặt sân.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: schedule */}
          <div className="space-y-4 rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sơ đồ khung giờ</h2>
              {(isSlotsLoading || isHolding) && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Còn trống
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Đang được giữ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> Đã đặt
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-red-500" /> Bạn đang chọn
              </span>
            </div>

            {/* Date navigation */}
            <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate(dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD"))}
              >
                <ChevronLeft className="h-4 w-4" /> Hôm qua
              </Button>
              <span className="text-sm font-semibold">{dateLabel}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"))}
              >
                Ngày mai <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slot grid */}
            {!isSlotsLoading && (!slots || slots.length === 0) ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Chưa có khung giờ cho ngày này.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(slots ?? []).map((slot) => {
                  const isMine = selectedSlot?.slotId === slot.slotId;
                  const isBeingHeldByMe = isMine && !!hold;
                  const isPickingThis = isMine && isHolding;
                  const isMyHoldSlot = Boolean(slot.isMyHold);
                  const canSelect = slot.status === "AVAILABLE" || isMyHoldSlot || isMine;
                  const disabled = (!canSelect && !isMine) || bookingDone || (isHolding && !isMine);

                  let stateLabel = "Còn trống";
                  if (isBeingHeldByMe) stateLabel = "Đang giữ (bạn)";
                  else if (isPickingThis) stateLabel = "Đang chọn...";
                  else if (isMyHoldSlot) stateLabel = "Bạn đang giữ";
                  else if (slot.status === "HOLD") stateLabel = "Đang giữ";
                  else if (slot.status === "BOOKED") stateLabel = "Đã đặt";
                  else if (slot.status === "MAINTENANCE") stateLabel = "Bảo trì";

                  return (
                    <button
                      key={slot.slotId}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelectSlot(slot)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center transition-colors",
                        slot.status === "AVAILABLE" && !isMine && !isMyHoldSlot
                          ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer"
                          : "",
                        isMyHoldSlot && !isMine
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 font-bold cursor-pointer ring-1 ring-emerald-500/30"
                          : "",
                        slot.status === "HOLD" && !isMyHoldSlot && !isMine
                          ? "cursor-not-allowed border-amber-500/40 bg-amber-500/10 text-amber-500 opacity-80"
                          : "",
                        slot.status === "BOOKED" && !isMine
                          ? "cursor-not-allowed border-muted bg-muted/40 text-muted-foreground opacity-60"
                          : "",
                        isPickingThis && "border-2 border-red-500 bg-red-500/5",
                        isBeingHeldByMe && "border-2 border-amber-500 bg-amber-500/10"
                      )}
                    >
                      <span className="text-sm font-medium">
                        {formatTimeRange(slot.starttime, slot.endtime)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(Number(slot.price))}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {stateLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: booking summary */}
          <div className="h-fit space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Vé đặt sân</p>
              <h3 className="text-xl font-bold">{field.name}</h3>
            </div>

            {!selectedSlot ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                Chọn một khung giờ còn trống ở bên trái để tạm giữ chỗ.
              </p>
            ) : bookingDone ? (
              <div className="space-y-3">
                <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                  Đặt sân thành công cho {dateLabel} ·{" "}
                  {formatTimeRange(selectedSlot.starttime, selectedSlot.endtime)}.
                </p>
                <Button className="w-full" onClick={() => navigate("/user/history")}>
                  Xem lịch sử đặt sân
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {dateLabel} · {formatTimeRange(selectedSlot.starttime, selectedSlot.endtime)}
                </p>

                {isHolding && !hold && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang giữ chỗ...
                  </div>
                )}

                {hold && (
                  <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <span className="text-sm font-medium text-red-400">Tạm giữ chỗ 10s đếm ngược:</span>
                    <span className="font-mono text-xl font-bold text-red-400">
                      {formatCountdown(secondsLeft)}
                    </span>
                  </div>
                )}

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Loại đặt sân</dt>
                    <dd className="font-medium">
                      {bookingType === "ONE_TIME" ? "Đặt 1 lần" : "Đặt dài hạn"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Giá sân</dt>
                    <dd className="font-medium">{formatCurrency(slotPrice)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tiền cọc (30%)</dt>
                    <dd className="font-medium">{formatCurrency(deposit)}</dd>
                  </div>
                </dl>

                {/* Add-on services */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Dịch vụ thêm</p>

                  {activeServices.length > 0 && (
                    <Select onValueChange={addService}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="+ Chọn dịch vụ muốn thêm" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeServices.map((service) => (
                          <SelectItem key={service.serviceId} value={String(service.serviceId)}>
                            {service.name} · {formatCurrency(service.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {cartItems.map(({ service, quantity }) => (
                    <div
                      key={service.serviceId}
                      className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(service.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => changeQuantity(service.serviceId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-5 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => changeQuantity(service.serviceId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeService(service.serviceId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-semibold">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-amber-400">{formatCurrency(total)}</span>
                </div>

                <Button
                  className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  onClick={handleConfirm}
                  disabled={!hold || isConfirming}
                >
                  {isConfirming ? "Đang xác nhận..." : "Xác nhận đặt sân →"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Vui lòng nhấn xác nhận trong 10 phút tạm giữ chỗ.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Reviews for this specific field */}
        <FieldReviewSection fieldId={numericFieldId} fieldName={field.name} />
      </div>
    </div>
  );
}
