// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
// import dayjs from "dayjs";
// import { toast } from "sonner";
// import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, X, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useField, useFieldSlotsByDate } from "@/stores/useFieldStore";
// import { useServices } from "@/stores/useServiceStore";
// import { useConfirmBooking, useHoldSlot, useDeleteSlotHold, useSlots, useMyHolds } from "@/stores/useBookingStore";

// import { FIELD_TYPE_LABEL } from "@/types/field";
// import type { FieldSlot, HoldSlot } from "@/types/field";
// import type { Service } from "@/types/service";
// import { FieldReviewSection } from "@/features/user-review/FieldReviewSection";
// import { cn, formatTimeRange } from "@/lib/utils";
// import  { useBookingSocket } from "@/sockets/useBookingSocket"; 
// import { useAuthStore } from "@/stores/useAuthStore";


// const WEEKDAY_LABEL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
// type BookingType = "ONE_TIME" | "LONG_TERM";

// function formatCurrency(value: number) {
//   return `${Math.round(value).toLocaleString("vi-VN")}đ`;
// }

// function formatCountdown(totalSeconds: number) {
//   const sec = Math.max(0, totalSeconds);
//   const minutes = Math.floor(sec / 60);
//   const remainingSeconds = sec % 60;
//   if (minutes > 0) {
//     return `${minutes} phút ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds} giây`;
//   }
//   return `${remainingSeconds} giây`;
// }

// export default function FieldDetailPage() {
//   const queryClient = useQueryClient();

//   useAuthStore((state) => state.fetchMe);
//   const user = useAuthStore((state) => state.user);

//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { fieldId } = useParams<{ fieldId: string }>(); 
//   const urlDate = searchParams.get("date");
//   const numericFieldId = Number(fieldId);


//   const [bookingType, setBookingType] = useState<BookingType>("ONE_TIME"); // kiểu đặt sân
//   const [selectedDate, setSelectedDate] = useState(() => urlDate?.split("T")[0] || dayjs().format("YYYY-MM-DD")); // ngày đang xem
//   const [holds, setHolds] = useState<HoldSlot[]>([]); // danh sách hold
//   const [selectedSlots, setSelectedSlots] = useState<HoldSlot[]>([]); // danh sách slot được chọn
//   const [cart, setCart] = useState<Record<number, number>>({}); // 
//   const [bookingDone, setBookingDone] = useState(false); // trạng thái đã đặt xong
//   const [hasAutoSelectedUrlSlot, setHasAutoSelectedUrlSlot] = useState(false); // đã tự động chọn slot từ url


//   const { data: field, isLoading: isFieldLoading } = useField(numericFieldId); // thông tin sân
//   const {
//     data: slots,
//     isLoading: isSlotsLoading,
//     refetch: refetchSlots, 
//   } = useSlots(numericFieldId, selectedDate);

//   const {
//     data: mySlots,
//     isLoading: isMyHoldSlotsLoading,
//     refetch: refetchMyHoldSlots, 
//   } = useMyHolds();
//   const { data: services } = useServices();

  

//   const holdSlotMutation = useHoldSlot();
//   const deleteSlotHoldMutation = useDeleteSlotHold();
//   const confirmBookingMutation = useConfirmBooking();
//   const isHolding = holdSlotMutation.isPending;
//   const isDeletingHold = deleteSlotHoldMutation.isPending;
//   const isConfirming = confirmBookingMutation.isPending;

//   const activeServices = useMemo(
//     () => (services ?? []).filter((s) => s.status === "ACTIVE"),
//     [services]
//   );

//   const addSelectedSlot = (slot: HoldSlot) => {
//     setSelectedSlots((prev) => [...prev, slot]);
//   }

//   const deleteSelectedSlot = (slotId: number) => {
//     setSelectedSlots((prev) => prev.filter((s) => s.slotId !== slotId));
//   }

//   // cập nhật hold và selected slots
//   useEffect(() => {
//     if (!mySlots) return;
//     const myHoldSlots = mySlots.filter((slot) => slot.isMyHold);
//     setHolds(myHoldSlots);
//   }, [mySlots]);

//   const cartSlots = useMemo(() => {
//     const map = new Map<number, HoldSlot>();
//     holds.forEach((hold) => map.set(hold.slotId, hold));
//     selectedSlots.forEach((slot) => {
//       if (!map.has(slot.slotId)) {
//         map.set(slot.slotId, slot);
//       }
//   }, [slots, selectedSlots]); 

