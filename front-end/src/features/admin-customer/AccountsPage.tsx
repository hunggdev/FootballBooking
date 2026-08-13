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
import { Search } from "lucide-react";

export function AccountsPage() {
  return (
    <>
      <PageHeader
        title="Quản lý tài khoản"
        subtitle="Trạng thái đăng nhập và bảo mật tài khoản khách hàng"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tìm kiếm */}
          <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

            <Input
              placeholder="Tìm theo tên, email..."
              className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
            />
          </div>

          {/* Bộ lọc trạng thái */}
          <Select defaultValue="all">
            <SelectTrigger className="w-44 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>

            <SelectContent className="border-border bg-elevated text-text-primary">
              <SelectItem
                value="all"
                className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
              >
                Tất cả trạng thái
              </SelectItem>

              <SelectItem
                value="active"
                className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
              >
                Đang hoạt động
              </SelectItem>

              <SelectItem
                value="locked"
                className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
              >
                Đã khóa
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <AccountsTable />
      </div>
    </>
  );
}

