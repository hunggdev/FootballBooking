export interface Booking {
  bookingId: number;

  bookingDate: string;

  status: "HOLD" | "CONFIRMED" | "CANCELLED";

  createdAt: string;

  updatedAt: string;

  user: {
    userId: number;
    fullName: string;
    email: string;
  };

  fieldSlot: {
    slotId: number;

    starttime: string;

    endtime: string;

    field: {
      fieldId: number;
      name: string;
      fieldType?: "FIVE" | "SEVEN";
    };
  };

  review?: {
    reviewId: number;
    rating: number;
    comment?: string | null;
    reply?: string | null;
    createdAt: string;
  } | null;
}

// Payload khi tạo mới booking
export interface CreateBookingPayload {
  userId: number;
  fieldId: number;
  starttime: string;   
  endtime: string;     
}

// ---- Luồng đặt sân thực tế (khớp back-end bookingController.js) ----

// Giữ chỗ tạm thời (POST /bookings/hold)
export interface HoldSlotPayload {
  slotId: number;
  bookingDate: string; // YYYY-MM-DD
}

export interface SlotHold {
  holdId: number;
  slotId: number;
  userId: number;
  bookingDate: string;
  expiresAt: string;
}

// Xác nhận đặt sân sau khi đã giữ chỗ (POST /bookings)
export interface ConfirmBookingPayload {
  slotId: number;
  bookingDate: string; // YYYY-MM-DD
  type?: "ONE_TIME" | "LONG_TERM";
  depositAmount?: number;
  note?: string;
  services?: Array<{ serviceId: number; quantity: number }>;
}

// Payload khi cập nhật booking
export interface UpdateBookingPayload {
  fieldId?: number;
  starttime?: string;
  endtime?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}
