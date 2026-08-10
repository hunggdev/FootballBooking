import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import { useField } from "@/stores/useFieldStore";
import { useServices } from "@/stores/useServiceStore";
import { useConfirmBooking, useHoldSlot, useDeleteSlotHold, useSlots, useMyHolds, useCreateBooking } from "@/stores/useBookingStore";
import { useBookingSocket } from "@/sockets/useBookingSocket";
import { useAuthStore } from "@/stores/useAuthStore";

import type { HoldSlot } from "@/types/field";
import type { BookingType } from "./booking";

import { FieldHeader } from "./FieldHeader";
import { BookingTypeTabs } from "./BookingTypeTabs";
import { SlotLegend } from "./SlotLegend";
import { DateNavigator } from "./DateNavigator";
import { SlotGrid } from "./SlotGrid";
import { BookingCartPanel } from "./BookingCartPanel";
import { FieldReviewSection } from "@/features/user-review/FieldReviewSection";

const WEEKDAY_LABEL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default function FieldDetail() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fieldId } = useParams<{ fieldId: string }>();
  const urlDate = searchParams.get("date");
  const numericFieldId = Number(fieldId);

  const [bookingType, setBookingType] = useState<BookingType>("ONE_TIME");
  const [selectedDate, setSelectedDate] = useState(() => urlDate?.split("T")[0] || dayjs().format("YYYY-MM-DD"));
  // Nguồn sự thật DUY NHẤT cho giỏ giữ chỗ — không tách selectedSlots riêng nữa.
  const [holds, setHolds] = useState<HoldSlot[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [bookingDone, setBookingDone] = useState(false);

  const { data: field, isLoading: isFieldLoading } = useField(numericFieldId);
  const { data: slots, isLoading: isSlotsLoading, refetch: refetchSlots } = useSlots(numericFieldId, selectedDate);
  const { data: mySlots } = useMyHolds(); // fetch 1 lần, sống bằng socket — KHÔNG phụ thuộc selectedDate
  const { data: services } = useServices();

  const holdSlotMutation = useHoldSlot();
  const deleteSlotHoldMutation = useDeleteSlotHold();
  const confirmBookingMutation = useConfirmBooking();
  const createBookingMutation = useCreateBooking();
  const isHolding = holdSlotMutation.isPending;
  const isDeletingHold = deleteSlotHoldMutation.isPending;
  const isConfirming = confirmBookingMutation.isPending;
  const isCreatingBooking = createBookingMutation.isPending;

  const activeServices = useMemo(() => (services ?? []).filter((s) => s.status === "ACTIVE"), [services]);

  // Đồng bộ holds từ dữ liệu server (useMyHolds) — bất kể đang xem ngày nào.
  useEffect(() => {
    if (!mySlots) return;
    setHolds(mySlots.filter((slot) => slot.isMyHold));
  }, [mySlots]);

  // Đếm ngược mỗi giây dựa trên expiresAt tuyệt đối.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHolds((prev) =>
        prev.map((hold) => ({
          ...hold,
          ttl: Math.max(0, Math.floor((new Date(hold.expiresAt).getTime() - now) / 1000)),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Chỉ reset dịch vụ thêm khi đổi ngày — KHÔNG đụng vào holds (holds là toàn cục theo user).
  const changeDate = (newDate: string) => {
    setSelectedDate(newDate);
    setCart({});
    setBookingDone(false);
    setSearchParams({ date: newDate });
  };

  useBookingSocket(user?.userId, numericFieldId, selectedDate);

  // Tự động dọn các hold đã hết hạn (sửa: dùng <= 0 thay vì === 0)
  useEffect(() => {
    const now = Date.now();
    const expired = holds.filter((hold) => (new Date(hold.expiresAt).getTime() - now) / 1000 <= 0);
    if (expired.length === 0) return;

    (async () => {
      try {
        await Promise.all(
          expired.map((hold) =>
            deleteSlotHoldMutation.mutateAsync({
              fieldId: numericFieldId,
              slotId: hold.slotId,
              bookingDate: hold.bookingDate,
            })
          )
        );
        setHolds((prev) => prev.filter((h) => !expired.some((e) => e.holdId === h.holdId)));
        toast.error(`${expired.length} khung giờ đã hết thời gian giữ chỗ`);
        refetchSlots();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [holds]);

  const handleSelectSlot = async (slot: HoldSlot) => {
    const formattedDate = selectedDate.split("T")[0];
    const isMine = Boolean(slot.isMyHold) || holds.some((h) => h.holdId === slot.holdId && h.bookingDate === formattedDate);
    const canSelect = slot.status === "AVAILABLE" || isMine;
    if (!canSelect || bookingDone) return;

    if (isMine) {
      setHolds((prev) => prev.filter((h) => h.holdId !== slot.holdId));
      queryClient.setQueryData<HoldSlot[]>(["slots", numericFieldId, formattedDate], (old) =>
        old?.map((s) => ((s.slotId === slot.slotId && s.bookingDate === formattedDate) ? { ...s, isMyHold: false, status: "AVAILABLE" } : s))
      );

      try {
        await deleteSlotHoldMutation.mutateAsync({
          fieldId: numericFieldId,
          slotId: slot.slotId,
          bookingDate: slot.bookingDate || formattedDate,
        });
        toast.success("Đã hủy giữ chỗ thành công.");
      } catch (error: unknown) {
        queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, formattedDate] });
        queryClient.invalidateQueries({ queryKey: ["my-holds"] });
        toast.error(error instanceof Error ? error.message : "Hủy giữ chỗ thất bại.");
      }
      return;
    }

    // Optimistic hold — giá trị 600s CHỈ là hiển thị tạm trong lúc chờ server, sẽ được ghi đè ngay bên dưới.
    let holdId = `hold:${numericFieldId}:${slot.slotId}:${formattedDate}`
    const optimisticHold: HoldSlot = {
      ...slot,
      holdId,
      isMyHold: true,
      status: "HOLD",
      bookingDate: formattedDate,
      expiresAt: new Date(Date.now() + 600000).toISOString(),
      ttl: 600,
    };
    setHolds((prev) => [...prev, optimisticHold]);
    queryClient.setQueryData<HoldSlot[]>(["slots", numericFieldId, formattedDate], (old) =>
      old?.map((s) => ((s.slotId === slot.slotId && s.bookingDate === formattedDate) ? { ...s, isMyHold: true, status: "HOLD", expiresAt: optimisticHold.expiresAt, ttl: 600 } : s))
    );

    try {
      const created = await holdSlotMutation.mutateAsync({
        fieldId: numericFieldId,
        slotId: slot.slotId,
        bookingDate: formattedDate,
      });
      // Ghi đè bằng expiresAt/ttl THẬT từ Redis — tránh lệch giờ do độ trễ mạng.
      if (created?.expiresAt) {
        setHolds((prev) =>
          prev.map((h) => (h.holdId === holdId ? { ...h, expiresAt: created.expiresAt, ttl: created.ttl } : h))
        );
      }
    } catch (error: unknown) {
      setHolds((prev) => prev.filter((h) => h.holdId !== holdId));
      queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, formattedDate] });
      queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      toast.error(error instanceof Error ? error.message : "Khung giờ vừa được người khác giữ.");
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
      if (next <= 0) return Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId));
      return { ...prev, [serviceId]: next };
    });
  };

  const removeService = (serviceId: number) => {
    setCart((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId)));
  };

