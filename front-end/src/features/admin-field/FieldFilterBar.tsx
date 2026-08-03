import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FieldFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onClick: () => void;
  onChangePage: (value: number) => void;
}

export function FieldFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClick,
  onChangePage
}: FieldFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Tìm kiếm theo tên sân..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 border"
      />

        <Select
        value={status}
        onValueChange={(value) => {onStatusChange(value ?? "all"); onChangePage(1); }}
        >
        <SelectTrigger className="w-44 border">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Tất cả trạng thái
          </SelectItem>

          <SelectItem value="ACTIVE">
            Đang hoạt động
          </SelectItem>

          <SelectItem value="MAINTENANCE">
            Đang bảo trì
          </SelectItem>

          <SelectItem value="INACTIVE">
            Ngừng hoạt động
          </SelectItem>
        </SelectContent>

        </Select>
    </div>
   <Button variant="outline" className="border" onClick={onClick}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm sân
    </Button>
    </div>

  );
}