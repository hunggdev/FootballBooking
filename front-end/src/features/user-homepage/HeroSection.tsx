// src/components/home/HeroSection.tsx
import { HeroSearchForm } from "./HeroSearchForm";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl border px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: headline + supporting image placeholder */}
        <div className="flex flex-col justify-center gap-4 border p-6">
          <h1 className="text-2xl font-semibold">Tiêu đề chính (Headline)</h1>
          <p className="text-sm opacity-70">Tiêu đề phụ (Subheadline)</p>
          <p className="text-sm opacity-70">
            Đoạn mô tả ngắn giới thiệu dịch vụ.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex-1 border p-3">Điểm nổi bật 1</div>
            <div className="flex-1 border p-3">Điểm nổi bật 2</div>
            <div className="flex-1 border p-3">Điểm nổi bật 3</div>
          </div>
          <div className="mt-4 flex h-64 items-center justify-center border border-dashed text-sm opacity-60">
            [ Hình ảnh minh họa ]
          </div>
        </div>

        {/* Right: search form */}
        <div className="flex items-center">
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}
