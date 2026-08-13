import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StatusFilter = "all" | "ACTIVE" | "INACTIVE";

interface ServiceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  onClick: () => void;
}

export function ServiceFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClick,
}: ServiceFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm kiếm theo tên dịch vụ..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange((value ?? "all") as StatusFilter)
          }
        >
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
              value="ACTIVE"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Đang kinh doanh
            </SelectItem>
            <SelectItem
              value="INACTIVE"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Ngừng kinh doanh
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
        onClick={onClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm dịch vụ
      </Button>
    </div>
  );
}