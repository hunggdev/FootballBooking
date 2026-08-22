import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ExternalLink,
  User,
  History,
  LogOut,
  Clock,
  ShieldCheck,
} from "lucide-react";
import NotificationDropdown from "@/components/common/Notification";
import { useAuthStore } from "@/stores/useAuthStore";

const liveUpdates = [
  {
    id: "1",
    text: "#KH1032 vừa đặt Sân A lúc 18:00 - 19:00",
    time: "2 phút trước",
  },
  {
    id: "2",
    text: "#KH0987 vừa thanh toán cọc Sân B lúc 20:00 - 21:00",
    time: "5 phút trước",
  },
  {
    id: "3",
    text: "#KH1104 vừa gửi đánh giá 5 sao cho Sân C",
    time: "12 phút trước",
  },
  { id: "4", text: "Hệ thống sân đang hoạt động 100% công suất", time: "" },
];

export function AdminTopHeader() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
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

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = now.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setCurrentTime(`${timeString} • ${dateString}`);
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Ticker animation - cycle through items without horizontal scroll overflow
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(tickerInterval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full min-w-0 max-w-full items-center justify-between border-b border-border/60 bg-surface/90 px-4 sm:px-6 backdrop-blur-md shadow-xs">
      {/* ── Left side: Live system status & Cycling ticker ── */}
      <div className="flex flex-1 items-center gap-3 min-w-0 overflow-hidden pr-3">
        {/* Live Status Pill */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-status-success/30 bg-status-success-bg px-2 py-0.5 text-[11px] font-semibold text-status-success">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success"></span>
          </span>
          <span className="tracking-wide">LIVE</span>
        </div>

        {/* Dynamic single-line ticker (overflow protected) */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div
            key={activeTickerIndex}
            className="flex items-center gap-1.5 text-xs text-text-secondary truncate animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            <span className="truncate">
              {liveUpdates[activeTickerIndex].text}
            </span>
            {liveUpdates[activeTickerIndex].time && (
              <span className="shrink-0 font-medium text-brand-accent text-[11px]">
                ({liveUpdates[activeTickerIndex].time})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Right side: Quick actions, Clock & Admin Profile ── */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Real-time Clock */}
        {currentTime && (
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-hover/40 px-3 py-1.5 text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5 text-brand-primary" />
            <span>{currentTime}</span>
          </div>
        )}

        {/* Quick link: User/Client Portal */}
        <Link
          to="/user"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-hover/60 px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-200 hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary"
          title="Mở trang đặt sân cho khách hàng"
        >
          <span>Trang đặt sân</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* Admin Profile Dropdown */}
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
                {user?.fullName || "Admin"}
              </span>

              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                <ShieldCheck className="h-2.5 w-2.5 text-brand-primary" />
                Quản trị viên
              </span>
            </div>

            <ChevronDown
              className={`h-3.5 w-3.5 text-text-muted opacity-70 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Content */}
          {profileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-border bg-surface p-1.5 text-text-primary shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95">
              {/* Header Info */}
              <div className="p-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-text-primary">
                    {user?.fullName || "Quản trị viên"}
                  </p>

                  <p className="truncate text-[11px] text-text-muted">
                    {user?.email || "admin@sanbongs.com"}
                  </p>

                  <div className="mt-1.5">
                    <Badge
                      variant="outline"
                      className="border-brand-primary/30 bg-brand-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-primary"
                    >
                      Admin Panel
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-1 bg-border/60" />

              {/* Menu Items */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/user");
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary text-left"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
                  <span>Xem giao diện khách hàng</span>
                </button>

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

                {/* <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/bookings/history");
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary text-left"
                >
                  <History className="h-3.5 w-3.5 text-text-muted" />
                  <span>Lịch sử đặt sân</span>
                </button> */}
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
      </div>
    </header>
  );
}
