import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

type StatusFilter = "all" | "ACTIVE" | "INACTIVE";

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
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm kiếm theo tên dịch vụ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] border"
        />

       <Select
  value={status}
  onValueChange={(value) => onStatusChange((value ?? "all") as StatusFilter)}
>
  <SelectTrigger className="w-44 border">
    <SelectValue placeholder="Lọc theo trạng thái" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Tất cả trạng thái</SelectItem>
    <SelectItem value="ACTIVE">Đang kinh doanh</SelectItem>
    <SelectItem value="INACTIVE">Ngừng kinh doanh</SelectItem>
  </SelectContent>
</Select>

      </div>

      <Button variant="outline" className="border" onClick={onClick}>
        <Package className="mr-2 h-4 w-4" />
        Thêm dịch vụ
      </Button>
    </div>
  );
}
