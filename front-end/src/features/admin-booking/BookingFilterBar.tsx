import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface BookingFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  onStatusChange: (value: "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") => void;
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
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm kiếm theo Booking ID, User ID, Field ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 border"
        />

        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange((value ?? "all") as "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED")
          }
        >
          <SelectTrigger className="w-44 border">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="border" onClick={onClick}>
        <CalendarPlus className="mr-2 h-4 w-4" />
        Thêm Booking
      </Button>
    </div>
  );
}
