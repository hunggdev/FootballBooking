// src/layouts/user/TopBar.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const liveUpdates = [
  {
    id: "1",
    text: "#20 hủy giữ Sân A lúc 18:00 - 19:00",
    time: "2 phút trước",
  },
  {
    id: "2",
    text: "#12 vừa giữ chỗ Sân E lúc 20:00 - 21:00",
    time: "5 phút trước",
  },
  {
    id: "3",
    text: "#1 vừa xác nhận đặt cọc thành công", 
    time: "8 phút trước",
  },
  {
    id: "4",
    text: "Hệ thống sân bóng mở cửa đón khách từ 05:00 - 23:00",
    time: "",
  },
];

export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  // Ticker animation
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(tickerInterval);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <div className="w-full border-b border-border/50 bg-deep text-text-secondary">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 text-xs">
        {/* Left: Live Notification Ticker */}
        <div className="flex flex-1 items-center gap-2.5 min-w-0 pr-4 overflow-hidden">
          <Badge
            variant="outline"
            className="shrink-0 gap-1 rounded-full border-status-success/30 bg-status-success-bg px-2 py-0.5 text-[10px] font-bold text-status-success"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-success"></span>
            </span>
            LIVE
          </Badge>

          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              key={activeTickerIndex}
              className="flex items-center gap-1.5 text-xs text-text-secondary truncate animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <span className="truncate">
                {liveUpdates[activeTickerIndex].text}
              </span>
              {liveUpdates[activeTickerIndex].time && (
                <span className="shrink-0 font-semibold text-brand-accent text-[11px]">
                  ({liveUpdates[activeTickerIndex].time})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Contact & Quick Admin Switch */}
        <div className="hidden md:flex shrink-0 items-center gap-4 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-brand-primary" />
            <span>Hotline: <strong className="text-text-primary font-semibold">090 123 4567</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-brand-accent" />
            <span>05:00 - 23:00</span>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[11px] font-medium text-brand-primary hover:bg-brand-primary/20 transition-colors"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Trang quản trị</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}