import type { StatItem } from "@/features/admin-dashboard/types";

interface Props {
  stat: StatItem;
}

export function StatCard({ stat }: Props) {
  const Icon = stat.icon;
  return (
    <div className="border rounded p-4 flex items-center gap-3">
      <Icon className="h-6 w-6 text-blue-500" />
      <div>
        <p className="text-sm text-gray-500">{stat.label}</p>
        <p className="text-lg font-bold">{stat.value}</p>
        {stat.changeLabel && <p className="text-xs text-green-600">{stat.changeLabel}</p>}
      </div>
    </div>
  );
}
