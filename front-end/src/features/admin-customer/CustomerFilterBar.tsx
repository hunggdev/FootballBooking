import { Search, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onClick: () => void;
  onChangePage: (value: number) => void;
}

export function CustomerFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClick,
  onChangePage,
}: CustomerFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onChangePage(1);
            }}
            className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>

        {/* Status */}
        <Select
          value={status}
          onValueChange={(value) => {
            onStatusChange(value ?? "all");
            onChangePage(1);
          }}
        >
          <SelectTrigger className="w-44 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
            <SelectValue>
              {status === "all"
                ? "Tất cả trạng thái"
                : status === "ACTIVE"
                  ? "Đã kích hoạt"
                  : status === "INACTIVE"
                    ? "Chưa kích hoạt"
                    : "Đã khóa"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="border-border bg-elevated text-text-primary">
            <SelectItem
              value="all"
              className="text-text-secondary focus:text-text-primary"
            >
              Tất cả trạng thái
            </SelectItem>

            <SelectItem
              value="ACTIVE"
              className="text-text-secondary ffocus:text-text-primary"
            >
              Đã kích hoạt
            </SelectItem>

            <SelectItem
              value="INACTIVE"
              className="text-text-secondary focus:text-text-primary"
            >
              Chưa kích hoạt
            </SelectItem>

            <SelectItem
              value="BANNED"
              className="text-text-secondary focus:text-text-primary"
            >
              Đã khóa
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add customer */}
      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
        onClick={onClick}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Thêm khách hàng
      </Button>
    </div>
  );
}
