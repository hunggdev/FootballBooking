// src/features/admin-invoice/InvoiceTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Receipt, FileText } from "lucide-react";
import type { Invoices } from "@/types/invoice";
import { formatDateTime } from "@/lib/utils";

interface Props {
  invoices: Invoices[];
  onView: (invoice: Invoices) => void;
  currentPage: number;
  pageSize: number;
}

const statusBadge: Record<string, string> = {
  PAID: "border-status-success/20 bg-status-success-bg text-status-success",
  DEPOSITED: "border-status-info/20 bg-status-info-bg text-status-info",
  PENDING: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const statusLabel: Record<string, string> = {
  PAID: "Đã thanh toán",
  DEPOSITED: "Đã đặt cọc",
  PENDING: "Chờ thanh toán",
  CANCELLED: "Đã hủy",
};

export function InvoiceTable({
  invoices,
  onView,
  currentPage,
  pageSize,
}: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="mt-5 rounded-xl bg-[#2d3a4f] p-px transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
      <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <Table>
            {/* ================= HEADER ================= */}
            <TableHeader>
              <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                <TableHead className="w-[8%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Mã HĐ
                </TableHead>

                <TableHead className="w-[20%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Khách hàng
                </TableHead>

                <TableHead className="w-[13%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Tổng tiền
                </TableHead>

                <TableHead className="w-[12%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Đã cọc
                </TableHead>

                <TableHead className="w-[12%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Còn lại
                </TableHead>

                <TableHead className="w-[12%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Trạng thái
                </TableHead>

                <TableHead className="w-[15%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Ngày tạo
                </TableHead>

                <TableHead className="w-[10%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {currentInvoices.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell
                    colSpan={9}
                    className="py-14 text-center text-sm text-text-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt className="h-8 w-8 text-text-muted/40" />
                      <span>Chưa có hóa đơn nào.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentInvoices.map((i) => {
                  const upperStatus = (i.invoice?.status || "").toUpperCase();

                  return (
                    <TableRow
                      key={i.invoice.invoiceId}
                      className="group border-border/50 transition-colors duration-200 hover:bg-surface-hover/60"
                    >
                      {/* Mã HĐ */}
                      <TableCell className="text-center font-mono text-xs font-semibold text-text-primary">
                        #{i.invoice.invoiceId}
                      </TableCell>

                      {/* Khách hàng */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
                              {getInitials(i.user?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex flex-col">
                            <span className="truncate text-xs font-semibold text-text-primary transition-colors duration-200 group-hover:text-white">
                              {i.user?.fullName || "Khách vãng lai"}
                            </span>
                            <span className="truncate text-[11px] text-text-muted">
                              {i.user?.email ||
                                i.user?.phone ||
                                "Chưa có liên hệ"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Tổng tiền */}
                      <TableCell className="text-right">
                        <span className="font-semibold text-xs text-brand-accent">
                          {Number(i.invoice.totalAmount || 0).toLocaleString(
                            "vi-VN",
                          )}
                          &nbsp;đ
                        </span>
                      </TableCell>

                      {/* Đã cọc */}
                      <TableCell className="text-right">
                        <span className="text-xs font-medium text-text-secondary">
                          {Number(i.invoice.deposit || 0).toLocaleString(
                            "vi-VN",
                          )}
                          &nbsp;đ
                        </span>
                      </TableCell>

                      {/* Còn lại */}
                      <TableCell className="text-right">
                        <span
                          className={`text-xs font-semibold ${
                            Number(i.invoice.remainAmount || 0) > 0
                              ? "text-status-warning"
                              : "text-status-success"
                          }`}
                        >
                          {Number(i.invoice.remainAmount || 0).toLocaleString(
                            "vi-VN",
                          )}
                          &nbsp;đ
                        </span>
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${
                            statusBadge[upperStatus] ||
                            "border-border bg-elevated text-text-secondary"
                          }`}
                        >
                          {statusLabel[upperStatus] || i.invoice.status}
                        </span>
                      </TableCell>

                      {/* Ngày tạo */}
                      <TableCell>
                        <span className="text-xs text-text-muted">
                          {formatDateTime(i.invoice.createdAt)}
                        </span>
                      </TableCell>

                      {/* Hành động */}
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button
                            size="sm"
                            onClick={() => onView(i)}
                            className="h-8 border border-status-info/20 bg-status-info-bg px-2.5 text-xs font-medium text-status-info shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-info/30 hover:bg-status-info/20 cursor-pointer"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Xem
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
