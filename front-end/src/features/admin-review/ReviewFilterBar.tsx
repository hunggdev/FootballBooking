import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ReviewFilterBar({
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4 rounded-md">
      <Input
        placeholder="Tìm kiếm theo khách hàng hoặc nội dung đánh giá..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-72"
      />
    </div>
  );
}