import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Match } from "@/types/match";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

interface MatchCardProps {
  match: Match;
}

const statusLabel: Record<Match["status"], string> = {
  OPEN: "Mở",
  MATCHED: "Đã ghép",
  FINISHED: "Đã kết thúc",
  CANCELLED: "Đã hủy",
};

const typeLabel: Record<Match["fieldType"], string> = {
  FIVE: "5 - 5",
  SEVEN: "7 - 7",
  ELEVEN: "11 - 11",
};

const costRuleLabel: Record<Match["costRule"], string> = {
  SPLIT: "Chia đều",
  LOSER_PAYS: "Thua trả",
  WINNER_PAYS: "Thắng trả",
  NEGOTIATE: "Thương lượng",
};

const statusVariant: Record<
  Match["status"],
  "default" | "secondary" | "destructive" | "success"
> = {
  OPEN: "default",
  MATCHED: "secondary",
  FINISHED: "success",
  CANCELLED: "destructive",
};

function TeamAvatars({ count }: { count: number }) {
  const shown = Math.min(count, 3);
  const extra = count - shown;
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
          {Array.from({ length: shown }).map((_, i) => (
            <Avatar key={i} className="h-6 w-6 border">
              <AvatarFallback className="text-[10px]">?</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {extra > 0 && (
          <span className="text-xs text-muted-foreground">+{extra}</span>
        )}
      </div>
    );
  }

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Placeholder image block */}
        <div className="h-28 w-full shrink-0 rounded-md border sm:w-40" />

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {match.status && (
                <Badge variant={statusVariant[match.status]} className="uppercase">
                  {statusLabel[match.status]}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Hình thức: {typeLabel[match.fieldType]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-1">
              <p className="text-sm font-medium">{match.user.fullName}</p>
            </div>
            <span className="text-center text-xs text-muted-foreground">VS</span>
            <div className="space-y-1 sm:text-right">
              <p className="text-sm font-medium">{match.user.fullName}</p>
              <div className="sm:flex sm:justify-end">
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {formatDate(match.createdAt)} 
          </p>

          <Separator />

          {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>📍 {match.location}</span>
              <span>💰 {match.pricePerTeam.toLocaleString("vi-VN")}đ / đội</span>
              <span>
                👥 {match.currentPlayers}/{match.maxPlayers} người
              </span>
            </div>
            <Button size="sm" variant="outline">
              Xem chi tiết
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
