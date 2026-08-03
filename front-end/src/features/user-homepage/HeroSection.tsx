import { HeroSearchForm } from "./HeroSearchForm";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
            <Zap className="h-3.5 w-3.5" /> Hệ Thống Đặt Sân Bóng Đá Trực Tuyến
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Đặt Sân Cực Nhanh, <br />
            <span className="text-emerald-500">Giữ Chỗ Tự Động 10 Phút</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Tìm kiếm sân bóng phù hợp, chọn khung giờ lý tưởng và dịch vụ đi kèm. Hệ thống hỗ trợ tạm giữ chỗ 10 phút giúp bạn hoàn tất xác nhận nhanh chóng.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold">Giữ chỗ 10 phút tự động</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold">Thanh toán minh bạch</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3 shadow-xs">
              <Zap className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold">Đánh giá thực tế</span>
            </div>
          </div>
        </div>

        {/* Right column: Search form */}
        <div className="lg:col-span-5">
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}
