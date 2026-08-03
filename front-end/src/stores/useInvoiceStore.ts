import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoiceService.getInvoices(),
  });
};

export const useInvoice = (invoiceId: number | null) => {
  return useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: () => invoiceService.getInvoice(invoiceId as number),
    enabled: !!invoiceId,
  });
};

export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => invoiceService.generateInvoice(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
};
