// src/components/admin/layout/Sidebar.tsx
import {
  LayoutDashboard,
  LayoutGrid,
  PackageOpen,
  Trophy,
  HelpCircle,
  CalendarCheck,
  History,
  Users,
  UserCog,
  MessageSquare,
  Wallet,
  Receipt,
  RotateCcw,
  BarChart3,
  FileText,
  UserCircle,
  KeyRound,
  Settings,
  ScrollText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { NavGroup } from "@/features/admin-dashboard/types";
import { Link } from "react-router";

const navGroups: NavGroup[] = [
  {
    id: "overview",
    items: [{ id: "dashboard", label: "Tổng quan", path: "/admin", icon: LayoutDashboard }],
  },
  {
    id: "system",
    title: "Quản lý hệ thống",
    items: [
      { id: "fields", label: "Sân bóng", path: "/admin/fields", icon: LayoutGrid, hasChevron: true },
      { id: "services", label: "Dịch vụ", path: "/admin/services", icon: PackageOpen, hasChevron: true },
      { id: "odds", label: "Kèo đấu", path: "/admin/matches", icon: Trophy, hasChevron: true },
      { id: "odds-requests", label: "Yêu cầu kèo", path: "/admin/odds/requests", icon: HelpCircle, hasChevron: true },
      { id: "bookings", label: "Đặt sân", path: "/admin/bookings", icon: CalendarCheck, hasChevron: true },
      { id: "booking-history", label: "Lịch sử đặt sân", path: "/admin/bookings/history", icon: History, hasChevron: true },
    ],
  },
  {
    id: "customers",
    title: "Quản lý khách hàng",
    items: [
      { id: "customers", label: "Khách hàng", path: "/admin/customers", icon: Users, hasChevron: true },
      { id: "accounts", label: "Tài khoản", path: "/admin/accounts", icon: UserCog, hasChevron: true },
      { id: "feedback", label: "Phản hồi & đánh giá", path: "/admin/feedback", icon: MessageSquare, hasChevron: true },
    ],
  },
  {
    id: "finance",
    title: "Quản lý tài chính",
    items: [
      { id: "payments", label: "Thanh toán", path: "/admin/payments", icon: Wallet, hasChevron: true },
      { id: "invoices", label: "Hóa đơn", path: "/admin/invoices", icon: Receipt, hasChevron: true },
      { id: "refunds", label: "Hoàn tiền cọc", path: "/admin/refunds", icon: RotateCcw, hasChevron: true },
    ],
  },
  {
    id: "reports",
    title: "Thống kê & báo cáo",
    items: [
      { id: "stats", label: "Thống kê", path: "/admin/stats", icon: BarChart3, hasChevron: true },
      { id: "reports", label: "Báo cáo", path: "/admin/reports", icon: FileText, hasChevron: true },
    ],
  },
  {
    id: "settings",
    title: "Cài đặt hệ thống",
    items: [
      { id: "staff", label: "Nhân viên", path: "/admin/staff", icon: UserCircle, hasChevron: true },
      { id: "roles", label: "Vai trò & phân quyền", path: "/admin/roles", icon: KeyRound, hasChevron: true },
      { id: "settings", label: "Cài đặt", path: "/admin/settings", icon: Settings, hasChevron: true },
      { id: "logs", label: "Nhật ký hoạt động", path: "/admin/logs", icon: ScrollText, hasChevron: true },
    ],
  },
];

export function Sidebar({ activeId = "dashboard" }: { activeId?: string }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r">
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-1">
            {group.title && (
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide opacity-50">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center justify-between gap-2 border px-3 py-2 text-sm ${
                    isActive ? "font-semibold" : "opacity-70"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.hasChevron && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t p-3">
        <button className="flex w-full items-center gap-2 border px-3 py-2 text-sm opacity-70">
          <ChevronLeft className="h-4 w-4" />
          Thu gọn
        </button>
      </div>
    </aside>
  );
}
