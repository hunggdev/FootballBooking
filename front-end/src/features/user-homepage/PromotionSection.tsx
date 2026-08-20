import { PromotionBanner } from "./PromotionBanner";
import { UpcomingEvents } from "./UpcomingEvents";

export function PromotionSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ================= PROMOTION ================= */}
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-brand-accent" />

                <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                  Ưu đãi
                </span>
              </div>

              <h3 className="text-lg font-bold text-text-primary">
                Ưu đãi đặc biệt
              </h3>
            </div>
          </div>

          <PromotionBanner />
        </div>

        {/* ================= UPCOMING EVENTS ================= */}
        <div className="flex flex-col">
          <UpcomingEvents />
        </div>
      </div>
    </section>
  );
}