import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import type { Invoice } from "@/types/invoice";
import { formatDateTime } from "@/lib/utils";

interface Props {
  invoice?: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange }: Props) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hóa đơn #{invoice.invoiceId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Khách hàng</Label>
            <p>{invoice.user?.fullName ?? invoice.userId}</p>
          </div>

          <div>
            <Label>Booking</Label>
            <p>#{invoice.bookingId}</p>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền sân</span>
            <span>{invoice.fieldAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền dịch vụ</span>
            <span>{invoice.serviceAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Đã đặt cọc</span>
            <span>{invoice.deposit.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Tổng tiền</span>
            <span>{invoice.totalAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Còn lại phải thu</span>
            <span>{invoice.remainAmount.toLocaleString("vi-VN")} đ</span>
          </div>

          <Separator />

          <div>
            <Label>Trạng thái</Label>
            <p>{invoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}</p>
          </div>

          <div>
            <Label>Ngày tạo</Label>
            <p>{formatDateTime(invoice.createdAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
