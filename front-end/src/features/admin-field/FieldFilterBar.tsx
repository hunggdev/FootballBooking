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
import type { FieldType } from "@/types/field";

interface FieldFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  fieldType: FieldType | "all";
  onFieldTypeChange: (value: FieldType | "all") => void;
  onClick: () => void;
}

export function FieldFilterBar({
  search,
  onSearchChange,
  fieldType,
  onFieldTypeChange,
  onClick,
}: FieldFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

          <Input
            placeholder="Tìm kiếm theo tên sân..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
          />
        </div>
        <Select
          value={fieldType}
          onValueChange={(value) =>
            onFieldTypeChange((value ?? "all") as FieldType | "all")
          }
        >
          <SelectTrigger className="w-44 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
            <SelectValue placeholder="Lọc theo loại sân" />
          </SelectTrigger>
          <SelectContent className="border-border bg-elevated text-text-primary">
            <SelectItem
              value="all"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Tất cả loại sân
            </SelectItem>
            <SelectItem
              value="FIVE"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Sân 5 người
            </SelectItem>
            <SelectItem
              value="SEVEN"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Sân 7 người
            </SelectItem>
            <SelectItem
              value="ELEVEN"
              className="text-text-secondary focus:bg-surface-hover focus:text-text-primary"
            >
              Sân 11 người
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
        onClick={onClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm sân
      </Button>
    </div>
  );
}