const handleConfirm = async () => {
  if (!holds.length || isConfirming) return;

  // holds đến từ useMyHolds, hiện tại trang chỉ hiển thị 1 sân nên mọi hold
  // ở đây đều thuộc numericFieldId. Nếu sau này mở rộng đa sân trong cùng giỏ,
  // cần đổi HoldSlot để tự mang fieldId riêng thay vì suy ra từ context trang.
  const payloadSlots = holds.map((hold) => ({
    fieldId: numericFieldId,
    slotId: hold.slotId,
    bookingDate: hold.bookingDate,
  }));

  const payloadServices = Object.entries(cart).map(([serviceId, quantity]) => ({
    serviceId: Number(serviceId),
    quantity,
  }));

  try {
    await createBookingMutation.mutateAsync({
      slots: payloadSlots,
      type: bookingType,
      depositAmount: deposit,
      note: undefined,
      services: payloadServices,
    });

    setBookingDone(true);

    // Booking đã CONFIRMED -> các slot này không còn là "hold" nữa, xoá khỏi giỏ ngay (optimistic).
    // Server cũng emit "user:cart_updated" { action: "CLEAR" } và "schedule:updated" status BOOKED,
    // nhưng set trực tiếp ở đây để UI phản hồi 0ms, không đợi round-trip socket.
    setHolds([]);
    setCart({});

    // useCreateBooking đã tự invalidate ["my-holds"] trong onSuccess, chỉ cần
    // invalidate thêm cache Grid vì hook đó không biết selectedDate hiện tại.
    queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, selectedDate] });

    toast.success("Đặt sân thành công!");
  } catch (error: unknown) {
    // Đọc message thật từ backend qua response.data, không dùng error.message mặc định
    // của AxiosError (chỉ là "Request failed with status code 400").
    // const message = axios.isAxiosError(error)
    //   ? error.response?.data?.message ?? "Đặt sân thất bại."
    //   : error instanceof Error
    //   ? error.message
    //   : "Đặt sân thất bại.";

    toast.error("Đặt sân thất bại");

    // Lỗi phổ biến nhất ở đây: một slot hết hạn giữ chỗ đúng lúc bấm xác nhận
    // (createBooking check hold trước transaction). Đồng bộ lại state thật từ server
    // thay vì đoán, để không hiển thị sai lệch với những gì đã thực sự xảy ra.
    queryClient.invalidateQueries({ queryKey: ["my-holds"] });
    queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, selectedDate] });
  }
};


  if (isFieldLoading) return <p className="p-6 text-center text-sm text-muted-foreground">Đang tải chi tiết sân...</p>;
  if (!field) return <p className="p-6 text-center text-sm text-muted-foreground">Không tìm thấy sân.</p>;

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => ({ service: activeServices.find((s) => s.serviceId === Number(id)), quantity }))
    .filter((item): item is { service: (typeof activeServices)[number]; quantity: number } => !!item.service);

  const servicesTotal = cartItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const totalPrice = holds.reduce((total, slot) => total + Number(slot.price), 0);
  const total = totalPrice + servicesTotal;
  const deposit = holds.length > 0 ? Math.round((totalPrice * 0.3) / 1000) * 1000 : 0;

  const dateObj = dayjs(selectedDate);
  const dateLabel = `${WEEKDAY_LABEL[dateObj.day()]}, ${dateObj.format("DD/MM")}`;

  return (
    <div className="dark bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <FieldHeader name={field.name} description={field.description} fieldType={field.fieldType} />

        <BookingTypeTabs value={bookingType} onChange={setBookingType} disabled={bookingDone} />

        {bookingType === "LONG_TERM" && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400">
            Đặt dài hạn: khung giờ bạn chọn bên dưới sẽ được đăng ký giữ cố định theo yêu cầu dài hạn. Nhân viên sân
            sẽ liên hệ xác nhận lịch định kỳ sau khi bạn hoàn tất đặt sân.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4 rounded-xl border bg-card p-5">
            <SlotLegend />
            <DateNavigator
              dateLabel={dateLabel}
              onPrev={() => changeDate(dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD"))}
              onNext={() => changeDate(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"))}
            />
            <SlotGrid
              slots={slots}
              holds={holds}
              selectedDate={selectedDate}
              isLoading={isSlotsLoading}
              isMutating={isHolding || isDeletingHold}
              bookingDone={bookingDone}
              onSelectSlot={handleSelectSlot}
            />
          </div>

          <BookingCartPanel
            fieldName={field.name}
            dateLabel={dateLabel}
            holds={holds}
            bookingDone={bookingDone}
            isHolding={isHolding}
            isConfirming={isConfirming}
            bookingType={bookingType}
            services={activeServices}
            cartItems={cartItems} 
            totalPrice={totalPrice}
            deposit={deposit}
            total={total}
            onRemoveHold={(holdId) => {
              const hold = holds.find((h) => h.holdId === holdId);
              if (hold) handleSelectSlot(hold);
            }}
            onAddService={addService}
            onChangeQuantity={changeQuantity}
            onRemoveService={removeService}
            onConfirm={handleConfirm}
            onViewHistory={() => navigate("/user/history")}
          />
        </div>

        <FieldReviewSection fieldId={numericFieldId} fieldName={field.name} />
      </div>
    </div>
  );
}