// src/components/home/EventListItem.tsx
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/types/home.ts";

export function EventListItem({ event }: { event: EventItem }) {
  return (
    <div className="flex items-center gap-4 border p-4">
      <div className="flex w-14 shrink-0 flex-col items-center border p-2 text-xs">
        <span className="text-lg font-semibold leading-none">{event.day}</span>
        <span className="opacity-60">{event.month}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        <p className="text-xs opacity-60">{event.location}</p>
        <p className="text-xs opacity-60">{event.participants}</p>
      </div>
      <Badge variant="outline" className="shrink-0">
        {event.statusLabel}
      </Badge>
    </div>
  );
}
