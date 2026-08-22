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
    label: "Đang tìm đối",
    className: "border-status-success/20 bg-status-success-bg text-status-success",
  },
  MATCHED: {
    label: "Đã ghép đối",
    className: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  },
  FINISHED: {
    label: "Đã kết thúc",
    className: "border-status-info/20 bg-status-info-bg text-status-info",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-status-danger/20 bg-status-danger-bg text-status-danger",
  },
};

const typeLabel: Record<string, { title: string; subtitle: string }> = {
  FIVE: { title: "Sân 5 người", subtitle: "5 vs 5" },
  SEVEN: { title: "Sân 7 người", subtitle: "7 vs 7" },
  ELEVEN: { title: "Sân 11 người", subtitle: "11 vs 11" },
};

const costRuleConfig: Record<
  string,
  { label: string; desc: string }
> = {
  SPLIT: {
    label: "Chia đều tiền sân",
    desc: "Mỗi bên 50% chi phí",
  },
  LOSER_PAYS: {
    label: "Thua trả toàn bộ",
    desc: "Đội thua trả 100% tiền sân",
  },
  WINNER_PAYS: {
    label: "Thắng trả toàn bộ",
    desc: "Đội thắng khao tiền sân",
  },
  NEGOTIATE: {
    label: "Thương lượng",
    desc: "Thỏa thuận khi gặp mặt",
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

  const currentStatus = match?.status
    ? statusConfig[match.status.toUpperCase()]
    : null;
  const currentCostRule = match?.costRule
    ? costRuleConfig[match.costRule.toUpperCase()]
    : null;
  const currentFieldType = match?.fieldType
    ? typeLabel[match.fieldType.toUpperCase()]
    : null;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết trận đấu #{matchId}
                  </DialogTitle>
                  {match?.createdAt && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              <p className="text-sm font-medium">Đang tải thông tin trận đấu...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger-bg p-4 text-status-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Không thể tải thông tin trận đấu. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {match && (
            <div className="space-y-6">
              {/* Creator Info Card */}
              <div className="rounded-xl border border-border bg-elevated/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Thông tin chủ kèo
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-base">
                      {getInitials(match.user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">
                        {match.user?.fullName || "Chưa có tên"}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 font-medium border-brand-accent/30 bg-brand-accent/10 text-brand-accent"
                      >
                        Chủ kèo
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-text-muted">
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

              {/* Participant Info Card (if matched/joined) */}
              {match.isJoined && match.participants?.user && (
                <div className="rounded-xl border border-border bg-elevated/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                    Thông tin đội tham gia
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-white font-bold text-base">
                        {getInitials(match.participants.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">
                          {match.participants.user.fullName || "Chưa có tên"}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 font-medium border-status-info/30 bg-status-info-bg text-status-info"
                        >
                          Đối thủ
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-text-muted">
                        {match.participants.user.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 opacity-70" />
                            {match.participants.user.email}
                          </span>
                        )}
                        {match.participants.user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 opacity-70" />
                            {match.participants.user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Match Criteria & Specs */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Thông số & Điều kiện ghép đối
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Field Type */}
                  <div className="flex items-start gap-3.5 rounded-xl border border-border bg-elevated/40 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-success-bg text-status-success">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted font-medium">Quy mô sân</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">
                        {currentFieldType?.title || "Chưa xác định"}
                      </p>
                      <p className="text-xs text-text-muted">{currentFieldType?.subtitle || "--"}</p>
                    </div>
                  </div>

                  {/* Age Requirement */}
                  <div className="flex items-start gap-3.5 rounded-xl border border-border bg-elevated/40 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-info-bg text-status-info">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted font-medium">Độ tuổi yêu cầu</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">
                        {getAgeDisplay(match.minAge, match.maxAge)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {match.minAge && match.maxAge ? "Khoảng độ tuổi phù hợp" : "Linh hoạt"}
                      </p>
                    </div>
                  </div>

                  {/* Cost Rule */}
                  <div className="flex items-start gap-3.5 rounded-xl border border-border bg-elevated/40 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted font-medium">Hình thức chia tiền</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">
                        {currentCostRule?.label || "Thương lượng"}
                      </p>
                      <p className="text-xs text-text-muted">{currentCostRule?.desc || "--"}</p>
                    </div>
                  </div>

                  {/* Time Note */}
                  <div className="flex items-start gap-3.5 rounded-xl border border-border bg-elevated/40 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted font-medium">Thời gian dự kiến</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">
                        {match.timeNote || "Chưa cập nhật"}
                      </p>
                      <p className="text-xs text-text-muted">Theo ghi chú từ chủ kèo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Mô tả & Lời nhắn
                </p>
                <div className="rounded-xl border border-border bg-elevated/30 p-4 text-sm leading-relaxed text-text-secondary">
                  {match.description ? (
                    <p className="whitespace-pre-line">{match.description}</p>
                  ) : (
                    <p className="italic text-text-muted text-xs">
                      Không có ghi chú bổ sung nào từ chủ kèo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end p-4 bg-elevated/40">
          <Button
            variant="outline"
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-6"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}