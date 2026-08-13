import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import type { Match } from "@/types/match";
import { useMatch } from "@/stores/useMatchStore";

const statusLabel: Record<Match["status"], string> = {
  OPEN: "Đang tìm đối",
  MATCHED: "Đã ghép đối",
  FINISHED: "Đã kết thúc",
  CANCELLED: "Đã hủy",
};

const getStatusColor = (status: Match["status"]) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-500/10 text-blue-500";
    case "MATCHED":
      return "bg-emerald-500/10 text-emerald-500";
    case "FINISHED":
      return "bg-text-muted/10 text-text-secondary";
    case "CANCELLED":
      return "bg-status-danger/10 text-status-danger";
    default:
      return "bg-surface text-text-primary";
  }
};

const typeLabel: Record<Match["fieldType"], string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
  ELEVEN: "Sân 11",
};

const costRuleLabel: Record<Match["costRule"], string> = {
  SPLIT: "Chia đều (50/50)",
  LOSER_PAYS: "Thua trả 100%",
  WINNER_PAYS: "Thắng trả 100%",
  NEGOTIATE: "Thương lượng",
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
  const numericMatchId = matchId ?? 0;
  const { data, isLoading, error } = useMatch(numericMatchId);
  const match: Match | undefined = data?.match;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-text-primary">
            Thông tin trận đấu
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="py-4 text-center text-sm text-text-muted">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-status-danger">
            Không thể tải thông tin kèo đấu.
          </p>
        )}

        {!match && !isLoading && !error && (
          <p className="py-4 text-center text-sm text-text-muted">
            Không có dữ liệu kèo đấu.
          </p>
        )}

        {match && (
          <div className="space-y-5 pt-2">
            {/* Header: Thông tin người tạo kèo */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border bg-elevated">
                  <AvatarFallback className="bg-surface text-text-secondary font-semibold">
                    {match.user?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-bold text-text-primary">
                    {match.user?.fullName || "Người dùng ẩn danh"}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {match.user?.email || "Chưa cập nhật email"}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                  match.status
                )}`}
              >
                {statusLabel[match.status] ?? "Không xác định"}
              </span>
            </div>

            <Separator className="bg-border" />

            {/* Chi tiết thông số kèo đấu */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Loại sân
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">
                  {typeLabel[match.fieldType] ?? "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Hình thức trả tiền
                </p>
                <p className="mt-1 text-sm font-medium text-brand-primary">
                  {costRuleLabel[match.costRule] ?? "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Độ tuổi yêu cầu
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">
                  {match.minAge && match.maxAge
                    ? `${match.minAge} - ${match.maxAge} tuổi`
                    : "Mọi lứa tuổi"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Thời gian dự kiến
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary">
                  {match.timeNote ?? "Chưa cập nhật"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Mô tả / Ghi chú thêm
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {match.description || "Không có mô tả thêm cho kèo đấu này."}
                </p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="border-border bg-surface text-text-primary hover:bg-surface-hover hover:text-text-primary"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
              <Button className="bg-brand-primary text-primary-foreground hover:bg-brand-primary-hover border-transparent">
                Chỉnh sửa thông tin
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}