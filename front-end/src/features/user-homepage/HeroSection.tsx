import { HeroSearchForm } from "./HeroSearchForm";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-border-subtle
        bg-base
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-10
          h-72
          w-72
          rounded-full
          bg-brand-primary/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-brand-accent/5
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl px-10 py-10 md:py-14 lg:py-16 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,transparent_80%,transparent_20%,rgba(0,0,0,0.85)_100%),url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10
            lg:grid-cols-12
            lg:gap-12
          "
        >
          {/* ================= LEFT ================= */}
          <div className="space-y-6 lg:col-span-7 "> 
            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-brand-primary/30
                bg-brand-primary/10
                px-3
                py-1.5
                text-xs
                font-semibold
                text-brand-primary
              "
            >
              <Zap className="h-3.5 w-3.5" />
              Hệ thống đặt sân bóng đá trực tuyến
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1
                className="
                  max-w-3xl
                  text-3xl
                  font-extrabold
                  leading-[1.15]
                  tracking-tight
                  text-text-primary
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Đặt sân cực nhanh,
                <br />
                <span
                  className="
                    bg-gradient-to-r
                    from-brand-primary
                    to-brand-accent
                    bg-clip-text
                    text-transparent
                  "
                >
                  giữ chỗ tự động 10 phút
                </span>
              </h1>
            </div>

            {/* Description */}
            <p
              className="
                max-w-xl
                text-sm
                leading-6
                text-text-secondary
                sm:text-base
              "
            >
              Tìm kiếm sân bóng phù hợp, chọn khung giờ lý tưởng và dịch vụ đi
              kèm. Hệ thống hỗ trợ tạm giữ chỗ 10 phút giúp bạn hoàn tất xác
              nhận nhanh chóng.
            </p>

            {/* Highlights */}
            <div
              className="
                grid
                grid-cols-1
                gap-3
                pt-2
                sm:grid-cols-3
              "
            >
              {/* Item 1 */}
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-border
                  bg-surface
                  p-3
                  transition-all
                  duration-200
                  hover:border-brand-primary/40
                  hover:bg-surface-hover
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-status-success-bg
                  "
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                </div>

                <span
                  className="
                    text-xs
                    font-semibold
                    leading-4
                    text-text-primary
                  "
                >
                  Giữ chỗ 10 phút
                  <br />
                  tự động
                </span>
              </div>

              {/* Item 2 */}
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-border
                  bg-surface
                  p-3
                  transition-all
                  duration-200
                  hover:border-brand-primary/40
                  hover:bg-surface-hover
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-status-info-bg
                  "
                >
                  <ShieldCheck className="h-4 w-4 text-status-info" />
                </div>

                <span
                  className="
                    text-xs
                    font-semibold
                    leading-4
                    text-text-primary
                  "
                >
                  Thanh toán
                  <br />
                  minh bạch
                </span>
              </div>

              {/* Item 3 */}
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-border
                  bg-surface
                  p-3
                  transition-all
                  duration-200
                  hover:border-brand-accent/40
                  hover:bg-surface-hover
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-status-warning-bg
                  "
                >
                  <Zap className="h-4 w-4 text-brand-accent" />
                </div>

                <span
                  className="
                    text-xs
                    font-semibold
                    leading-4
                    text-text-primary
                  "
                >
                  Đánh giá
                  <br />
                  thực tế
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-5">
            <HeroSearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}
