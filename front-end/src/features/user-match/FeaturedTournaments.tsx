import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tournament } from "./types";

interface FeaturedTournamentsProps {
  tournaments: Tournament[];
}

export function FeaturedTournaments({ tournaments }: FeaturedTournamentsProps) {
  return (
    <Card className="border-border bg-surface text-text-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-text-primary">
          Giải đấu nổi bật
        </CardTitle>

        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs text-brand-primary hover:text-brand-primary-hover"
        >
          Xem tất cả →
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="
              flex
              items-start
              gap-3
              rounded-md
              border
              border-border
              bg-elevated
              p-3
              transition-colors
              hover:border-brand-primary/40
              hover:bg-surface-hover
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-md
                border
                border-border
                bg-surface
                text-center
              "
            >
              <span className="text-sm font-semibold leading-none text-text-primary">
                {t.day}
              </span>

              <span className="text-[10px] uppercase text-text-muted">
                {t.month}
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {t.title}
              </p>

              <p className="text-xs text-text-muted">
                {t.venue}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {t.teamCount} đội tham gia
                </span>

                <Badge
                  variant="outline"
                  className="
                    border-brand-primary/40
                    bg-brand-primary/10
                    text-[10px]
                    text-brand-primary
                  "
                >
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