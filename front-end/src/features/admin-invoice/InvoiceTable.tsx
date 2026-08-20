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
import type { Invoice, Invoices } from "@/types/invoice";
import { formatDateTime } from "@/lib/utils";

interface Props {
  invoices: Invoices[];
  onView: (invoice: Invoices) => void;
  currentPage: number;
  pageSize: number;
}

export function InvoiceTable({ invoices, onView, currentPage, pageSize }: Props) {
   const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentInvoices = invoices.slice(startIndex, endIndex);
  console.log(currentInvoices);
  

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
            {currentInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Chưa có hóa đơn nào.
                </TableCell>
              </TableRow>
            )}
            {currentInvoices.map((i) => ( 
              <TableRow key={i.invoice.invoiceId}>
                <TableCell className="font-medium">#{i.invoice.invoiceId}</TableCell>
                <TableCell>#{i.bookingId}</TableCell>
                <TableCell>{i.user.fullName}</TableCell>
                <TableCell>{i.invoice.totalAmount.toLocaleString("vi-VN")} đ</TableCell>
                <TableCell>{i.invoice.remainAmount.toLocaleString("vi-VN")} đ</TableCell>
                <TableCell>
                  {i.invoice.status === "PAID" ? (
                    <span className="text-green-600 font-semibold">Đã thanh toán</span>
                  ) : ( i.invoice.status === "DEPOSITED" ? (
                    <span className="text-blue-600 font-semibold">Đã cọc</span> ) : 
                    ( i.invoice.status === "CANCELLED" ? ( <span className="text-red-600 font-semibold">Đã hủy</span> )  : (
                      <span className="text-amber-600 font-semibold">Chưa thanh toán</span>  
                    )
                  )  
                  )}
                </TableCell>
                <TableCell>{formatDateTime(i.invoice.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => onView(i)}> 
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
