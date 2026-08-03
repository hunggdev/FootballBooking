// src/components/admin/customers/CustomerFilterBar.tsx
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onClick: () => void;
  onChangePage: (value: number) => void;
}

export function CustomerFilterBar({search, onSearchChange, status, onStatusChange, onClick, onChangePage}: CustomerFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input 
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 border"  />
        <Select 
          value={status}
          onValueChange={(value)=>{onStatusChange(value ?? "all"); onChangePage(1); }}
        >
          <SelectTrigger className="w-44 border">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Đã kích hoạt</SelectItem>
            <SelectItem value="INACTIVE">Chưa kích hoạt</SelectItem>
            <SelectItem value="BANNED">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" className="border" onClick={onClick}>
        <UserPlus className="mr-2 h-4 w-4" />
        Thêm khách hàng
      </Button>
    </div>
  );
}
