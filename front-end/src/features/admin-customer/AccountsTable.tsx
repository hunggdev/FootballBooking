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
import { Button } from "@/components/ui/button";

import {
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
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
      <Card
        className="
          overflow-hidden
          border-border/50
          bg-surface
          shadow-lg
          shadow-black/10
        "
      >
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>

              {/* ================= HEADER ================= */}
              <TableHeader>
                <TableRow
                  className="
                    border-border/60
                    bg-elevated/30
                    hover:bg-elevated/30
                  "
                >
                  <TableHead
                    className="
                      w-16
                      text-center
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    STT
                  </TableHead>

                  <TableHead
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Họ và tên
                  </TableHead>

                  <TableHead
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Email
                  </TableHead>

                  <TableHead
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Đăng nhập gần nhất
                  </TableHead>

                  <TableHead
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Ngày tạo
                  </TableHead>

                  <TableHead
                    className="
                      text-center
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Trạng thái
                  </TableHead>

                  <TableHead
                    className="
                      pr-6
                      text-right
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-text-muted
                    "
                  >
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ================= BODY ================= */}
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow
                    className="
                      border-border/60
                      hover:bg-transparent
                    "
                  >
                    <TableCell
                      colSpan={7}
                      className="
                        py-12
                        text-center
                        text-sm
                        text-text-muted
                      "
                    >
                      Không tìm thấy tài khoản nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account, index) => {
                    const isLocked =
                      account.status === "locked";

                    return (
                      <TableRow
                        key={account.accountId}
                        className="
                          group
                          border-border/50
                          transition-colors
                          duration-200
                          hover:bg-surface-hover/60
                        "
                      >

                        {/* ================= STT ================= */}
                        <TableCell
                          className="
                            text-center
                            text-xs
                            font-medium
                            text-text-muted
                          "
                        >
                          {index + 1}
                        </TableCell>

                        {/* ================= HỌ VÀ TÊN ================= */}
                        <TableCell>
                          <div className="flex items-center gap-3">

                            <Avatar
                              className="
                                h-9
                                w-9
                                shrink-0
                                border
                                border-brand-primary/30
                                bg-brand-primary/10
                              "
                            >
                              <AvatarFallback
                                className="
                                  bg-brand-primary/10
                                  text-sm
                                  font-semibold
                                  text-brand-primary
                                "
                              >
                                {getInitials(account.fullName)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-text-primary
                                  transition-colors
                                  duration-200
                                  group-hover:text-white
                                "
                              >
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

                        {/* ================= EMAIL ================= */}
                        <TableCell
                          className="
                            text-sm
                            text-text-secondary
                          "
                        >
                          {account.email}
                        </TableCell>

                        {/* ================= ĐĂNG NHẬP ================= */}
                        <TableCell
                          className="
                            text-sm
                            text-text-secondary
                          "
                        >
                          {formatDateTime(account.lastLoginAt)}
                        </TableCell>

                        {/* ================= NGÀY TẠO ================= */}
                        <TableCell
                          className="
                            text-sm
                            text-text-secondary
                          "
                        >
                          {formatDate(account.createdAt)}
                        </TableCell>

                        {/* ================= TRẠNG THÁI ================= */}
                        <TableCell className="text-center">
                          {isLocked ? (
                            <Badge
                              variant="outline"
                              className="
                                border-status-danger/20
                                bg-status-danger-bg
                                text-status-danger
                              "
                            >
                              <Lock
                                className="
                                  mr-1.5
                                  h-3
                                  w-3
                                "
                              />

                              {statusLabel[account.status]}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="
                                border-status-success/20
                                bg-status-success-bg
                                text-status-success
                              "
                            >
                              <span
                                className="
                                  mr-1.5
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-status-success
                                "
                              />

                              {statusLabel[account.status]}
                            </Badge>
                          )}
                        </TableCell>

                        {/* ================= HÀNH ĐỘNG ================= */}
                        <TableCell className="pr-6">
                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-2
                            "
                          >

                            {/* ĐẶT LẠI MẬT KHẨU */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="
                                h-8
                                border-border
                                bg-transparent
                                px-2.5
                                text-xs
                                font-medium
                                text-text-secondary
                                shadow-none
                                transition-all
                                duration-200
                                hover:-translate-y-px
                                hover:border-brand-accent/40
                                hover:bg-brand-accent/10
                                hover:text-brand-accent
                              "
                            >
                              <KeyRound
                                className="
                                  mr-1.5
                                  h-3.5
                                  w-3.5
                                "
                              />

                              Đặt lại mật khẩu
                            </Button>

                            {/* MỞ KHÓA */}
                            {isLocked ? (
                              <Button
                                size="sm"
                                className="
                                  h-8
                                  border
                                  border-brand-primary/20
                                  bg-brand-primary/10
                                  px-2.5
                                  text-xs
                                  font-medium
                                  text-brand-primary
                                  shadow-none
                                  transition-all
                                  duration-200
                                  hover:-translate-y-px
                                  hover:border-brand-primary/30
                                  hover:bg-brand-primary/20
                                "
                              >
                                <Unlock
                                  className="
                                    mr-1.5
                                    h-3.5
                                    w-3.5
                                  "
                                />

                                Mở khóa
                              </Button>
                            ) : (
                              /* KHÓA */
                              <Button
                                size="sm"
                                variant="outline"
                                className="
                                  h-8
                                  border
                                  border-status-danger/20
                                  bg-status-danger-bg
                                  px-2.5
                                  text-xs
                                  font-medium
                                  text-status-danger
                                  shadow-none
                                  transition-all
                                  duration-200
                                  hover:-translate-y-px
                                  hover:border-status-danger/30
                                  hover:bg-status-danger/20
                                "
                              >
                                <Lock
                                  className="
                                    mr-1.5
                                    h-3.5
                                    w-3.5
                                  "
                                />

                                Khóa
                              </Button>
                            )}

                          </div>
                        </TableCell>

                      </TableRow>
                    );
                  })
                )}
              </TableBody>

            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
