// src/features/admin-invoice/ManageInvoice.tsx
import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { PageHeader } from "@/layouts/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileText, Receipt } from "lucide-react";

import { InvoiceTable } from "./InvoiceTable";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";
import { GenerateInvoiceDialog } from "./GenerateInvoiceDialog";
import { Pagination } from "@/components/common/Pagination";
import { useInvoices, useGenerateInvoice } from "@/stores/useInvoiceStore";
import type { Invoices } from "@/types/invoice";
import { toast } from "sonner";

const PAGE_SIZE = 10;
type StatusFilter = "all" | "PAID" | "DEPOSITED" | "PENDING" | "CANCELLED";

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
  const [status, setStatus] = useState<StatusFilter>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoices | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return invoices.filter((i) => {
      const matchSearch =
        keyword === "" ||
        i.invoice?.invoiceId?.toString().includes(keyword) ||
        i.bookingId?.toString().includes(keyword) ||
        (i.user?.fullName || "").toLowerCase().includes(keyword);

      const upperStatus = (i.invoice?.status || "").toUpperCase();
      const matchStatus = status === "all" || upperStatus === status;

      return matchSearch && matchStatus;
    });
  }, [invoices, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / PAGE_SIZE),
  );

  const handleGenerate = (bookingId: number) => {
    setGenerateError(null);
    generateInvoice.mutate(bookingId, {
      onSuccess: () => {
        setGenerateOpen(false);
        toast.success("Xuất hóa đơn thành công");
      },
      onError: (err) => {
        const msg = getErrorMessage(err, "Xuất hóa đơn thất bại.");
        setGenerateError(msg);
        toast.error(msg);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-text-secondary">
        Đang tải danh sách hóa đơn...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">
        Không thể tải danh sách hóa đơn. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý hóa đơn"
        subtitle="Xem và theo dõi hóa đơn thanh toán cho các đơn đặt sân"
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Tìm theo mã hóa đơn, mã đơn, khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-72 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
            />
          </div>

          {/* Status Select */}
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val as StatusFilter);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-48 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
              <SelectValue>
                {status === "all"
                  ? "Tất cả trạng thái"
                  : status === "PAID"
                    ? "Đã thanh toán"
                    : status === "DEPOSITED"
                      ? "Đã đặt cọc"
                      : status === "PENDING"
                        ? "Chờ thanh toán"
                        : "Đã hủy"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border bg-elevated text-text-primary">
              <SelectItem
                value="all"
                className="text-text-secondary focus:text-text-primary"
              >
                Tất cả trạng thái
              </SelectItem>
              <SelectItem
                value="PAID"
                className="text-text-secondary focus:text-text-primary"
              >
                Đã thanh toán
              </SelectItem>
              <SelectItem
                value="DEPOSITED"
                className="text-text-secondary focus:text-text-primary"
              >
                Đã đặt cọc
              </SelectItem>
              <SelectItem
                value="PENDING"
                className="text-text-secondary focus:text-text-primary"
              >
                Chờ thanh toán
              </SelectItem>
              <SelectItem
                value="CANCELLED"
                className="text-text-secondary focus:text-text-primary"
              >
                Đã hủy
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setGenerateError(null);
            setGenerateOpen(true);
          }}
          className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Xuất hóa đơn
        </Button>
      </div>

      <InvoiceTable
        invoices={filteredInvoices}
        onView={(invoice) => {
          setSelectedInvoice(invoice);
          setDetailOpen(true);
        }}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredInvoices.length}
        pageSize={PAGE_SIZE}
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
