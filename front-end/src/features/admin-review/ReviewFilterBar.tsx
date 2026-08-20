import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ReviewFilterBar({ search, onSearchChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

        <Input
          placeholder="Tìm kiếm theo khách hàng hoặc nội dung đánh giá..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className=" w-[420px]
                      border-0
                      bg-elevated
                      pl-8
                      text-text-primary
                      placeholder:text-text-muted
                      focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
