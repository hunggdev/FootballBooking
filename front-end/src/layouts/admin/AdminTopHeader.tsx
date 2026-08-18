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

import {
  Search,
  Bell,
  ChevronDown,
  Settings2,
} from "lucide-react";

import LogOut from "@/features/auth/SignOutButton";

const notifications = [
  {
    id: "1",
    text: "#KH1032 vừa đặt Sân A lúc 18:00-19:00",
    time: "2 phút trước",
  },
  {
    id: "2",
    text: "#KH0987 vừa giữ chỗ Sân B lúc 20:00-21:00",
    time: "4 phút trước",
  },
  {
    id: "3",
    text: "#KH1104 vừa xác nhận đặt sân lúc 17:10",
    time: "",
  },
];

export function AdminTopHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-surface px-5">
      {/* ================= LIVE TICKER ================= */}
      <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
        {/* LIVE */}
        <Badge
          className="shrink-0 border border-status-danger/30 bg-status-danger-bg px-2.5 py-1 text-[10px] font-semibold tracking-wide text-status-danger"
        >
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-status-danger" />
          LIVE
        </Badge>

        {/* Notifications */}
        <div className="flex min-w-0 items-center gap-4 overflow-x-auto [scrollbar-width:none]">
          {notifications.map((item, index) => (
            <div key={item.id} className="flex shrink-0 items-center gap-4">
              {index !== 0 && (
                <Separator orientation="vertical" className="h-4 bg-border" />
              )}

              <span className="whitespace-nowrap text-xs text-text-secondary">
                {/* Giữ logic highlight mã KH và bôi cam thời gian của bản mới */}
                <strong className="font-semibold text-text-primary">
                  {item.text.split(" ")[0]}
                </strong>
                {item.text.slice(item.text.indexOf(" "))}

                {item.time && (
                  <span className="ml-1.5 font-medium text-brand-accent">
                    {item.time}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="ml-5 flex shrink-0 items-center gap-2">
        {/* Search */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notification */}
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-[9px] font-semibold text-white">
            3
          </span>
        </Button>

        {/* ================= ADMIN ================= */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-border hover:bg-surface-hover">
              {/* Avatar */}
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-elevated text-xs font-semibold text-brand-accent">
                  A
                </AvatarFallback>
              </Avatar>

              {/* Admin name */}
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-medium text-text-primary">
                  Admin
                </span>
                <span className="text-[10px] text-text-muted">
                  Quản trị viên
                </span>
              </span>

              <ChevronDown className="h-4 w-4 text-text-muted" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 border-border bg-elevated text-text-primary"
          >
            <DropdownMenuItem className="cursor-pointer text-text-secondary  focus:text-text-primary">
              <Settings2 className="mr-2 h-4 w-4" />
              Thông tin tài khoản
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer text-text-secondary  f
            ocus:text-status-danger">
              <LogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}