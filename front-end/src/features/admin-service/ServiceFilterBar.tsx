import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function ServiceFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ServiceFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <Input
        placeholder="Tìm kiếm theo tên dịch vụ..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:max-w-sm"
      />

      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value ?? "all")}
      >
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="ACTIVE">Đang Kinh doanh</SelectItem>
          <SelectItem value="INACTIVE">Ngừng kinh doanh</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
