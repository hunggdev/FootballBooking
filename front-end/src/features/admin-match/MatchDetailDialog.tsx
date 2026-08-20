import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Match } from "@/types/match";
import { useMatch } from "@/stores/useMatchStore";
import { formatDateTime } from "@/lib/utils";
import {
  Swords,
  Users,
  UserCheck,
  Coins,
  Clock,
  FileText,
  CalendarDays,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  OPEN: {
    label: "Đang tìm đối (Mở)",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  MATCHED: {
    label: "Đã ghép đối",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  FINISHED: {
    label: "Đã kết thúc",
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
  },
  CANCELLED: {
    label: "Đã hủy kèo",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  },
};

const typeLabel: Record<string, { title: string; subtitle: string }> = {
  FIVE: { title: "Sân 5 người", subtitle: "5 vs 5" },
  SEVEN: { title: "Sân 7 người", subtitle: "7 vs 7" },
  ELEVEN: { title: "Sân 11 người", subtitle: "11 vs 11" },
};

const costRuleConfig: Record<
  string,
  { label: string; desc: string; badgeClass: string }
> = {
  SPLIT: {
    label: "Chia đều tiền sân",
    desc: "Mỗi bên 50% chi phí",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
  },
  LOSER_PAYS: {
    label: "Thua trả toàn bộ",
    desc: "Đội thua trả 100% tiền sân",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400",
  },
  WINNER_PAYS: {
    label: "Thắng trả toàn bộ",
    desc: "Đội thắng khao tiền sân",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
  },
  NEGOTIATE: {
    label: "Thương lượng",
    desc: "Thỏa thuận khi gặp mặt",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",
  },
};

interface MatchDetailDialogProps {
  matchId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchDetailDialog({
  matchId,
  open,
  onOpenChange,
}: MatchDetailDialogProps) {
  const { data, isLoading, error } = useMatch(matchId ?? 0);
  const match: Match | undefined = data?.match;

  const getAgeDisplay = (min?: number | null, max?: number | null) => {
    if (min && max) return `${min} - ${max} tuổi`;
    if (min) return `Từ ${min} tuổi trở lên`;
    if (max) return `Dưới ${max} tuổi`;
    return "Mọi lứa tuổi";
  };

  const currentStatus = match?.status ? statusConfig[match.status] : null;
  const currentCostRule = match?.costRule ? costRuleConfig[match.costRule] : null;
  const currentFieldType = match?.fieldType ? typeLabel[match.fieldType] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden gap-0">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600/10 via-primary/5 to-transparent p-6 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    Chi tiết kèo đấu #{matchId}
                  </DialogTitle>
                  {match?.createdAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Tạo ngày {formatDateTime(match.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {currentStatus && (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${currentStatus.className}`}
                >
                  {currentStatus.label}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Đang tải thông tin trận đấu...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Không thể tải thông tin trận đấu này. Vui lòng thử lại sau.</p>
            </div>
          )}

          {match && (
            <div className="space-y-6">
              {/* Creator Information Card */}
              <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Người tạo kèo / Đội trưởng
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                      {match.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-foreground">
                        {match.user?.fullName || "Chưa có tên"}
                      </p>
                      <Badge variant="secondary" className="text-[10px] px-2 py-0 font-normal">
                        Chủ phòng
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                      {match.user?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 opacity-70" />
                          {match.user.email}
                        </span>
                      )}
                      {match.user?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 opacity-70" />
                          {match.user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Criteria & Specs */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Thông số & Điều kiện kèo đấu
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Field Type */}
                  <div className="flex items-start gap-3.5 rounded-xl border bg-card p-3.5 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Quy mô sân</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {currentFieldType?.title || "Chưa xác định"}
                      </p>
                      <p className="text-xs text-muted-foreground">{currentFieldType?.subtitle || "--"}</p>
                    </div>
                  </div>

                  {/* Age Requirement */}
                  <div className="flex items-start gap-3.5 rounded-xl border bg-card p-3.5 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Độ tuổi yêu cầu</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {getAgeDisplay(match.minAge, match.maxAge)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.minAge && match.maxAge ? "Khoảng độ tuổi phù hợp" : "Linh hoạt"}
                      </p>
                    </div>
                  </div>

                  {/* Cost Rule */}
                  <div className="flex items-start gap-3.5 rounded-xl border bg-card p-3.5 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Hình thức trả tiền sân</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {currentCostRule?.label || "Thương lượng"}
                      </p>
                      <p className="text-xs text-muted-foreground">{currentCostRule?.desc || "--"}</p>
                    </div>
                  </div>

                  {/* Time Note */}
                  <div className="flex items-start gap-3.5 rounded-xl border bg-card p-3.5 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Thời gian dự kiến</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {match.timeNote || "Chưa cập nhật thời gian"}
                      </p>
                      <p className="text-xs text-muted-foreground">Theo ghi chú của chủ kèo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description / Additional Notes */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Mô tả & Lời nhắn
                </p>
                <div className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed text-foreground">
                  {match.description ? (
                    <p className="whitespace-pre-line">{match.description}</p>
                  ) : (
                    <p className="italic text-muted-foreground text-xs">
                      Không có ghi chú bổ sung nào từ chủ kèo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <Separator />
        <div className="flex items-center justify-between p-4 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {match?.updatedAt && `Cập nhật lần cuối: ${formatDateTime(match.updatedAt)}`}
          </p>
          <Button
            variant="outline"
            className="px-5 font-medium"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

