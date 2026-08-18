// src/components/home/FooterSection.tsx

import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const columns = [
  {
    id: "links",
    title: "LIÊN KẾT NHANH",
    items: ["Trang chủ", "Đặt sân", "Kèo đấu", "Tin tức", "Liên hệ"],
  },
  {
    id: "support",
    title: "HỖ TRỢ",
    items: [
      "Hướng dẫn đặt sân",
      "Quy định sử dụng",
      "Chính sách bảo mật",
      "Điều khoản dịch vụ",
      "Câu hỏi thường gặp",
    ],
  },
];

export function FooterSection() {
  return (
    <footer
      className="
        w-full
        border-t
        border-border
        bg-deep
        text-text-secondary
      "
    >
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >
          {/* ================= BRAND ================= */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              {/* Logo */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-brand-primary
                  to-brand-accent
                  text-lg
                  font-extrabold
                  text-white
                  shadow-sm
                "
              >
                S
              </div>

              {/* Brand */}
              <div>
                <p className="text-sm font-extrabold leading-4 text-text-primary">
                  SÂN BÓNG{" "}
                  <span className="text-brand-accent">S</span>
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-text-muted
                  "
                >
                  FOOTBALL BOOKING
                </p>
              </div>
            </div>

            <p className="max-w-xs text-xs leading-5 text-text-muted">
              Hệ thống đặt sân bóng đá trực tuyến giúp bạn dễ dàng
              tìm kiếm sân, chọn khung giờ và hoàn tất đặt sân
              nhanh chóng.
            </p>
          </div>

          {/* ================= LINKS ================= */}
          {columns.map((col) => (
            <div key={col.id}>
              <p
                className="
                  mb-4
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-text-primary
                "
              >
                {col.title}
              </p>

              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="
                        text-left
                        text-xs
                        text-text-muted
                        transition-colors
                        duration-200
                        hover:text-brand-primary
                      "
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ================= CONTACT ================= */}
          <div>
            <p
              className="
                mb-4
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-text-primary
              "
            >
              LIÊN HỆ
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span className="text-xs text-text-muted">
                  090 123 4567
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span className="text-xs leading-5 text-text-muted">
                  Nguyễn Trãi, Thành phố Huế
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                <span className="break-all text-xs text-text-muted">
                  contact@sanbongs.vn
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent" />
                <span className="text-xs leading-5 text-text-muted">
                  07:00 - 22:00
                  <br />
                  Tất cả các ngày
                </span>
              </div>
            </div>
          </div>

          {/* ================= DOWNLOAD APP ================= */}
          <div>
            <p
              className="
                mb-4
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-text-primary
              "
            >
              TẢI APP
            </p>

            <p className="mb-3 text-xs leading-5 text-text-muted">
              Đặt sân nhanh chóng ngay trên điện thoại.
            </p>

            <div className="flex flex-col gap-2">
              {/* App Store */}
              <button
                type="button"
                className="
                  rounded-lg
                  border
                  border-border
                  bg-surface
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-200
                  hover:border-brand-primary/50
                  hover:bg-surface-hover
                "
              >
                <p className="text-[9px] text-text-muted">
                  Tải xuống trên
                </p>

                <p className="text-sm font-semibold text-text-primary">
                  App Store
                </p>
              </button>

              {/* Google Play */}
              <button
                type="button"
                className="
                  rounded-lg
                  border
                  border-border
                  bg-surface
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-200
                  hover:border-brand-accent/50
                  hover:bg-surface-hover
                "
              >
                <p className="text-[9px] text-text-muted">
                  TẢI XUỐNG TRÊN
                </p>

                <p className="text-sm font-semibold text-text-primary">
                  Google Play
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-3
            border-t
            border-border
            pt-5
            text-xs
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-text-muted">
            © 2026{" "}
            <span className="font-semibold text-text-secondary">
              Sân Bóng
            </span>{" "}
            <span className="font-semibold text-brand-accent">
              S
            </span>
            . Tất cả quyền được bảo lưu.
          </p>

          <div className="flex items-center gap-4 text-text-muted">
            <button
              type="button"
              className="transition-colors hover:text-brand-primary"
            >
              Chính sách bảo mật
            </button>

            <button
              type="button"
              className="transition-colors hover:text-brand-primary"
            >
              Điều khoản
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}