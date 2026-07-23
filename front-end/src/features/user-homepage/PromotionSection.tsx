// src/components/home/PromotionSection.tsx
import { PromotionBanner } from "./PromotionBanner";
import { UpcomingEvents } from "./UpcomingEvents";

export function PromotionSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Ưu đãi đặc biệt</h3>
          </div>
          <PromotionBanner />
        </div>
        <UpcomingEvents />
      </div>
    </section>
  );
}
