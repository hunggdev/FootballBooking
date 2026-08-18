import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { Match } from "@/types/match";
import { useMatch } from "@/stores/useMatchStore";

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

const statusClass: Record<Match["status"], string> = {
  OPEN: "border-status-success/30 bg-status-success-bg text-status-success",
  MATCHED: "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  FINISHED:
    "border-text-muted/30 bg-text-muted/10 text-text-secondary",
  CANCELLED:
    "border-status-danger/30 bg-status-danger-bg text-status-danger",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-elevated text-text-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Thông tin trận đấu
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-text-muted">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="text-sm text-status-danger">
            Không thể tải thông tin trận đấu.
          </p>
        )}

        {match && (
          <div className="space-y-4">
            {/* Người tạo */}
            <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
              <Avatar className="h-12 w-12 border-2 border-border bg-elevated">
                <AvatarFallback className="bg-elevated text-sm font-semibold text-text-primary">
                  {match.user?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {match.user?.fullName ?? "Chưa cập nhật"}
                </p>

                <p className="truncate text-xs text-text-muted">
                  {match.user?.email ?? "Chưa cập nhật"}
                </p>
              </div>

              <Badge
                variant="outline"
                className={statusClass[match.status]}
              >
                {statusLabel[match.status]}
              </Badge>
            </div>

            {/* Thông tin trận đấu */}
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2">
              {/* Tuổi min */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3">
                <p className="text-xs text-text-muted">
                  Tuổi tối thiểu
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {match.minAge ?? "Chưa cập nhật"}
                </p>
              </div>

              {/* Tuổi max */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3">
                <p className="text-xs text-text-muted">
                  Tuổi tối đa
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {match.maxAge ?? "Chưa cập nhật"}
                </p>
              </div>

              {/* Loại sân */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3">
                <p className="text-xs text-text-muted">
                  Loại sân
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {typeLabel[match.fieldType] ?? "Chưa cập nhật"}
                </p>
              </div>

              {/* Thời gian */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3">
                <p className="text-xs text-text-muted">
                  Thời gian dự kiến
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {match.timeNote ?? "Chưa cập nhật"}
                </p>
              </div>

              {/* Mô tả */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3 sm:col-span-2">
                <p className="text-xs text-text-muted">
                  Mô tả
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {match.description ?? "Chưa cập nhật"}
                </p>
              </div>

              {/* Hình thức trả tiền */}
              <div className="rounded-md border border-border-subtle bg-elevated p-3 sm:col-span-2">
                <p className="text-xs text-text-muted">
                  Hình thức trả tiền
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {costRuleLabel[match.costRule] ?? "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <Separator className="bg-border" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}