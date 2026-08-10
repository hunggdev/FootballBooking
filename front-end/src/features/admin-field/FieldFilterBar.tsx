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
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm kiếm theo tên sân..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 border"
        />

        <Select
          value={fieldType}
          onValueChange={(value) =>
            onFieldTypeChange((value ?? "all") as FieldType | "all")
          }
        >
          <SelectTrigger className="w-44 border">
            <SelectValue placeholder="Lọc theo loại sân" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại sân</SelectItem>
            <SelectItem value="FIVE">Sân 5 người</SelectItem>
            <SelectItem value="SEVEN">Sân 7 người</SelectItem>
            <SelectItem value="ELEVEN">Sân 11 người</SelectItem>
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
