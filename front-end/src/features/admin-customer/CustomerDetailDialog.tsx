import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CustomerBookingHistoryRow } from "@/features/admin-customer/types";
import type { Customer } from "@/types/customer";
import { useCustomer } from "@/stores/useCustomerStore";

const bookingStatusLabel: Record<CustomerBookingHistoryRow["status"], string> =
{
  booked: "Đã đặt",
  held: "Giữ chỗ",
  "pending-confirm": "Chờ xác nhận",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

const bookingStatusClassName: Record<
  CustomerBookingHistoryRow["status"],
  string
> = {
  booked: "border-status-info/40 bg-status-info-bg text-status-info",
  held: "border-status-warning/40 bg-status-warning-bg text-status-warning",
  "pending-confirm":
    "border-status-warning/40 bg-status-warning-bg text-status-warning",
  paid: "border-status-success/40 bg-status-success-bg text-status-success",
  cancelled: "border-status-danger/40 bg-status-danger-bg text-status-danger",
};

const mockHistory: CustomerBookingHistoryRow[] = [
  {
    id: "#DS1267",
    fieldName: "Sân A",
    dateTime: "14/07/2026 - 20:00",
    amount: 200000,
    status: "paid",
  },
  {
    id: "#DS1240",
    fieldName: "Sân B",
    dateTime: "02/07/2026 - 19:00",
    amount: 180000,
    status: "paid",
  },
  {
    id: "#DS1198",
    fieldName: "Sân A",
    dateTime: "20/06/2026 - 18:00",
    amount: 200000,
    status: "cancelled",
  },
  {
    id: "#DS1199",
    fieldName: "Sân A",
    dateTime: "20/06/2026 - 18:00",
    amount: 200000,
    status: "cancelled",
  },
  {
    id: "#DS1197",
    fieldName: "Sân B",
    dateTime: "18/06/2026 - 19:00",
    amount: 180000,
    status: "cancelled",
  },
];

interface CustomerDetailDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomerDetailDialogExtendedProps extends CustomerDetailDialogProps {
  onEdit?: (customer: Customer) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "--";

  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomerDetailDialog({
  customerId,
  open,
  onOpenChange,
  onEdit,
}: CustomerDetailDialogExtendedProps) {
  const { data, isLoading, error } = useCustomer(customerId ?? 0);

  const customer: Customer | undefined = data?.customer;

  const avatarLetter =
    customer?.fullName?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[90vh]
          min-w-4xl
          max-w-6xl
          overflow-y-auto
          border-border
          bg-surface
          text-text-primary
          shadow-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-brand-primary">
            Thông tin khách hàng
          </DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-lg border border-border bg-elevated p-6 text-center">
            <p className="text-sm text-text-muted">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-status-danger/30 bg-status-danger-bg p-4">
            <p className="text-sm text-status-danger">
              Không thể tải thông tin khách hàng.
            </p>
          </div>
        )}

        {/* Customer information */}
        {customer && (
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-border
                bg-elevated
                p-4
              "
            >
              <Avatar
                className="
                  h-14
                  w-14
                  border-2
                  border-brand-primary/40
                  bg-brand-primary/10
                "
              >
                <AvatarFallback
                  className="
                    bg-brand-primary/10
                    text-lg
                    font-semibold
                    text-brand-primary
                  "
                >
                  {avatarLetter}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-text-primary">
                  {customer.fullName}
                </p>

                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  {customer.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      customer.isOnline
                        ? "border-status-success/40 bg-status-success-bg text-status-success"
                        : "border-border bg-surface text-text-muted"
                    }
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${customer.isOnline
                        ? "bg-status-success"
                        : "bg-text-muted"
                        }`}
                    />
                    {customer.isOnline ? "Online" : "Offline"}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="
                      border-brand-primary/30
                      bg-brand-primary/10
                      text-brand-primary
                    "
                  >
                    Khách hàng
                  </Badge>
                </div>
              </div>
            </div>

            {/* Customer stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-elevated
                  p-4
                "
              >
                <p className="text-xs text-text-muted">Số điện thoại</p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {customer.phone ?? "Chưa cập nhật"}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-elevated
                  p-4
                "
              >
                <p className="text-xs text-text-muted">Ngày tham gia</p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {formatDate(customer.createdAt)}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-elevated
                  p-4
                "
              >
                <p className="text-xs text-text-muted">Tổng số lần đặt sân</p>

                <p className="mt-1 text-lg font-semibold text-brand-primary">
                  {customer.bookingCount ?? 0}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-elevated
                  p-4
                "
              >
                <p className="text-xs text-text-muted">Tổng chi tiêu</p>

                <p className="mt-1 text-lg font-semibold text-brand-accent">
                  {(customer.totalSpent ?? 0).toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Booking history */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Lịch sử đặt sân gần đây
                  </p>

                  <p className="mt-0.5 text-xs text-text-muted">
                    Các giao dịch đặt sân của khách hàng
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="
                    border-border
                    bg-elevated
                    text-text-secondary
                  "
                >
                  {mockHistory.length} giao dịch
                </Badge>
              </div>

              <div
                className="
                  max-h-64
                  overflow-auto
                  rounded-xl
                  border
                  border-border
                  bg-elevated
                "
              >
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-text-secondary">
                        Mã đặt sân
                      </TableHead>

                      <TableHead className="text-text-secondary">Sân</TableHead>

                      <TableHead className="text-text-secondary">
                        Thời gian
                      </TableHead>

                      <TableHead className="text-text-secondary">
                        Số tiền
                      </TableHead>

                      <TableHead className="text-text-secondary">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {mockHistory.map((row, index) => (
                      <TableRow
                        key={`${row.id}-${index}`}
                        className="
                          border-border
                          hover:bg-surface-hover
                        "
                      >
                        <TableCell className="font-medium text-text-primary">
                          {row.id}
                        </TableCell>

                        <TableCell className="text-text-secondary">
                          {row.fieldName}
                        </TableCell>

                        <TableCell className="text-text-secondary">
                          {row.dateTime}
                        </TableCell>

                        <TableCell className="font-medium text-text-primary">
                          {row.amount.toLocaleString("vi-VN")}đ
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={bookingStatusClassName[row.status]}
                          >
                            {bookingStatusLabel[row.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                className="
                    border-border
                    bg-transparent
                    text-text-secondary
                    transition-all
                    duration-200
                    hover:border-brand-accent/40
                    hover:bg-brand-accent/10
                    hover:text-brand-accent
                "
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>

              {onEdit && (
                <Button
                  className="
                    border-transparent
                    bg-brand-accent
                    font-semibold
                    text-accent-foreground
                    hover:bg-brand-accent-hover
                  "
                  onClick={() => onEdit(customer)}
                >
                  Chỉnh sửa thông tin
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
