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

export type MatchStatusFilter =
  | "all"
  | "OPEN"
  | "MATCHED"
  | "FINISHED"
  | "CANCELLED";

interface MatchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onClick: () => void;
  onChangePage?: (value: number) => void;
}

export function MatchFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClick,
  onChangePage,
}: MatchFilterBarProps) {
  const handleSearch = (value: string) => {
    onSearchChange(value);
    if (onChangePage) onChangePage(1);
  };

  // Cập nhật type `value: string | null` để khớp với Select component
  const handleStatusChange = (value: string | null) => {
    onStatusChange(value ?? "all");
    if (onChangePage) onChangePage(1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Ô Tìm kiếm có icon kính lúp + hiệu ứng gradient border */}
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm theo tên người tạo kèo..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>

        {/* Select Lọc trạng thái kèo */}
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-44 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
            <SelectValue>
              {status === "all"
                ? "Tất cả trạng thái"
                : status === "OPEN"
                ? "Đang tìm"
                : status === "MATCHED"
                ? "Đã ghép"
                : status === "FINISHED"
                ? "Đã kết thúc"
                : "Đã hủy"}
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
              value="OPEN"
              className="text-text-secondary  focus:text-text-primary"
            >
              Đang tìm
            </SelectItem>
            <SelectItem
              value="MATCHED"
              className="text-text-secondary  focus:text-text-primary"
            >
              Đã ghép
            </SelectItem>
            <SelectItem
              value="FINISHED"
              className="text-text-secondary  focus:text-text-primary"
            >
              Đã hoàn thành
            </SelectItem>
            <SelectItem
              value="CANCELLED"
              className="text-text-secondary  focus:text-text-primary"
            >
              Đã hủy
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nút Tạo Kèo Đấu */}
      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
        onClick={onClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Tạo kèo đấu
      </Button>
    </div>
  );
}
