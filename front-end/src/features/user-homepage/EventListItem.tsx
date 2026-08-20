// src/components/home/EventListItem.tsx
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/types/home.ts";

export function EventListItem({ event }: { event: EventItem }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:border-brand-primary/30 hover:bg-surface-hover">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-md border border-border bg-elevated p-2 text-xs text-text-primary">
        <span className="text-lg font-semibold leading-none">{event.day}</span>
        <span className="text-text-muted">{event.month}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{event.title}</p>
        <p className="text-xs text-text-muted">{event.location}</p>
        <p className="text-xs text-text-muted">{event.participants}</p>
      </div>
      <Badge variant="outline" className="shrink-0 border-border text-text-secondary">
        {event.statusLabel}
      </Badge>
    </div>
  );
}
