import api from "@/lib/api";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  HoldSlotPayload,
  SlotHold,
  ConfirmBookingPayload,
  StatusRange,
} from "@/types/booking";

export const bookingService = {
  // Lấy danh sách booking (Admin)
  getBookings: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings");
    return res.data.bookings ?? [];
  },

  getMyHolds: async () => {
    const res = await api.get("/bookings/myHolds");
    return res.data.holds ?? [];
  },

  // Lấy chi tiết booking
  getBooking: async (bookingId: number): Promise<Booking> => {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data.booking;
  },

  // Tạo booking mới
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const res = await api.post("/bookings", payload);
    return res.data.booking;
  },

  // Giữ slot tạm thời (10 phút) — khớp payload/response thật của back-end
  holdFieldSlot: async (payload: HoldSlotPayload): Promise<SlotHold> => {
    const res = await api.post("/bookings/hold", payload);
    return res.data.hold;
  },

  deleteSlotHold: async (payload: HoldSlotPayload): Promise<number> => {
    const res = await api.delete("/bookings/hold", { data: payload });
    return res.data.slotId;
  },

  // Xác nhận đặt sân sau khi đã giữ chỗ thành công
  confirmBooking: async (payload: ConfirmBookingPayload): Promise<Booking> => {
    const res = await api.post("/bookings", payload);
    return res.data.booking;
  },

  // @deprecated giữ lại cho tương thích ngược, dùng holdFieldSlot thay thế
  holdSlot: async (fieldId: number, date: string, slotId: number) => {
    const res = await api.post("/bookings/hold", { fieldId, bookingDate: date, slotId });
    return res.data.hold;
  },

  // Tìm slot theo ngày
  getSlots: async (fieldId: number, date: string) => {
    const res = await api.get("/bookings/slots", { params: { fieldId, date } });
    return res.data.slots ?? [];
  },

  // Lịch sử booking của user
  getMyBookings: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings/history/me");
    return res.data.bookings ?? [];
  },

  // Hủy booking
  cancelBooking: async (bookingId: number): Promise<Booking> => {
    const res = await api.put(`/bookings/${bookingId}/cancel`);
    return res.data.booking;
  },

  // Cập nhật booking (nếu có use-case đổi slot/trạng thái)
  updateBooking: async (
    bookingId: number,
    payload: UpdateBookingPayload
  ): Promise<Booking> => {
    const res = await api.put(`/bookings/${bookingId}`, payload);
    return res.data.booking;
  },

  getStatusRange: async (fieldId: number, slotId: number, startDate: string, endDate: string) => {
    const res = await api.get("/bookings/statusRange", { params: { fieldId, slotId, startDate, endDate } });
    return res.data.slots ?? [];
  },
};
