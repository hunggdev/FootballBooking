// src/components/admin/dashboard/RecentBookingsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Copy } from "lucide-react";
import type { BookingRow } from "./types";

const statusLabel: Record<BookingRow["status"], string> = {
  booked: "Đã đặt",
  held: "Giữ chỗ",
  "pending-confirm": "Chờ xác nhận",
  paid: "Đã thanh toán",
};

const bookings: BookingRow[] = [
  { id: "#DS1267", customerName: "Nguyễn Văn A", fieldName: "Sân A", dateTime: "14/07/2026 - 20:00", duration: "2 giờ", deposit: 200000, status: "booked" },
  { id: "#DS1266", customerName: "Trần Văn Bình", fieldName: "Sân B", dateTime: "14/07/2026 - 18:00", duration: "1.5 giờ", deposit: 150000, status: "held" },
  { id: "#DS1265", customerName: "Lê Thị Mai", fieldName: "Sân C", dateTime: "15/07/2026 - 19:00", duration: "2 giờ", deposit: 200000, status: "pending-confirm" },
  { id: "#DS1264", customerName: "Phạm Minh Tuấn", fieldName: "Sân A", dateTime: "15/07/2026 - 17:00", duration: "2 giờ", deposit: 200000, status: "paid" },
  { id: "#DS1263", customerName: "Hoàng Đức Anh", fieldName: "Sân D", dateTime: "16/07/2026 - 20:00", duration: "2 giờ", deposit: 200000, status: "booked" },
];

export function RecentBookingsTable() {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Đặt sân mới nhất</CardTitle>
        <Button variant="link" className="text-sm">
          Xem tất cả →
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đặt sân</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sân</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead>Tiền cọc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarFallback>{row.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {row.customerName}
                  </div>
                </TableCell>
                <TableCell>{row.fieldName}</TableCell>
                <TableCell>{row.dateTime}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.deposit.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>
                  <Badge variant="outline">{statusLabel[row.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 border">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 border">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
