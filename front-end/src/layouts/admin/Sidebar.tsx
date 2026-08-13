import { useState } from "react";
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
import { Link, useLocation } from "react-router";

const navGroups: NavGroup[] = [
  {
    id: "overview",
    items: [
      {
        id: "dashboard",
        label: "Tổng quan",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "system",
    title: "Quản lý hệ thống",
    items: [
      {
        id: "fields",
        label: "Sân bóng",
        path: "/admin/fields",
        icon: LayoutGrid,
        hasChevron: true,
      },
      {
        id: "services",
        label: "Dịch vụ",
        path: "/admin/services",
        icon: PackageOpen,
        hasChevron: true,
      },
      {
        id: "odds",
        label: "Kèo đấu",
        path: "/admin/matches",
        icon: Trophy,
        hasChevron: true,
      },
      {
        id: "odds-requests",
        label: "Yêu cầu kèo",
        path: "/admin/odds/requests",
        icon: HelpCircle,
        hasChevron: true,
      },
      {
        id: "bookings",
        label: "Đặt sân",
        path: "/admin/bookings",
        icon: CalendarCheck,
        hasChevron: true,
      },
      {
        id: "booking-history",
        label: "Lịch sử đặt sân",
        path: "/admin/bookings/history",
        icon: History,
        hasChevron: true,
      },
    ],
  },
  {
    id: "customers",
    title: "Quản lý khách hàng",
    items: [
      {
        id: "customers",
        label: "Khách hàng",
        path: "/admin/customers",
        icon: Users,
        hasChevron: true,
      },
      {
        id: "accounts",
        label: "Tài khoản",
        path: "/admin/accounts",
        icon: UserCog,
        hasChevron: true,
      },
      {
        id: "feedback",
        label: "Phản hồi & đánh giá",
        path: "/admin/feedback",
        icon: MessageSquare,
        hasChevron: true,
      },
    ],
  },
  {
    id: "finance",
    title: "Quản lý tài chính",
    items: [
      {
        id: "payments",
        label: "Thanh toán",
        path: "/admin/payments",
        icon: Wallet,
        hasChevron: true,
      },
      {
        id: "invoices",
        label: "Hóa đơn",
        path: "/admin/invoices",
        icon: Receipt,
        hasChevron: true,
      },
      {
        id: "refunds",
        label: "Hoàn tiền cọc",
        path: "/admin/refunds",
        icon: RotateCcw,
        hasChevron: true,
      },
    ],
  },
  {
    id: "reports",
    title: "Thống kê & báo cáo",
    items: [
      {
        id: "stats",
        label: "Thống kê",
        path: "/admin/stats",
        icon: BarChart3,
        hasChevron: true,
      },
      {
        id: "reports",
        label: "Báo cáo",
        path: "/admin/reports",
        icon: FileText,
        hasChevron: true,
      },
    ],
  },
  {
    id: "settings",
    title: "Cài đặt hệ thống",
    items: [
      {
        id: "staff",
        label: "Nhân viên",
        path: "/admin/staff",
        icon: UserCircle,
        hasChevron: true,
      },
      {
        id: "roles",
        label: "Vai trò & phân quyền",
        path: "/admin/roles",
        icon: KeyRound,
        hasChevron: true,
      },
      {
        id: "settings",
        label: "Cài đặt",
        path: "/admin/settings",
        icon: Settings,
      },
      {
        id: "logs",
        label: "Nhật ký hoạt động",
        path: "/admin/logs",
        icon: ScrollText,
      },
    ],
  },
];

function isPathActive(pathname: string, path: string) {
  if (path === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Sidebar({ activeId = "dashboard" }: { activeId?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`admin-sidebar flex h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-deep transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* LOGO */}
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-border ${
          collapsed ? "justify-center px-2" : "px-5"
        }`}
      >
        <Link to="/admin" className="flex items-center gap-3">
          <div className="admin-logo flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--token-gradient-brand)] text-lg font-black text-white shadow-[0_0_18px_rgba(34,165,90,0.18)]">
            S
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold tracking-tight text-text-primary">
                SÂN BÓNG <span className="text-brand-accent">S</span>
              </span>
              <span className="mt-1.5 text-[9px] font-medium tracking-[0.22em] text-text-muted">
                ADMIN PANEL
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* MENU */}
      <nav className="admin-sidebar-nav flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.id}>
              {group.title && !collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    isPathActive(location.pathname, item.path) ||
                    (location.pathname === "/admin" && item.id === activeId);

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                        collapsed ? "justify-center" : "justify-between"
                      } ${
                        isActive
                          ? "bg-elevated font-semibold text-brand-accent shadow-[inset_2px_0_0_var(--token-accent)]"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            isActive
                              ? "bg-surface-hover text-brand-accent"
                              : "text-text-muted group-hover:text-text-primary"
                          }`}
                        />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.hasChevron && (
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-brand-accent" : "text-text-muted"
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* NÚT THU GỌN */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`flex w-full items-center rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary ${
            collapsed ? "justify-center" : "justify-center gap-2"
          }`}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && "Thu gọn"}
        </button>
      </div>
    </aside>
  );
}
