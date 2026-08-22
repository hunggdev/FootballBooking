import {
  LayoutDashboard,
  LayoutGrid,
  PackageOpen,
  Trophy,
  CalendarCheck,
  Users,
  MessageSquare,
  Receipt,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
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
        id: "bookings",
        label: "Đặt sân",
        path: "/admin/bookings",
        icon: CalendarCheck,
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
        id: "invoices",
        label: "Hóa đơn",
        path: "/admin/invoices",
        icon: Receipt,
        hasChevron: true,
      },
    ],
  },
];

interface SidebarProps {
  activeId?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  activeId,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();

  const resolveActive = (path: string, id: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    if (location.pathname.startsWith(path)) {
      return true;
    }

    return id === activeId;
  };

  return (
    <aside
      className={`
        flex h-screen shrink-0 flex-col
        fixed left-0 top-0
        bg-surface
        border-r border-border/60
        shadow-[4px_0_24px_rgba(0,0,0,0.25)]
        z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* ── Brand block ── */}
      <div
        className={`
          flex items-center gap-3
          py-4
          border-b border-border/40
          transition-all duration-300
          ${collapsed ? "justify-center px-2" : "px-4"}
        `}
      >
        {/* Icon glow */}
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-lg
            bg-[image:var(--token-gradient-brand)]
            shadow-[0_0_16px_rgba(34,165,90,0.35)]
          "
          title="Sân Bóng S - Admin Panel"
        >
          <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>

        {/* Brand text (hidden when collapsed) */}
        {!collapsed && (
          <div className="flex flex-col leading-tight overflow-hidden whitespace-nowrap animate-in fade-in-0 duration-200">
            <span
              className="
                text-sm font-bold tracking-wide
                bg-[image:var(--token-gradient-brand)]
                bg-clip-text text-transparent
              "
            >
              SÂN BÓNG S
            </span>
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav
        className="
          flex flex-1 flex-col gap-4
          overflow-y-auto
          p-2.5
          custom-scrollbar
        "
      >
        {navGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-0.5">
            {/* Group label */}
            {group.title && (
              collapsed ? (
                <div className="my-1.5 border-t border-border/40" />
              ) : (
                <p
                  className="
                    mb-1 px-3 pt-1
                    text-[10px] font-semibold uppercase tracking-widest
                    text-text-muted whitespace-nowrap
                  "
                >
                  {group.title}
                </p>
              )
            )}

            {/* Nav items */}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = resolveActive(item.path, item.id);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group relative flex items-center gap-2.5
                    rounded-lg py-2.5
                    text-sm font-medium
                    transition-all duration-200
                    ${collapsed ? "justify-center px-2" : "justify-between px-3"}
                    ${
                      isActive
                        ? `
                            bg-[image:var(--token-gradient-brand)]
                            text-white
                            shadow-[0_2px_12px_rgba(34,165,90,0.25)]
                          `
                        : `
                            text-text-secondary
                            hover:bg-surface-hover
                            hover:text-text-primary
                          `
                    }
                  `}
                >
                  {/* Left accent bar for active */}
                  {isActive && (
                    <span
                      className="
                        absolute left-0 top-1/2 -translate-y-1/2
                        h-5 w-0.5 rounded-full
                        bg-white/80
                      "
                    />
                  )}

                  {/* Icon + label */}
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-text-muted group-hover:text-brand-primary"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    )}
                  </span>

                  {/* Chevron (only when expanded) */}
                  {!collapsed && item.hasChevron && (
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-white/70"
                          : "text-text-muted group-hover:text-text-secondary group-hover:translate-x-0.5"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Collapse footer ── */}
      <div className="border-t border-border/40 p-2.5">
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          className={`
            flex w-full items-center gap-2.5
            rounded-lg py-2.5
            text-sm text-text-muted
            transition-all duration-200
            hover:bg-surface-hover hover:text-text-secondary
            cursor-pointer group
            ${collapsed ? "justify-center px-2" : "px-3"}
          `}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-text-muted group-hover:text-brand-primary" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="whitespace-nowrap">Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

