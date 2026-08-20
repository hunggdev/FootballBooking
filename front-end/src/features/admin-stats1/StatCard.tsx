import { Card, CardContent } from "@/components/ui/card";
import type { OverviewStat } from "./types";

interface StatCardProps {
  stat: OverviewStat;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-md border" />
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
        <p className="text-xl font-semibold">{stat.value}</p>
        {stat.helperText && (
          <p className="text-xs text-muted-foreground">{stat.helperText}</p>
        )}
      </CardContent>
    </Card>
  );
}
