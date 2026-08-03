import { StatCard } from "./StatCard";
import type { StatItem } from "@/features/admin-dashboard/types";

interface Props {
  stats: StatItem[];
}

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}