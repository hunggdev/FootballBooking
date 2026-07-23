// src/components/admin/dashboard/StatCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { StatItem } from "./types";

export function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;
  return (
    <Card className="border">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex h-8 w-8 items-center justify-center border">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs opacity-60">{stat.label}</p>
        <p className="text-xl font-semibold">{stat.value}</p>
        {stat.changeLabel && (
          <p className="text-xs opacity-60">{stat.changeLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
