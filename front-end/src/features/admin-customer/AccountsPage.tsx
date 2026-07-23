// src/components/admin/accounts/AccountsPage.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/layouts/admin/PageHeader";
import { AccountsTable } from "@/features/admin-customer/AccountsTable";

export function AccountsPage() {
  return (
    <>
      <PageHeader
        title="Quản lý tài khoản"
        subtitle="Trạng thái đăng nhập và bảo mật tài khoản khách hàng"
      />
      <div className="flex flex-wrap items-center gap-3 border p-4">
        <Input className="w-64 border" placeholder="Tìm theo tên, email..." />
        <Select>
          <SelectTrigger className="w-44 border">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AccountsTable />
    </>
  );
}
