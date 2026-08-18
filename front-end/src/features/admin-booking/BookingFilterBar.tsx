import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Search } from "lucide-react";

interface BookingFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  onStatusChange: (
    value: "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
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
        {/* Search */}
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm kiếm theo Booking ID, User ID, Field ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(
              (value ?? "all") as
              | "all"
              | "PENDING"
              | "CONFIRMED"
              | "CANCELLED"
              | "COMPLETED"
            )
          }
        >
          <SelectTrigger className="w-44 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>

          <SelectContent className="border-border bg-elevated text-text-primary">
            <SelectItem
              value="all"
              className="text-text-secondary  focus:text-text-primary"
            >
              Tất cả trạng thái
            </SelectItem>

            <SelectItem
              value="PENDING"
              className="text-text-secondary focus:text-text-primary"
            >
              Pending
            </SelectItem>

            <SelectItem
              value="CONFIRMED"
              className="text-text-secondary focus:text-text-primary"
            >
              Confirmed
            </SelectItem>

            <SelectItem
              value="CANCELLED"
              className="text-text-secondary  focus:text-primary"
            >
              Cancelled
            </SelectItem>

            <SelectItem
              value="COMPLETED"
              className="text-text-secondary  focus:text-text-primary"
            >
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Booking */}
      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
        onClick={onClick}
      >
        <CalendarPlus className="mr-2 h-4 w-4" />
        Thêm Booking
      </Button>
    </div>
  );
}