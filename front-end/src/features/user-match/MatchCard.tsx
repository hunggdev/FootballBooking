// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

const statusClass: Record<Match["status"], string> = {
  OPEN: "border-status-success/30 bg-status-success/10 text-status-success",
  MATCHED: "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  FINISHED: "border-text-muted/30 bg-text-muted/10 text-text-secondary",
  CANCELLED: "border-status-danger/30 bg-status-danger/10 text-status-danger",
};

// function TeamAvatars({ count }: { count: number }) {
//   const shown = Math.min(count, 3);
//   const extra = count - shown;

//   return (
//     <div className="flex items-center gap-1">
//       <div className="flex -space-x-2">
//         {Array.from({ length: shown }).map((_, i) => (
//           <Avatar
//             key={i}
//             className="h-6 w-6 border-2 border-surface bg-elevated"
//           >
//             <AvatarFallback className="bg-elevated text-[10px] text-text-muted">
//               ?
//             </AvatarFallback>
//           </Avatar>
//         ))}
//       </div>

//       {extra > 0 && (
//         <span className="text-xs text-text-muted">
//           +{extra}
//         </span>
//       )}
//     </div>
//   );
// }

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="group border-border bg-surface text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Placeholder image */}
        <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-md border border-border bg-elevated sm:w-40">
          <span className="text-xs text-text-muted">
            Hình ảnh sân
          </span>
        </div>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                className={`border ${statusClass[match.status]}`}
              >
                {statusLabel[match.status]}
              </Badge>

              <span className="text-xs text-text-secondary">
                Hình thức:{" "}
                <span className="font-medium text-text-primary">
                  {typeLabel[match.fieldType]}
                </span>
              </span>
            </div>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">
                {match.user.fullName}
              </p>

              <span className="text-xs text-text-muted">
                Đội của bạn
              </span>
            </div>

            <span className="rounded-md border border-border bg-elevated px-3 py-1 text-xs font-bold text-brand-primary">
              VS
            </span>

            <div className="space-y-1 sm:text-right">
              <p className="text-sm font-semibold text-text-primary">
                Đang chờ đối thủ
              </p>

              <span className="text-xs text-text-muted">
                Chưa có đội tham gia
              </span>
            </div>
          </div>

          {/* Date */}
          <p className="text-xs text-text-muted">
            Ngày tạo:{" "}
            <span className="text-text-secondary">
              {formatDate(match.createdAt)}
            </span>
          </p>

          <Separator className="bg-border" />
        </div>
      </CardContent>
    </Card>
  );
}