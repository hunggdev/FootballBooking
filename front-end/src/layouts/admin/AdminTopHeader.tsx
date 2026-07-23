// src/components/admin/layout/AdminTopHeader.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Bell, ChevronDown } from "lucide-react";
import LogOut from "@/features/auth/SignOutButton";

const notifications = [
  { id: "1", text: "#KH1032 vừa đặt Sân A lúc 18:00-19:00", time: "2 phút trước" },
  { id: "2", text: "#KH0987 vừa giữ chỗ Sân B lúc 20:00-21:00", time: "4 phút trước" },
  { id: "3", text: "#KH1104 vừa xác nhận đặt sân lúc 17:10", time: "" },
];

export function AdminTopHeader() {
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3">
      {/* Logo */}
      <div className="flex shrink-0 flex-col border px-3 py-1.5">
        <span className="text-sm font-semibold">SÂN BÓNG S</span>
        <span className="text-[10px] opacity-60">ADMIN PANEL</span>
      </div>

      {/* Live ticker */}
      <div className="flex flex-1 items-center gap-4 overflow-x-auto px-2 text-xs">
        <Badge variant="outline" className="shrink-0">
          LIVE
        </Badge>
        {notifications.map((item, idx) => (
          <div key={item.id} className="flex shrink-0 items-center gap-4">
            {idx !== 0 && <Separator orientation="vertical" className="h-4" />}
            <span className="whitespace-nowrap">
              {item.text}
              {item.time && <span className="ml-1 opacity-60">{item.time}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="icon" className="border">
          <Search className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" className="relative border">
          <Bell className="h-4 w-4" />
          <Badge variant="outline" className="absolute -right-1 -top-1 h-4 min-w-4 justify-center p-0 text-[10px]">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 border">
              <Avatar className="h-6 w-6 border">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-[10px] opacity-60">Quản trị viên</span>
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Thông tin tài khoản</DropdownMenuItem>
            <DropdownMenuItem><LogOut/></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
