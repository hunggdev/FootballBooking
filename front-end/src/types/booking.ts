import type { Socket } from "socket.io-client";
import type { User } from "./user";
import type { Field } from "./field";

export interface Bookings {
  bookingId: number;
  bookingDate: string;
  status: "COMPLETED" | "CONFIRMED" | "CANCELLED" ;
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
  createdAt: string | null;
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
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
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
  user: User;
  field: Field;
  review?: {
    reviewId: number;
    rating: number;
    comment?: string | null;
    reply?: string | null;
    createdAt?: string;
  } | null;
}

export interface PaymentData {
  bin: string | number;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
}

export interface PaymentSuccessPayload {
  bookingId: string | number;
  amountPaid?: number;
  paidAt?: string | Date;
  [key: string]: unknown;
}

export interface PaymentModalProps {
  socket: Socket;
  paymentData: PaymentData | null;
  bookingId: string | number;
  onClose: () => void;
  // onSuccess?: (data: PaymentSuccessPayload) => void;
}

export interface StatusRange {
  bookingDate: string;
  slotId: number;
  status: "AVAILABLE" | "BOOKED" | "HOLD" | "CLOSED";
  isMyHold: boolean;
  expiresAt?: Date;
  ttl?: number;
}

export const statusBadge: Record<string, string> = {
  CONFIRMED:
    "border-status-success/20 bg-status-success-bg text-status-success",
  COMPLETED: "border-status-info/20 bg-status-info-bg text-status-info",
  HOLD: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

export const statusLabel: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn thành",
  HOLD: "Đang giữ chỗ",
  PENDING: "Chờ xử lý",
  CANCELLED: "Đã hủy",
};