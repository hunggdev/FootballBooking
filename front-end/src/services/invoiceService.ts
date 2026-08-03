import api from "@/lib/api";
import type { Invoice } from "@/types/invoice";

export const invoiceService = {
  // Lấy danh sách hóa đơn (admin)
  getInvoices: async (): Promise<Invoice[]> => {
    const res = await api.get("/invoices");
    return res.data.invoices;
  },

  // Lấy chi tiết hóa đơn
  getInvoice: async (invoiceId: number): Promise<Invoice> => {
    const res = await api.get(`/invoices/${invoiceId}`);
    return res.data.invoice;
  },

  // Xuất hóa đơn cho 1 booking (admin)
  generateInvoice: async (bookingId: number): Promise<Invoice> => {
    const res = await api.post(`/invoices/generate/${bookingId}`);
    return res.data.invoice;
  },
};
