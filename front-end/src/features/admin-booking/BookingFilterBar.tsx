// src/features/admin-booking/BookingFilterBar.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface BookingFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: "all" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  onStatusChange: (
    value: "all" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
  ) => void;
  onClick: () => void;
}

export function BookingFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClick,
}: BookingFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input with Gradient hover */}
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm theo mã đơn, khách hàng, tên sân..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>

        {/* Status Select Filter */}
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(
              (value ?? "all") as
                | "all"
                | "CONFIRMED"
                | "CANCELLED"
                | "COMPLETED",
            )
          }
        >
          <SelectTrigger className="w-48 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
            <SelectValue>
              {status === "all"
                ? "Tất cả trạng thái"
                : status === "CONFIRMED"
                  ? "Đã xác nhận"
                  : status === "COMPLETED"
                    ? "Đã hoàn thành"
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
              value="CONFIRMED"
              className="text-text-secondary focus:text-text-primary"
            >
              Đã xác nhận
            </SelectItem>
            <SelectItem
              value="COMPLETED"
              className="text-text-secondary focus:text-text-primary"
            >
              Đã hoàn thành
            </SelectItem>
            <SelectItem
              value="CANCELLED"
              className="text-text-secondary focus:text-text-primary"
            >
              Đã hủy
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover cursor-pointer"
        onClick={onClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Đặt sân mới
      </Button>
    </div>
  );
}
