import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateNavigatorProps {
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev?: boolean;
}

export function DateNavigator({
  dateLabel,
  onPrev,
  onNext,
  disabledPrev = false,
}: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={disabledPrev}
        className="
          border-border
          bg-surface
          text-text-secondary
          hover:bg-surface-hover
          hover:text-text-primary
        "
      >
        <ChevronLeft className="h-4 w-4" />
        Hôm qua
      </Button>

      <span className="text-sm font-semibold text-text-primary">
        {dateLabel}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className="
          border-border
          bg-surface
          text-text-secondary
          hover:bg-surface-hover
          hover:text-text-primary
        "
      >
        Ngày mai
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}