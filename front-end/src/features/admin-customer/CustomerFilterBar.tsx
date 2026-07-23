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

export function CustomerFilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input className="w-64 border" placeholder="Tìm theo tên, email, SĐT..." />
        <Select>
          <SelectTrigger className="w-44 border">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
            <SelectItem value="banned">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" className="border">
        <UserPlus className="mr-2 h-4 w-4" />
        Thêm khách hàng
      </Button>
    </div>
  );
}
