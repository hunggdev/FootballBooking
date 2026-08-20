// src/components/admin/customers/CustomerDetailDialog.tsx
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
import { formatDateTime } from "@/lib/utils";

// const statusLabel: Record<Customer["status"], string> = {
//   active: "Đang hoạt động",
//   inactive: "Ngưng hoạt động",
//   banned: "Đã khóa",
// };

const bookingStatusLabel: Record<CustomerBookingHistoryRow["status"], string> =
  {
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy",
    CONFIRMED: "Đã xác nhận",
    PENDING: "Đang chờ xác nhận",
  };

interface CustomerDetailDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomerDetailDialog({
  customerId,
  open,
  onOpenChange,
}: CustomerDetailDialogProps) {
  const { data, isLoading, error } = useCustomer(customerId ?? 0);
  const customer: Customer | undefined = data?.customer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-w-full border">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">Không thể tải thông tin sân.</p>
        )}

        {customer && (
          <div>
            <div className="flex items-center gap-4 border p-4">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback>{customer?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{customer?.fullName}</p>
                <p className="text-xs opacity-60">{customer?.email}</p>
              </div>
              <Badge variant="outline">
                {customer.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 border p-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs opacity-60">Số điện thoại</p>
                <p className="font-medium">
                  {customer.phone ?? "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-60">Ngày tham gia</p>
                <p className="font-medium">{formatDateTime(customer.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs opacity-60">Tổng số lần đặt sân</p>
                <p className="font-medium">{customer.bookings.length}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-sm font-semibold">
                Lịch sử đặt sân gần đây
              </p>
              <div className="border max-h-40 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đặt sân</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="max-h-96 overflow-y-auto">
                    {customer.bookings?.map((booking) => (
                      <TableRow key={booking.bookingId}>
                        <TableCell>{booking.bookingId}</TableCell>
                        <TableCell>{formatDateTime(booking.createdAt)}</TableCell>
                        <TableCell>
                          {booking.totalPrice.toLocaleString("vi-VN")}đ
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {bookingStatusLabel[booking.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" className="border">
                Chỉnh sửa thông tin
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