//     return Array.from(map.values());
//   }, [holds, selectedSlots]);

//   // cập nhật thời gian hold
//   useEffect(() => { 
//     const interval = setInterval(() => {
//       const now = Date.now();

//       setHolds((prev) =>
//         prev.map((hold) => ({
//           ...hold,
//           ttl: Math.max(
//             0,
//             Math.floor(
//               (new Date(hold.expiresAt).getTime() - now) / 1000
//             )
//           ),
//         }))
//       );
//     }, 1000);
//     return () => clearInterval(interval); 
//   }, []);

//   // func reset selection
//   const resetSelection = () => {
//     setCart({});
//   };
  
//   // func thay đổi ngày, cập nhật url
//   const changeDate = (newDate: string) => {
//     setSelectedDate(newDate);
//     resetSelection();
//     setBookingDone(false);
//     setSearchParams({
//       date: newDate,
//     });
//   };

//   // socket
//   useBookingSocket(user?.userId, numericFieldId, selectedDate);  

//   // xóa hold hết hạn
//   useEffect(() => {
//     const now = Date.now();
//     const expired = holds.filter(
//       (hold) => ((new Date(hold.expiresAt).getTime() - now) / 1000) === 0
//     );
//     if(expired.length === 0) return;  

//     const removeExpiredHold = async()=>{
//       try {
//         await Promise.all(
//           expired.map((hold)=>{
//             deleteSlotHoldMutation.mutateAsync({
//               fieldId: numericFieldId,
//               slotId: hold.slotId,
//               bookingDate: hold.bookingDate,
//             })
//           })
//         );
//         expired.forEach((hold) => {deleteSelectedSlot(hold.slotId)}); 
//         toast.error(
//           `${expired.length} khung giờ đã hết thời gian giữ chỗ`
//         );
//         refetchSlots();
//       } catch(error){
//         console.error(error);
//       }
//     };
//     removeExpiredHold();

//     },[holds]);

//   // func chọn slot, xóa slot (Optimistic UI - 0ms phản hồi)
//   const handleSelectSlot = async (slot: HoldSlot) => { 
//     const formattedDate = selectedDate.split("T")[0];
//     const isMine = Boolean(slot.isMyHold) || holds.some((s) => s.slotId === slot.slotId && s.bookingDate === formattedDate);
//     const canSelect = slot.status === "AVAILABLE" || isMine;
//     if (!canSelect || bookingDone) return;

//     if (isMine) {
//       // 1. Phản hồi UI tức thì (0ms)
//       deleteSelectedSlot(slot.slotId);
//       setHolds((prev) => prev.filter((s) => s.slotId !== slot.slotId));

//       // 2. Cập nhật cache TanStack Query tức thì (0ms)
//       queryClient.setQueryData<HoldSlot[]>(
//         ["slots", numericFieldId, formattedDate],
//         (old) => {
//           if (!old) return old;
//           return old.map((s) =>
//             s.slotId === slot.slotId ? { ...s, isMyHold: false, status: "AVAILABLE" } : s
//           );
//         }
//       );

//       try {
//         await deleteSlotHoldMutation.mutateAsync({
//           fieldId: numericFieldId,
//           slotId: slot.slotId,
//           bookingDate: slot.bookingDate || formattedDate,
//         });
//         toast.success("Đã hủy giữ chỗ thành công.");
//       } catch (error: unknown) {
//         queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, formattedDate] });
//         queryClient.invalidateQueries({ queryKey: ["my-holds"] });
//         const message = error instanceof Error ? error.message : "Hủy giữ chỗ thất bại.";
//         toast.error(message);
//       }
//       return;
//     }

//     // --- GIỮ CHỖ TẠM THỜI (OPTIMISTIC) ---
//     const newHold: HoldSlot = {
//       ...slot,
//       isMyHold: true,
//       status: "HOLD",
//       bookingDate: formattedDate,
//       expiresAt: new Date(Date.now() + 600000).toISOString(),
//       ttl: 600,
//     };

//     // 1. Phản hồi UI tức thì (0ms)
//     addSelectedSlot(newHold);
//     setHolds((prev) => [...prev, newHold]);

//     // 2. Cập nhật cache TanStack Query tức thì (0ms)
//     queryClient.setQueryData<HoldSlot[]>(
//       ["slots", numericFieldId, formattedDate],
//       (old) => {
//         if (!old) return old;
//         return old.map((s) =>
//           s.slotId === slot.slotId
//             ? { ...s, isMyHold: true, status: "HOLD", expiresAt: newHold.expiresAt, ttl: 600 }
//             : s
//         );
//       }
//     );

