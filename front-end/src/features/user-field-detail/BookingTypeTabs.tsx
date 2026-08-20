import { cn } from "@/lib/utils";
import type { BookingType } from "./booking";

const TABS: { value: BookingType; label: string }[] = [
  { value: "ONE_TIME", label: "Đặt 1 lần" },
  { value: "LONG_TERM", label: "Đặt dài hạn" },
];

interface BookingTypeTabsProps {
  value: BookingType;
  onChange: (value: BookingType) => void;
  disabled?: boolean;
}

export function BookingTypeTabs({
  value,
  onChange,
  disabled,
}: BookingTypeTabsProps) {
  return (
    <div className="flex gap-2 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(tab.value)}
          className={cn(
            "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200",
            value === tab.value
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-text-muted hover:border-brand-primary/40 hover:text-text-primary",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}