import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { HoldSlot } from "@/types/field";
import type {
  CreateBookingPayload,
  UpdateBookingPayload,
  HoldSlotPayload,
  ConfirmBookingPayload,
} from "@/types/booking";

// Lấy danh sách booking (Admin)
export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const data = await bookingService.getBookings();
      return data ?? []; 
    },
  });
};

export const useStatusRange = (field: number, slot: number, star: string, end: string) => {
  return useQuery({
    queryKey: ["statusRange", field, slot],
    queryFn: async () => {
      const data = await bookingService.getStatusRange(field, slot, star, end);
      return data ?? []; 
    },
    enabled: false, 
  });
};

// Lấy chi tiết booking
export const useBooking = (bookingId: number) => {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
  });
};

// Lấy lịch sử booking của user
export const useMyBookings = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const data = await bookingService.getMyBookings();
      return data ?? []; // ✅ luôn là array
    },
    enabled: Boolean(user),
  });
};

export const useSlots = (fieldId: number, date: string) => {
  return useQuery({
    queryKey: ["slots", fieldId, date.split("T")[0]],
    queryFn: () => bookingService.getSlots(fieldId, date),
    enabled: !!fieldId && !!date,
    staleTime: 0,
  });
};

export const useMyHolds = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery<HoldSlot[]>({
    queryKey: ["my-holds"],
    queryFn: async () => {
      const data = await bookingService.getMyHolds();
      return data ?? []; 
    },
    enabled: Boolean(user),
  });
};

// Giữ chỗ tạm thời (10 phút) trước khi xác nhận đặt sân
export const useHoldSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HoldSlotPayload) => bookingService.holdFieldSlot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

// Hủy giữ chỗ
export const useDeleteSlotHold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HoldSlotPayload) =>
      bookingService.deleteSlotHold(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["fields"] }); 
    },
  });
};

// Xác nhận đặt sân sau khi đã giữ chỗ
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfirmBookingPayload) => bookingService.confirmBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};

// Tạo booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};

// Cập nhật booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: number; payload: UpdateBookingPayload }) =>
      bookingService.updateBooking(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};

// Hủy booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, cancelReason }: { bookingId: number; cancelReason?: string }) =>
      bookingService.cancelBooking(bookingId, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};
