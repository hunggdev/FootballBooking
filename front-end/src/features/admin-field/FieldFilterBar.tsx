import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function FieldFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: FieldFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <Input
        placeholder="Tìm kiếm theo tên sân..."
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
  );
}