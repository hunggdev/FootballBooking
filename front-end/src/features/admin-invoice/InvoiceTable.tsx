import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/invoice";
import { formatDateTime } from "@/lib/utils";

interface Props {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, onView }: Props) {
  return (
    <Card className="mt-5">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã HĐ</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Còn lại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Chưa có hóa đơn nào.
                </TableCell>
              </TableRow>
            )}
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell className="font-medium">#{invoice.invoiceId}</TableCell>
                <TableCell>#{invoice.bookingId}</TableCell>
                <TableCell>{invoice.user?.fullName ?? invoice.userId}</TableCell>
                <TableCell>{invoice.totalAmount.toLocaleString("vi-VN")} đ</TableCell>
                <TableCell>{invoice.remainAmount.toLocaleString("vi-VN")} đ</TableCell>
                <TableCell>
                  {invoice.status === "PAID" ? (
                    <span className="text-green-600 font-semibold">Đã thanh toán</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Chưa thanh toán</span>
                  )}
                </TableCell>
                <TableCell>{formatDateTime(invoice.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => onView(invoice)}>
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
