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

// const statusLabel: Record<Customer["status"], string> = {
//   active: "Đang hoạt động",
//   inactive: "Ngưng hoạt động",
//   banned: "Đã khóa",
// };

const bookingStatusLabel: Record<CustomerBookingHistoryRow["status"], string> = {
  booked: "Đã đặt",
  held: "Giữ chỗ",
  "pending-confirm": "Chờ xác nhận",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

const mockHistory: CustomerBookingHistoryRow[] = [
  { id: "#DS1267", fieldName: "Sân A", dateTime: "14/07/2026 - 20:00", amount: 200000, status: "paid" },
  { id: "#DS1240", fieldName: "Sân B", dateTime: "02/07/2026 - 19:00", amount: 180000, status: "paid" },
  { id: "#DS1198", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
  { id: "#DS1199", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
  { id: "#DS1199", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
  { id: "#DS1199", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
  { id: "#DS1199", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
];

interface CustomerDetailDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomerDetailDialog({ customerId, open, onOpenChange, }: CustomerDetailDialogProps) {
  const {data, isLoading, error} = useCustomer(customerId ?? 0);
  const customer: Customer | undefined = data?.customer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-w-full border">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Không thể tải thông tin sân.
          </p>
        )}

        {customer && (
          <div>
            <div className="flex items-center gap-4 border p-4">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{customer.fullName}</p>
              <p className="text-xs opacity-60">{customer.email}</p>
            </div>
            <Badge variant="outline">{customer.isOnline ? "Online" : "Offline"}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 border p-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs opacity-60">Số điện thoại</p>
              <p className="font-medium">{customer.phone ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Ngày tham gia</p>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Tổng số lần đặt sân</p>
              <p className="font-medium">{customer.bookingCount}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Tổng chi tiêu</p>
              <p className="font-medium">{customer.totalSpent?.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-semibold">Lịch sử đặt sân gần đây</p>
            <div className="border max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đặt sân</TableHead>
                    <TableHead>Sân</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="max-h-96 overflow-y-auto">
                  {mockHistory.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.fieldName}</TableCell>
                      <TableCell>{row.dateTime}</TableCell>
                      <TableCell>{row.amount.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bookingStatusLabel[row.status]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {/* <Button variant="outline" className="border">
              {customer.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </Button> */}
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
