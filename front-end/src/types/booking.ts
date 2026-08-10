export interface Bookings {
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

// Payload khi tạo mới booking (legacy - removed, see CreateBookingPayload below)

// ---- Luồng đặt sân thực tế (khớp back-end bookingController.js) ----

// Giữ chỗ tạm thời (POST /bookings/hold)
export interface HoldSlotPayload {
  fieldId: number;
  slotId: number;
  bookingDate: string; // YYYY-MM-DD
}

export interface SlotHold {
  holdId: number;
  slotId: number;
  userId: number;
  bookingDate: string;
  expiresAt: string;
  ttl?: number;
}

export interface MyHold {
  holdId: string;
  fieldId: number;
  fieldName: string;
  fieldType: "FIVE" | "SEVEN";
  fieldImage: string;
  bookingDate: string;
  slotId: number;
  starttime: string;
  endtime: string;
  price: number;
  status: "HOLD";
  isMyHold: true;
  expiresAt: string;
  ttl: number;
}


export interface CreateBookingSlotPayload {
  fieldId: number;
  slotId: number;
  bookingDate: string; // YYYY-MM-DD
}

export interface CreateBookingPayload {
  slots: CreateBookingSlotPayload[];
  type?: "ONE_TIME" | "LONG_TERM";
  depositAmount?: number;
  note?: string;
  services?: Array<{ serviceId: number; quantity: number }>;
}

// Xác nhận đặt sân sau khi đã giữ chỗ (POST /bookings)
export interface ConfirmBookingSlotPayload {
  fieldId: number;
  slotId: number;
  bookingDate: string; // YYYY-MM-DD
}

export interface ConfirmBookingPayload {
  slots: ConfirmBookingSlotPayload[];
  type?: "ONE_TIME" | "LONG_TERM";
  depositAmount?: number;
  note?: string;
  services?: Array<{ serviceId: number; quantity: number }>;
}

export interface BookingSlotResult {
  bookingSlotId: number;
  bookingId: number;
  slotId: number;
  bookingDate: string;
  price: number;
  fieldSlot: {
    slotId: number;
    starttime: string;
    endtime: string;
    field: {
      fieldId: number;
      name: string;
      fieldType: string;
      image: string | null;
    };
  };
}

// export interface BookingResult {
//   bookingId: number;
//   userId: number;
//   status: "HOLD" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
//   type: "ONE_TIME" | "LONG_TERM";
//   depositAmount: number;
//   totalPrice: number;
//   paidAmount: number;
//   note: string | null;
//   createdAt: string;
//   bookingSlots: BookingSlotResult[];
//   invoice: InvoiceResult | null;
//   bookingServices: Array<{
//     bookingServiceId: number;
//     serviceId: number;
//     quantity: number;
//     price: number;
//     service: { serviceId: number; name: string };
//   }>;
// }

// Payload khi cập nhật booking
export interface UpdateBookingPayload {
  fieldId?: number;
  starttime?: string;
  endtime?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface BookingSlot {
  bookingSlotId: number;
  bookingId: number;
  slotId: number;
  bookingDate: string;
  price: number;
  fieldSlot: {
    slotId: number;
    starttime: string;
    endtime: string;
    field: {
      fieldId: number;
      name: string;
      fieldType: string;
      image: string | null;
    };
  };
}

export interface Invoice {
  invoiceId: number;
  userId: number;
  fieldAmount: number;
  serviceAmount: number;
  totalAmount: number;
  deposit: number;
  remainAmount: number;
  status: "PENDING" | "PAID";
  paymentMethod: string;
  paidAt: string | null;
}

export interface BookingServiceItem {
  bookingServiceId: number;
  serviceId: number;
  quantity: number;
  price: number;
  service: {
    serviceId: number;
    name: string;
  };
}

export interface Booking {
  bookingId: number;
  userId: number;
  status: "HOLD" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  type: "ONE_TIME" | "LONG_TERM";
  depositAmount: number;
  totalPrice: number;
  paidAmount: number;
  note: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string | null;
  invoiceId: number | null;
  bookingSlots: BookingSlot[];
  invoice: Invoice | null;
  bookingServices: BookingServiceItem[];
}