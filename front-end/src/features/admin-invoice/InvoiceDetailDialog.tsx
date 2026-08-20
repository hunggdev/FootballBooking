import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import type { Invoice, Invoices } from "@/types/invoice";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";

interface Props {
  invoice?: Invoices | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange }: Props) {
  if (!invoice) return null;

  const inv = invoice.invoice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hóa đơn #{invoice.invoice.invoiceId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Label>Khách hàng</Label>
            <p>{invoice.user?.fullName ?? invoice.user.userId}</p>
          </div>

          <div className="flex gap-2">
            <Label>Booking</Label>
            <p>#{invoice.bookingId}</p>
          </div>

          

          <Separator />

          <div className="flex gap-2">
            <Label>Sân:</Label>
            <p className="ml-2">
              {/* {invoice.field.name ?? "-"} */}
            </p>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Ngày</th>
                  <th className="border p-2">Khung giờ</th>
                  <th className="border p-2">Giá</th>
                </tr>
              </thead>

              <tbody>
                {invoice.bookingSlots.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Không có booking nào
                    </td>
                  </tr>
                ) : (
                  invoice.bookingSlots.map((slot) => (
                    <tr key={slot.bookingSlotId} className="hover:bg-gray-50">
                      <td className="border p-2">{slot.bookingSlotId}</td>

                      <td className="border p-2">
                        {formatDate(slot.bookingDate)}
                      </td>

                      <td className="border p-2">
                        {formatTime(slot.fieldSlot.starttime)} -{" "}
                        {formatTime(slot.fieldSlot.endtime)}
                      </td>

                      <td className="border p-2">{slot.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền sân</span>
            <span>{inv.fieldAmount.toLocaleString("vi-VN")} đ</span>
          </div>

          {/* dịch vụ  */}
          {invoice.bookingServices?.length > 0 &&      (
          <>
          <div className="flex gap-2">
            <Label>Dịch vụ:</Label>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Tên dịch vụ</th>
                  <th className="border p-2">Số lượng</th>
                  <th className="border p-2">Giá</th>
                </tr>
              </thead>

              <tbody>
                {invoice.bookingServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Không có dịch vụ nào
                    </td>
                  </tr>
                ) : (
                  invoice.bookingServices.map((service) => (
                    <tr key={service.serviceId} className="hover:bg-gray-50">
                      <td className="border p-2">{service.serviceId}</td>

                      <td className="border p-2">{service.service.name}</td>

                      <td className="border p-2">{service.quantity}</td>

                      <td className="border p-2">{service.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </>
          )}

          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền dịch vụ</span>
            <span>{inv.serviceAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Đã đặt cọc</span>
            <span>{inv.deposit.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Tổng tiền</span>
            <span>{inv.totalAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Còn lại phải thu</span>
            <span>{inv.remainAmount.toLocaleString("vi-VN")} đ</span>
          </div>

          <Separator />

          <div>
            <Label>Trạng thái</Label>
            <p>{inv.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}</p>
          </div>

          <div>
            <Label>Ngày tạo</Label>
            <p>{formatDateTime(inv.createdAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
