// src/layouts/user/FooterSection.tsx
import { Link } from "react-router-dom";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function FooterSection() {
  return (
    <footer className="w-full border-t border-border/60 bg-deep text-text-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* ================= BRAND ================= */}
          <div className="space-y-4 lg:col-span-4">
            <Link to="/user" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--token-gradient-brand)] shadow-[0_0_18px_rgba(34,165,90,0.35)]">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-base font-bold leading-none bg-[image:var(--token-gradient-brand)] bg-clip-text text-transparent">
                  SÂN BÓNG S
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-text-muted">
                  Football Booking Online
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-text-muted">
              Nền tảng đặt sân bóng đá và tìm đối giao lưu thể thao chuyên nghiệp hàng đầu. Hệ thống sân hiện đại, bảng giờ real-time và tiện ích đặt cọc trực tuyến linh hoạt.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-status-success/30 bg-status-success-bg px-2.5 py-1 text-[11px] font-semibold text-status-success">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                Hệ thống sẵn sàng phục vụ
              </span>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Liên kết nhanh
            </p>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  to="/user"
                  className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="h-3 w-3 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/user/booking"
                  className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="h-3 w-3 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  Đặt sân bóng
                </Link>
              </li>
              <li>
                <Link
                  to="/user/match"
                  className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="h-3 w-3 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  Tìm kèo giao lưu
                </Link>
              </li>
              <li>
                <Link
                  to="/user/reviews"
                  className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="h-3 w-3 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  Đánh giá sân bóng
                </Link>
              </li>
              <li>
                <Link
                  to="/user/history"
                  className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <ChevronRight className="h-3 w-3 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  Lịch sử đặt sân
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= POLICIES & SUPPORT ================= */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Hỗ trợ & Chính sách
            </p>
            <ul className="flex flex-col gap-2 text-xs text-text-muted">
              <li className="hover:text-brand-primary cursor-pointer transition-colors">
                Hướng dẫn đặt sân và thanh toán cọc
              </li>
              <li className="hover:text-brand-primary cursor-pointer transition-colors">
                Quy định hủy sân và hoàn tiền
              </li>
              <li className="hover:text-brand-primary cursor-pointer transition-colors">
                Nội quy thi đấu & bảo quản sân cỏ
              </li>
              <li className="hover:text-brand-primary cursor-pointer transition-colors">
                Chính sách bảo mật thông tin
              </li>
              <li className="hover:text-brand-primary cursor-pointer transition-colors">
                Điều khoản sử dụng dịch vụ
              </li>
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Thông tin liên hệ
            </p>
            <div className="flex flex-col gap-3 text-xs text-text-muted">
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span>
                  Hotline đặt sân: <strong className="text-text-primary font-semibold">090 123 4567</strong>
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span className="leading-relaxed">
                  Nguyễn Trãi, Phường Tây Lộc, Thành phố Huế
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span>contact@sanbongs.vn</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent" />
                <span className="leading-relaxed">
                  05:00 - 23:00 (Mở cửa tất cả các ngày)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM COPYRIGHT BAR ================= */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between text-text-muted">
          <p>
            © 2026 <span className="font-semibold text-text-primary">Sân Bóng S</span>.&nbsp;
            <span className="bg-[image:var(--token-gradient-brand)] bg-clip-text text-transparent font-medium">
              Tất cả quyền được bảo lưu.
            </span>
          </p>

          <div className="flex items-center gap-5 text-xs text-text-muted">
            <span className="hover:text-brand-primary transition-colors cursor-pointer">
              Chính sách bảo mật
            </span>
            <span>•</span>
            <span className="hover:text-brand-primary transition-colors cursor-pointer">
              Điều khoản dịch vụ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}