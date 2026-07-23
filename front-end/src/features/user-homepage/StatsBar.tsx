// src/components/home/StatsBar.tsx
import type { StatItem } from "@/types/home.ts";

const stats: StatItem[] = [
  { id: "1", value: "500+", label: "Sân bóng chất lượng" },
  { id: "2", value: "10K+", label: "Khách hàng hài lòng" },
  { id: "3", value: "50K+", label: "Lượt đặt sân thành công" },
  { id: "4", value: "99.9%", label: "Thời gian hoạt động" },
  { id: "5", value: "24/7", label: "Hỗ trợ khách hàng" },
];

export function StatsBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-2 gap-4 border p-4 sm:grid-cols-3 md:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center gap-1 border p-4 text-center">
            <p className="text-xl font-semibold">{stat.value}</p>
            <p className="text-xs opacity-60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
