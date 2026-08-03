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
import type { Customer } from "@/types/customer";

import { Button } from "@/components/ui/button";

interface Props {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const statusLabel: Record<Customer["status"], string> = {
  ACTIVE: "Đã kích hoạt",
  MAINTENANCE: "Đang bảo trì",
  INACTIVE: "Chưa kích hoạt",
  BANNED: "Đã khóa",
};

const statusVariant: Record<
  Customer["status"],
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  MAINTENANCE: "secondary",
  INACTIVE: "destructive",
  BANNED: "destructive",
};

function formatDate(iso?: string) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CustomersTable({customers, onView, onEdit, onDelete,}: Props) {
  return (
    <Card className="border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Số lần đặt sân</TableHead>
              <TableHead>Tổng chi tiêu</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Trạng thái HĐ</TableHead>
              <TableHead>Trạng thái TK</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.userId}>
                <TableCell>{index + 1}</TableCell>
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
                <TableCell>{(customer.totalSpent ?? 0).toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={customer.isOnline ? "default" : "outline"}>
                    {customer.isOnline ? "Online" : "Offline"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[customer.status.toUpperCase()]}>
                   {statusLabel[customer.status.toUpperCase()]}
                  </Badge>  
                </TableCell>

                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="secondary" onClick={() => onView(customer)}>Xem</Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(customer)}>Sửa</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(customer)} disabled={customer.status === "INACTIVE"}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
