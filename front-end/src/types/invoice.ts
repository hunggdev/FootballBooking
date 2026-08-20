import type { Booking, BookingSlot } from "./booking";
import type { Service } from "./service";
import type { User } from "./user";
import type { Field } from "./field"; 

export interface Invoice{
  invoiceId: number;
  bookingId: number;
  userId: number;
  deposit: number;
  fieldAmount: number;
  serviceAmount: number;
  totalAmount: number;
  remainAmount: number;
  status: "PENDING" | "PAID" | "DEPOSITED" | "CANCELLED";
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
}


// Khớp với model `Invoice` ở back-end (invoiceController.js / schema.prisma)
export interface Invoices {
  invoice: Invoice;
  user: User;
  bookingId: number;
  bookingSlots: BookingSlot[];
  bookingServices: Service[]; 
  field: Field;
}



