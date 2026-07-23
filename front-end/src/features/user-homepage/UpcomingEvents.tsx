// src/components/home/UpcomingEvents.tsx
import { Button } from "@/components/ui/button";
import { EventListItem } from "./EventListItem";
import type { EventItem } from "@/types/home.ts";

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
    <div className="flex flex-col gap-4 border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Sự kiện & Giải đấu</h3>
        <Button variant="link" className="text-sm">
          Xem tất cả →
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <EventListItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
