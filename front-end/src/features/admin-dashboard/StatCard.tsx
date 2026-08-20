import type { StatItem } from "@/features/admin-dashboard/types";

interface Props {
  stat: StatItem;
  toneClass?: string;
}

export function StatCard({ stat, toneClass }: Props) {
  const Icon = stat.icon;

  return (
    <div className="group rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border ${toneClass ?? "bg-brand-primary/10 text-brand-primary"
            }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-muted">
            {stat.label}
          </p>
          <p className="text-lg font-bold tracking-tight text-text-primary">
            {stat.value.toLocaleString("vi-VN")}
          </p>
          {stat.changeLabel && (
            <p className="mt-0.5 text-xs font-medium text-status-success">
              {stat.changeLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
