import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tournament } from "./types";

interface FeaturedTournamentsProps {
  tournaments: Tournament[];
}

export function FeaturedTournaments({ tournaments }: FeaturedTournamentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Giải đấu nổi bật</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Xem tất cả →
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tournaments.map((t) => (
          <div key={t.id} className="flex items-start gap-3 rounded-md border p-3">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md border text-center">
              <span className="text-sm font-semibold leading-none">{t.day}</span>
              <span className="text-[10px] uppercase text-muted-foreground">
                {t.month}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.venue}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t.teamCount} đội tham gia
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {t.statusLabel}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
