// Khớp với model `Invoice` ở back-end (invoiceController.js / schema.prisma)
export interface Invoice {
  invoiceId: number;
  bookingId: number;
  userId: number;
  deposit: number;
  fieldAmount: number;
  serviceAmount: number;
  totalAmount: number;
  remainAmount: number;
  status: "PENDING" | "PAID";
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
  user?: {
    userId: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  booking?: {
    bookingId: number;
    bookingDate: string;
    status: string;
  };
}