//     try {
//       await holdSlotMutation.mutateAsync({
//         fieldId: numericFieldId,
//         slotId: slot.slotId,
//         bookingDate: formattedDate,
//       });
//     } catch (error: unknown) {
//       deleteSelectedSlot(slot.slotId);
//       setHolds((prev) => prev.filter((s) => s.slotId !== slot.slotId));
//       queryClient.invalidateQueries({ queryKey: ["slots", numericFieldId, formattedDate] });
//       queryClient.invalidateQueries({ queryKey: ["my-holds"] });
//       const message = error instanceof Error ? error.message : "Khung giờ vừa được người khác giữ.";
//       toast.error(message);
//     }
//   };

//   if (isFieldLoading) {
//     return <p className="p-6 text-center text-sm text-muted-foreground">Đang tải chi tiết sân...</p>;
//   }

//   if (!field) {
//     return <p className="p-6 text-center text-sm text-muted-foreground">Không tìm thấy sân.</p>;
//   }

//   const handleConfirm = async () => {
//     // if (!selectedSlot || !hold) return;

//     // const payloadServices = Object.entries(cart).map(([id, qty]) => ({
//     //   serviceId: Number(id),
//     //   quantity: qty,
//     // }));

//     // try {
//     //   await confirmBookingMutation.mutateAsync({
//     //     slotId: selectedSlot.slotId,
//     //     bookingDate: selectedDate,
//     //     type: bookingType,
//     //     depositAmount: Math.round((Number(selectedSlot.price) * 0.3) / 1000) * 1000,
//     //     services: payloadServices,
//     //   });

//     //   setBookingDone(true);
//     //   setHold(null);
//     //   toast.success("Xác nhận đặt sân thành công!");
//     //   refetchSlots();
//     // } catch (error: unknown) {
//     //   const message = error instanceof Error ? error.message : "Đặt sân thất bại.";
//     //   toast.error(message);
//     //   setHold(null);
//     //   setSelectedSlot(null);
//     //   refetchSlots();
//     // }
//   };

//   const addService = (serviceId: string | null) => {
//     if (!serviceId) return;
//     const id = Number(serviceId);
//     setCart((prev) => ({ ...prev, [id]: prev[id] ? prev[id] + 1 : 1 }));
//   };

//   const changeQuantity = (serviceId: number, delta: number) => {
//     setCart((prev) => {
//       const next = (prev[serviceId] ?? 0) + delta;
//       if (next <= 0) {
//         return Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId));
//       }
//       return { ...prev, [serviceId]: next };
//     });
//   };

//   const removeService = (serviceId: number) => {
//     setCart((prev) =>
//       Object.fromEntries(Object.entries(prev).filter(([id]) => Number(id) !== serviceId))
//     );
//   };

//   const cartItems = Object.entries(cart)
//     .map(([id, quantity]) => ({
//       service: activeServices.find((s) => s.serviceId === Number(id)),
//       quantity,
//     }))
//     .filter((item): item is { service: Service; quantity: number } => !!item.service);

//   const servicesTotal = cartItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
//   const totalPrice = holds.reduce((total, slot) => total + Number(slot.price), 0);
//   const total = totalPrice + servicesTotal;
//   const deposit = selectedSlots.length > 0 ? Math.round((totalPrice * 0.3) / 1000) * 1000 : 0;

//   const dateObj = dayjs(selectedDate);
//   const dateLabel = `${WEEKDAY_LABEL[dateObj.day()]}, ${dateObj.format("DD/MM")}`;

//   return (
//     <div className="dark bg-background text-foreground"> 
//       <div className="mx-auto max-w-6xl space-y-6 p-4">
//         {/* Field header */}
//         <div className="rounded-xl border bg-card p-5">
//           <div className="flex flex-wrap items-start justify-between gap-3">
//             <div>
//               <h1 className="text-2xl font-bold">{field.name}</h1>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 {field.description ?? "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng."}
//               </p>
//             </div>
//             <Badge variant="outline">{FIELD_TYPE_LABEL[field.fieldType]}</Badge>
//           </div>
//         </div>

