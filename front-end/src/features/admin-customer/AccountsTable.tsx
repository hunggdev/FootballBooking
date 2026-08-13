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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock, Unlock, KeyRound } from "lucide-react";
import type { Account } from "@/features/admin-customer/types";

const statusLabel: Record<Account["status"], string> = {
  active: "Đang hoạt động",
  locked: "Đã khóa",
};

const accounts: Account[] = [
  {
    accountId: 1,
    fullName: "Trần Văn Bình",
    email: "binh.tran@gmail.com",
    role: "customer",
    status: "active",
    lastLoginAt: "2026-07-22T09:12:00.000Z",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    accountId: 2,
    fullName: "Lê Thị Mai",
    email: "mai.le@gmail.com",
    role: "customer",
    status: "active",
    lastLoginAt: "2026-07-20T18:40:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    accountId: 3,
    fullName: "Nguyễn Hoàng Nam",
    email: "nam.nguyen@gmail.com",
    role: "customer",
    status: "locked",
    lastLoginAt: null,
    createdAt: "2026-04-20T00:00:00.000Z",
  },
];

function formatDateTime(iso?: string | null) {
  if (!iso) return "Chưa đăng nhập";

  return new Date(iso).toLocaleString("vi-VN");
}

function getInitials(fullName: string) {
  const words = fullName.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
}

export function AccountsTable() {
  return (
    <Card className="overflow-hidden rounded-xl border border-border bg-surface">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-elevated hover:bg-elevated">
                <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Họ và tên
                </TableHead>

                <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Email
                </TableHead>

                <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Đăng nhập gần nhất
                </TableHead>

                <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Ngày tạo
                </TableHead>

                <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Trạng thái tài khoản
                </TableHead>

                <TableHead className="h-12 px-4 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accounts.map((account) => {
                const isLocked = account.status === "locked";

                return (
                  <TableRow
                    key={account.accountId}
                    className="border-border bg-surface transition-colors hover:bg-surface-hover"
                  >
                    {/* Họ tên */}
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border bg-elevated">
                          <AvatarFallback className="bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                            {getInitials(account.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-text-primary">
                            {account.fullName}
                          </p>

                          <p className="text-xs text-text-muted">
                            {account.role === "customer"
                              ? "Khách hàng"
                              : "Quản trị viên"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-4 py-4 text-sm text-text-secondary">
                      {account.email}
                    </TableCell>

                    {/* Đăng nhập */}
                    <TableCell className="px-4 py-4 text-sm text-text-secondary">
                      {formatDateTime(account.lastLoginAt)}
                    </TableCell>

                    {/* Ngày tạo */}
                    <TableCell className="px-4 py-4 text-sm text-text-secondary">
                      {new Date(account.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell className="px-4 py-4">
                      {isLocked ? (
                        <Badge className="border border-status-danger/30 bg-status-danger-bg text-status-danger hover:bg-status-danger-bg">
                          <Lock className="mr-1.5 h-3 w-3" />
                          {statusLabel[account.status]}
                        </Badge>
                      ) : (
                        <Badge className="border border-status-success/30 bg-status-success-bg text-status-success hover:bg-status-success-bg">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-status-success" />
                          {statusLabel[account.status]}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border bg-elevated text-text-secondary hover:border-brand-accent hover:bg-brand-accent/10 hover:text-brand-accent"
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Đặt lại mật khẩu
                        </Button>

                        {isLocked ? (
                          <Button
                            size="sm"
                            className="border-transparent bg-brand-primary font-semibold text-white hover:bg-brand-primary-hover"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Mở khóa
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-status-danger/40 bg-status-danger-bg text-status-danger hover:bg-status-danger hover:text-white"
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Khóa
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
