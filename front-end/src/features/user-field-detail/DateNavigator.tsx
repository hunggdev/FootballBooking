import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateNavigatorProps {
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

export function DateNavigator({ dateLabel, onPrev, onNext }: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
      <Button variant="outline" size="sm" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" /> Hôm qua
      </Button>
      <span className="text-sm font-semibold">{dateLabel}</span>
      <Button variant="outline" size="sm" onClick={onNext}>
        Ngày mai <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}