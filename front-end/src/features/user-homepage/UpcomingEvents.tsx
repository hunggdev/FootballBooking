// src/components/home/UpcomingEvents.tsx
import { Button } from "@/components/ui/button";
import { EventListItem } from "./EventListItem";
import type { EventItem } from "@/types/home.ts";
import { CalendarDays, ArrowRight } from "lucide-react";

const events: EventItem[] = [
  {
    id: "1",
    day: "25",
    month: "JUL",
    title: "Giải bóng đá sân 7 mở rộng 2026",
    location: "Sân S - Quận Thanh Khê",
    participants: "32 đội tham gia",
    statusLabel: "Đang mở đăng ký",
  },
  {
    id: "2",
    day: "15",
    month: "AUG",
    title: "Giải bóng đá giao hữu các CLB",
    location: "Sân A Plus - Quận Liên Chiểu",
    participants: "16 đội tham gia",
    statusLabel: "Sắp diễn ra",
  },
];

export function UpcomingEvents() {
  return (
    <div
      className="
        flex
        h-full
        flex-col
        gap-4
        rounded-xl
        border
        border-border
        bg-surface
        p-5
        text-text-primary
        shadow-sm
        transition-all
        duration-300
        hover:border-brand-primary/30
        hover:shadow-md
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-primary" />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-brand-primary
              "
            >
              Sự kiện
            </span>
          </div>

          <h3 className="text-lg font-bold text-text-primary">
            Sự kiện & Giải đấu
          </h3>
        </div>

        <Button
          variant="ghost"
          className="
            shrink-0
            px-2
            text-xs
            font-semibold
            text-brand-primary
            hover:bg-brand-primary/10
            hover:text-brand-primary
          "
        >
          Xem tất cả
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Event list */}
      <div className="flex flex-1 flex-col gap-3">
        {events.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </div>
  );
}