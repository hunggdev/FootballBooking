// src/layouts/user/Header.tsx
import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import NotificationDropdown from "@/components/common/Notification";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Zap,
  CalendarCheck,
  ChevronDown,
  User,
  History,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "home", label: "Trang chủ", path: "/user", exact: true },
  { id: "booking", label: "Đặt sân", path: "/user/booking", exact: false },
  { id: "odds", label: "Kèo đấu", path: "/user/match", exact: false },
  { id: "reviews", label: "Đánh giá", path: "/user/reviews", exact: false },
];

export function Header() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-surface/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ── Brand Logo ── */}
        <Link
          to="/user"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[image:var(--token-gradient-brand)] shadow-[0_0_16px_rgba(34,165,90,0.35)]">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-wide bg-[image:var(--token-gradient-brand)] bg-clip-text text-transparent">
              SÂN BÓNG S
            </span>
            <span className="text-[9px] font-medium text-text-muted uppercase tracking-widest">
              Football Booking
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation Menu ── */}
        <nav className="hidden md:flex items-center gap-1.5 bg-elevated/40 p-1 rounded-xl border border-border/50">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[image:var(--token-gradient-brand)] text-white shadow-[0_2px_12px_rgba(34,165,90,0.25)]"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Booking CTA */}
          <Link
            to="/user/booking"
            className="hidden lg:flex items-center gap-1.5 rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(34,165,90,0.3)] hover:bg-brand-primary-hover transition-all duration-200 hover:-translate-y-px"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            <span>Đặt sân ngay</span>
          </Link>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/80 bg-surface-hover/60 p-1.5 pr-2.5 text-left transition-all duration-200 hover:border-border hover:bg-surface-hover focus:outline-hidden"
            >
              <Avatar className="h-7 w-7 border border-border/60">
                <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden flex-col leading-tight sm:flex">
                <span className="max-w-[110px] truncate text-xs font-semibold text-text-primary">
                  {user?.fullName || "Khách hàng"}
                </span>
                <span className="text-[10px] text-text-muted">
                  {isAdmin ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>

              <ChevronDown
                className={`h-3.5 w-3.5 text-text-muted opacity-70 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-border bg-surface p-1.5 text-text-primary shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95">
                {/* Header Info */}
                <div className="p-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {user?.fullName || "Khách hàng"}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      {user?.email || "customer@sanbongs.vn"}
                    </p>
                    <div className="mt-1.5">
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0.5 text-[10px] font-medium border ${
                          isAdmin
                            ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                            : "border-brand-accent/30 bg-brand-accent/10 text-brand-accent"
                        }`}
                      >
                        {isAdmin ? "Admin Panel" : "Thành viên VIP"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="my-1 bg-border/60" />

                {/* Navigation Items */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/account");
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary text-left"
                  >
                    <User className="h-3.5 w-3.5 text-text-muted" />
                    <span>Thông tin tài khoản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/history");
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary text-left"
                  >
                    <History className="h-3.5 w-3.5 text-text-muted" />
                    <span>Lịch sử đặt sân</span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-brand-primary transition-colors duration-150 hover:bg-brand-primary/10 text-left"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                      <span>Vào Trang Quản Trị</span>
                    </button>
                  )}
                </div>

                <Separator className="my-1 bg-border/60" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-status-danger transition-colors duration-150 hover:bg-status-danger-bg hover:text-status-danger text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex md:hidden p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "bg-[image:var(--token-gradient-brand)] text-white"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-border">
            <Link
              to="/user/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-2.5 text-xs font-semibold text-white shadow-xs"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Đặt sân bóng ngay</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
