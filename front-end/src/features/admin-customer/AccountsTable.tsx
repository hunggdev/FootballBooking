// src/components/admin/accounts/AccountsTable.tsx
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
import { Button } from "@/components/ui/button";
import { Lock, Unlock, KeyRound } from "lucide-react";
import type { Account } from "@/features/admin-customer/types";

const statusLabel: Record<Account["status"], string> = {
  active: "Đang hoạt động",
  locked: "Đã khóa",
};

const accounts: Account[] = [
  { accountId: 1, fullName: "Trần Văn Bình", email: "binh.tran@gmail.com", role: "customer", status: "active", lastLoginAt: "2026-07-22T09:12:00.000Z", createdAt: "2026-02-10T00:00:00.000Z" },
  { accountId: 2, fullName: "Lê Thị Mai", email: "mai.le@gmail.com", role: "customer", status: "active", lastLoginAt: "2026-07-20T18:40:00.000Z", createdAt: "2026-03-01T00:00:00.000Z" },
  { accountId: 3, fullName: "Nguyễn Hoàng Nam", email: "nam.nguyen@gmail.com", role: "customer", status: "locked", lastLoginAt: null, createdAt: "2026-04-20T00:00:00.000Z" },
];

function formatDateTime(iso?: string | null) {
  if (!iso) return "Chưa đăng nhập";
  return new Date(iso).toLocaleString("vi-VN");
}

export function AccountsTable() {
  return (
    <Card className="border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Đăng nhập gần nhất</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái tài khoản</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell>{account.fullName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{formatDateTime(account.lastLoginAt)}</TableCell>
                <TableCell>{new Date(account.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>
                  <Badge variant="outline">{statusLabel[account.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="border">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Đặt lại mật khẩu
                    </Button>
                    <Button variant="outline" size="sm" className="border">
                      {account.status === "locked" ? (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Mở khóa
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Khóa
                        </>
                      )}
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
