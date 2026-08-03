import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { PageHeader } from "@/layouts/admin/PageHeader";
import { Button } from "@/components/ui/button";

import { InvoiceTable } from "./InvoiceTable";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";
import { GenerateInvoiceDialog } from "./GenerateInvoiceDialog";

import { useInvoices, useGenerateInvoice } from "@/stores/useInvoiceStore";
import type { Invoice } from "@/types/invoice";

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export function ManageInvoice() {
  const { data: invoices = [], isLoading, error } = useInvoices();
  const generateInvoice = useGenerateInvoice();

  const [search, setSearch] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return invoices;
    return invoices.filter(
      (invoice) =>
        invoice.invoiceId.toString().includes(keyword) ||
        invoice.bookingId.toString().includes(keyword) ||
        (invoice.user?.fullName ?? "").toLowerCase().includes(keyword)
    );
  }, [invoices, search]);

  const handleGenerate = (bookingId: number) => {
    setGenerateError(null);
    generateInvoice.mutate(bookingId, {
      onSuccess: () => setGenerateOpen(false),
      onError: (error) =>
        setGenerateError(getErrorMessage(error, "Xuất hóa đơn thất bại.")),
    });
  };

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">Không thể tải danh sách hóa đơn.</div>
    );
  }

  return (
    <>
      <PageHeader title="Quản lý hóa đơn" subtitle="Xem và xuất hóa đơn cho các đơn đặt sân" />

      <div className="flex items-center justify-between mt-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hóa đơn, booking, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <Button
          onClick={() => {
            setGenerateError(null);
            setGenerateOpen(true);
          }}
        >
          Xuất hóa đơn
        </Button>
      </div>

      <InvoiceTable
        invoices={filteredInvoices}
        onView={(invoice) => {
          setSelectedInvoice(invoice);
          setDetailOpen(true);
        }}
      />

      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <GenerateInvoiceDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        onSubmit={handleGenerate}
        isSubmitting={generateInvoice.isPending}
        serverError={generateError}
      />
    </>
  );
}
