import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  currentPage: number;
  pageSize: number;
}

const statusLabel: Record<Customer["status"], string> = {
  ACTIVE: "Đã kích hoạt",
  MAINTENANCE: "Đang bảo trì",
  INACTIVE: "Chưa kích hoạt",
  BANNED: "Đã khóa",
};

const statusClass: Record<Customer["status"], string> = {
  ACTIVE:
    "border-status-success/30 bg-status-success-bg text-status-success",

  MAINTENANCE:
    "border-status-warning/30 bg-status-warning-bg text-status-warning",

  INACTIVE:
    "border-border bg-elevated text-text-muted",

  BANNED:
    "border-status-danger/30 bg-status-danger-bg text-status-danger",
};

function formatDate(iso?: string) {
  if (!iso) return "--";

  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomersTable({
  customers,
  onView,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentCustomers = customers.slice(
    startIndex,
    endIndex
  );

  return (
    <div
      className="
        mt-5
        rounded-xl
        bg-[#2d3a4f]
        p-px
        transition-all
        duration-300
        hover:bg-[image:var(--token-gradient-brand)]
      "
    >
      <Card className="overflow-hidden border-border bg-surface">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow className="border-border bg-elevated hover:bg-elevated">
                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    STT
                  </TableHead>

                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    Khách hàng
                  </TableHead>

                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    Số điện thoại
                  </TableHead>

                  <TableHead className="h-11 px-4 text-center text-xs font-semibold text-text-secondary">
                    Số lần đặt sân
                  </TableHead>

                  <TableHead className="h-11 px-4 text-right text-xs font-semibold text-text-secondary">
                    Tổng chi tiêu
                  </TableHead>

                  <TableHead className="h-11 px-4 text-xs font-semibold text-text-secondary">
                    Ngày tham gia
                  </TableHead>

                  <TableHead className="h-11 px-4 text-center text-xs font-semibold text-text-secondary">
                    Trạng thái HĐ
                  </TableHead>

                  <TableHead className="h-11 px-4 text-center text-xs font-semibold text-text-secondary">
                    Trạng thái TK
                  </TableHead>

                  <TableHead className="h-11 px-4 text-right text-xs font-semibold text-text-secondary">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, index) => {
                    const status =
                      customer.status.toUpperCase() as Customer["status"];

                    return (
                      <TableRow
                        key={customer.userId}
                        className="border-border transition-colors duration-150 hover:bg-surface-hover"
                      >
                        {/* No. */}
                        <TableCell className="text-center  px-4 py-3 text-sm text-text-muted">
                          {startIndex + index + 1}
                        </TableCell>

                        {/* Customer */}
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0 border border-brand-primary/30 bg-brand-primary/10">
                              <AvatarFallback className="bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                                {customer.fullName
                                  ?.charAt(0)
                                  ?.toUpperCase() ?? "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {customer.fullName}
                              </p>

                              <p className="truncate text-xs text-text-muted">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="px-4 py-3 text-sm text-text-secondary">
                          {customer.phone ?? "Chưa cập nhật"}
                        </TableCell>

                        {/* Booking count */}
                        <TableCell className="px-4 py-3 text-center">
                          <span className="font-semibold text-text-primary">
                            {customer.bookingCount}
                          </span>
                        </TableCell>

                        {/* Total spent */}
                        <TableCell className="px-4 py-3 text-right text-sm font-semibold text-brand-accent">
                          {(customer.totalSpent ?? 0).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </TableCell>

                        {/* Created date */}
                        <TableCell className="px-4 py-3 text-sm text-text-secondary">
                          {formatDate(customer.createdAt)}
                        </TableCell>

                        {/* Online status */}
                        <TableCell className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={
                              customer.isOnline
                                ? "border-status-success/30 bg-status-success-bg text-status-success"
                                : "border-border bg-elevated text-text-muted"
                            }
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${customer.isOnline
                                  ? "bg-status-success"
                                  : "bg-text-muted"
                                }`}
                            />

                            {customer.isOnline
                              ? "Online"
                              : "Offline"}
                          </Badge>
                        </TableCell>

                        {/* Account status */}
                        <TableCell className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={statusClass[status]}
                          >
                            {statusLabel[status]}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                onView(customer)
                              }
                              className="h-8 border border-status-info/20 bg-status-info-bg px-2.5 text-xs font-medium text-status-info shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-info/30 hover:bg-status-info/20"
                            >
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              Xem
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onEdit(customer)
                              }
                              className="border-border bg-elevated text-text-secondary hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent"
                            >
                              <Pencil className="mr-1.5 h-3.5 w-3.5" />
                              Sửa
                            </Button>

                            <Button
                              size="sm"
                              onClick={() =>
                                onDelete(customer)
                              }
                              disabled={
                                customer.status === "INACTIVE"
                              }
                              className="h-8 border border-status-danger/30 bg-status-danger-bg px-2.5 text-xs font-medium text-status-danger shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-danger/40 hover:bg-status-danger/20 disabled:pointer-events-none disabled:border-border disabled:bg-elevated disabled:text-text-muted"
                            >
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center text-sm text-text-muted"
                    >
                      Không có khách hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

