// src/components/admin/customers/CustomersTable.tsx
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
import { CustomerDetailDialog } from "./CustomerDetailDialog";
import type { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomersTable({customers}: Props) {
  return (
    <Card className="border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Số lần đặt sân</TableHead>
              <TableHead>Tổng chi tiêu</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{customer.fullName}</p>
                      <p className="text-xs opacity-60">{customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.phone ?? "Chưa cập nhật"}</TableCell>
                <TableCell>{customer.bookingCount}</TableCell>
                <TableCell>{customer.totalSpent.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={customer.isOnline ? "default" : "outline"}>
                    {customer.isOnline ? "Online" : "Offline"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <CustomerDetailDialog customer={customer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