//         {/* Loại đặt sân */}
//         <div className="flex gap-2 border-b">
//           {(
//             [
//               { value: "ONE_TIME", label: "Đặt 1 lần" },
//               { value: "LONG_TERM", label: "Đặt dài hạn" },
//             ] as const
//           ).map((tab) => (
//             <button
//               key={tab.value}
//               type="button"
//               disabled={bookingDone}
//               onClick={() => setBookingType(tab.value)}
//               className={cn(
//                 "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
//                 bookingType === tab.value
//                   ? "border-primary text-foreground"
//                   : "border-transparent text-muted-foreground hover:text-foreground"
//               )}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {bookingType === "LONG_TERM" && (
//           <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400">
//             Đặt dài hạn: khung giờ bạn chọn bên dưới sẽ được đăng ký giữ cố định theo yêu cầu dài
//             hạn. Nhân viên sân sẽ liên hệ xác nhận lịch định kỳ sau khi bạn hoàn tất đặt sân.
//           </p>
//         )}

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
//           {/* Left: schedule */}
//           <div className="space-y-4 rounded-xl border bg-card p-5">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold color">Sơ đồ khung giờ</h2>
//               {(isSlotsLoading || isHolding || isDeletingHold) && (
//                 <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//               )}
//             </div>

//             {/* Legend */}
//             <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Còn trống
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Đang được giữ
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-full border-2 border-red-500" /> Đã đặt
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> Đóng
//               </span>
//             </div>

//             {/* Date navigation */}
//             <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => changeDate(dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD"))}
//               >
//                 <ChevronLeft className="h-4 w-4" /> Hôm qua
//               </Button>
//               <span className="text-sm font-semibold">{dateLabel}</span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => changeDate(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"))}
//               >
//                 Ngày mai <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Slot grid */}
//             {!isSlotsLoading && (!slots || slots.length === 0) ? (
//               <p className="py-8 text-center text-sm text-muted-foreground">
//                 Chưa có khung giờ cho ngày này.
//               </p>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//                 {(slots ?? []).map((slot) => {
//                   const isMine = Boolean(slot.isMyHold) || holds.some((s) => s.slotId === slot.slotId && s.bookingDate === selectedDate);
//                   const isOtherHoldSlot = slot.status === "HOLD" && !isMine;
//                   const isBooked = slot.status === "BOOKED";
//                   const isMaintenance = slot.status === "MAINTENANCE";

//                   // 2. Quyền chọn & Disable button
//                   // Bạn chỉ được chọn slot TRỐNG hoặc Slot do CHÍNH BẠN đang hold
//                   const canSelect =
//                     (slot.status === "AVAILABLE" || isMine) &&
//                     !isBooked &&
//                     !isMaintenance &&
//                     !isOtherHoldSlot;

//                   const disabled = !canSelect || bookingDone;

//                   let stateLabel = "Còn trống";
//                   if (isMine) {
//                     stateLabel = "Đang giữ (Bạn)";
//                   } else if (isOtherHoldSlot) {
//                     stateLabel = "Đang có người giữ";
//                   } else if (isBooked) {
//                     stateLabel = "Đã đặt";
//                   } else if (isMaintenance) {
//                     stateLabel = "Đóng";
//                   }

//                   return (
//                     <button
//                       key={slot.slotId}
//                       type="button"
//                       disabled={disabled}
//                       onClick={() => handleSelectSlot(slot)}
//                       className={cn(
//                         "flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center transition-all duration-100 active:scale-95",
//                         // Trạng thái 1: Slot trống bình thường
//                         canSelect &&
//                           !isMine &&
//                           "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer text-emerald-500 dark:text-emerald-300",
//                         // Trạng thái 2: Slot đang được BẠN giữ chỗ
//                         isMine &&
//                           "border-emerald-500 bg-emerald-500/15 text-emerald-600 font-bold cursor-pointer ring-1 ring-emerald-500/30 scale-[1.02]",
//                         // Trạng thái 4: Slot bị NGƯỜI KHÁC giữ
//                         isOtherHoldSlot &&
//                           "cursor-not-allowed border-amber-500/40 bg-amber-500/10 text-amber-600 opacity-80",
//                         // Trạng thái 5: Slot ĐÃ BOOK hoặc BẢO TRÌ
//                         isBooked &&
//                           "cursor-not-allowed border-red-500 text-muted-foreground opacity-60 ",
//                         isMaintenance &&
//                           "cursor-not-allowed border-muted text-muted-foreground opacity-60"
//                       )}
//                     >
//                       <span className="text-sm font-medium">
//                         {formatTimeRange(slot.starttime, slot.endtime)}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {formatCurrency(Number(slot.price))}
//                       </span>
//                       <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
//                         {stateLabel}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div> 
//             )}
//           </div>

//           {/* Right: booking summary */}
//           <div className="h-fit space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-4">
//             <div>
//               <p className="text-xs uppercase tracking-wide text-muted-foreground">Vé đặt sân</p>
//               <h3 className="text-xl font-bold">{field.name}</h3>
//             </div>

//             {selectedSlots.length === 0 ? (
//               <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
//                 Chọn một khung giờ còn trống ở bên trái để tạm giữ chỗ.
//               </p>
//             ) : bookingDone ? (
//               <div className="space-y-3">
//                 <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
//                   Đặt sân thành công cho {dateLabel} ·{" "}
//                   {formatTimeRange(selectedSlots[0].starttime, selectedSlots[selectedSlots.length - 1].endtime)}.
//                 </p>
//                 <Button className="w-full" onClick={() => navigate("/user/history")}>
//                   Xem lịch sử đặt sân
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 {isHolding && !holds.length && (
//                   <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-400">
//                     <Loader2 className="h-4 w-4 animate-spin" /> Đang giữ chỗ...
//                   </div>
//                 )}
//                 {holds.map((hold) => (    
//                   <div key={hold.slotId} className="flex justify-between items-center"> 
//                     <div>
//                       <p>
//                        Slot {hold.slotId} 
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {hold.bookingDate} · {formatTimeRange(hold.starttime, hold.endtime)}
//                       </p>
//                     </div>
//                     <span className="ml-2">{formatCountdown(hold.ttl)}</span>

//                     <button
//                       type="button"
//                       onClick={() => handleSelectSlot(hold)}
//                       className="ml-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
//                       title="Bỏ chọn slot này"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span className="sr-only">Xóa slot</span>
//                     </button>
//                   </div>
//                 ))}

//                 <dl className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <dt className="text-muted-foreground">Loại đặt sân</dt>
//                     <dd className="font-medium">
//                       {bookingType === "ONE_TIME" ? "Đặt 1 lần" : "Đặt dài hạn"}
//                     </dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-muted-foreground">Giá sân</dt>
//                     <dd className="font-medium">{formatCurrency(totalPrice)}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-muted-foreground">Tiền cọc (30%)</dt>
//                     <dd className="font-medium">{formatCurrency(deposit)}</dd>
//                   </div>
//                 </dl>

//                 {/* Add-on services */}
//                 <div className="space-y-2">
//                   <p className="text-sm font-semibold">Dịch vụ thêm</p>

//                   {activeServices.length > 0 && (
//                     <Select onValueChange={addService}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="+ Chọn dịch vụ muốn thêm" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {activeServices.map((service) => (
//                           <SelectItem key={service.serviceId} value={String(service.serviceId)}>
//                             {service.name} · {formatCurrency(service.price)}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}

//                   {cartItems.map(({ service, quantity }) => (
//                     <div
//                       key={service.serviceId}
//                       className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm"
//                     >
//                       <div>
//                         <p className="font-medium">{service.name}</p>
//                         <p className="text-xs text-muted-foreground">{formatCurrency(service.price)}</p>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Button
//                           variant="outline"
//                           size="icon-sm"
//                           onClick={() => changeQuantity(service.serviceId, -1)}
//                         >
//                           <Minus className="h-3 w-3" />
//                         </Button>
//                         <span className="w-5 text-center">{quantity}</span>
//                         <Button
//                           variant="outline"
//                           size="icon-sm"
//                           onClick={() => changeQuantity(service.serviceId, 1)}
//                         >
//                           <Plus className="h-3 w-3" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon-sm"
//                           onClick={() => removeService(service.serviceId)}
//                         >
//                           <X className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex items-center justify-between border-t pt-3">
//                   <span className="text-sm font-semibold">Tổng thanh toán</span>
//                   <span className="text-xl font-bold text-amber-400">{formatCurrency(total)}</span>
//                 </div>

//                 <Button
//                   className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
//                   onClick={handleConfirm}
//                   disabled={!holds.length || isConfirming}
//                 >
//                   {isConfirming ? "Đang xác nhận..." : "Xác nhận đặt sân →"}
//                 </Button>

//                 <p className="text-center text-xs text-muted-foreground">
//                   Vui lòng nhấn xác nhận trong 10 phút tạm giữ chỗ.
//                 </p>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Reviews for this specific field */}
//         <FieldReviewSection fieldId={numericFieldId} fieldName={field.name} />
//       </div>
//     </div>
//   );
// }

import FieldDetail from "@/features/user-field-detail/FieldDetail";

export default function FieldDetailPage() {
  return <FieldDetail/>;
}