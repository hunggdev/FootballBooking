// src/features/admin-match/MatchesTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Swords, Clock } from "lucide-react";
import type { Match } from "@/types/match";

interface Props {
  matches: Match[];
  onView: (match: Match) => void;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
  currentPage: number;
  pageSize: number;
}

const statusLabel: Record<string, string> = {
  OPEN: "Đang tìm",
  MATCHED: "Đã ghép",
  FINISHED: "Đã kết thúc",
  CANCELLED: "Đã hủy",
};

const statusBadge: Record<string, string> = {
  OPEN: "border-status-success/20 bg-status-success-bg text-status-success",
  MATCHED: "border-status-warning/20 bg-status-warning-bg text-status-warning",
  FINISHED: "border-status-info/20 bg-status-info-bg text-status-info",
  CANCELLED: "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const fieldTypeLabel: Record<string, string> = {
  FIVE: "Sân 5 người (5v5)",
  SEVEN: "Sân 7 người (7v7)",
  ELEVEN: "Sân 11 người (11v11)",
};

const fieldTypeBadge: Record<string, string> = {
  FIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  SEVEN: "border-status-info/20 bg-status-info-bg text-status-info",
  ELEVEN: "border-status-indigo/20 bg-status-indigo/15 text-status-indigo",
};

const costRuleLabel: Record<string, string> = {
  SPLIT: "Chia đều (50/50)",
  LOSER_PAYS: "Thua trả",
  WINNER_PAYS: "Thắng trả",
  NEGOTIATE: "Thương lượng",
};

const costRuleBadge: Record<string, string> = {
  SPLIT: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  LOSER_PAYS: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  WINNER_PAYS: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  NEGOTIATE: "border-slate-500/20 bg-slate-500/10 text-slate-300",
};

export function MatchesTable({
  matches,
  onView,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
}: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMatches = matches.slice(startIndex, endIndex);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="mt-5 rounded-xl bg-[#2d3a4f] p-px transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
      <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <Table>
            {/* ================= HEADER ================= */}
            <TableHeader>
              <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                <TableHead className="w-[5%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Mã kèo
                </TableHead>

                <TableHead className="w-[18%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Người tạo kèo
                </TableHead>

                <TableHead className="w-[13%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Loại sân
                </TableHead>

                <TableHead className="w-[11%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Độ tuổi
                </TableHead>

                <TableHead className="w-[15%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Thời gian dự kiến
                </TableHead>

                <TableHead className="w-[13%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hình thức trả phí
                </TableHead>

                <TableHead className="w-[11%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Trạng thái
                </TableHead>

                <TableHead className="w-[14%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {currentMatches.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="py-14 text-center text-sm text-text-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Swords className="h-8 w-8 text-text-muted/40" />
                      <span>Chưa có kèo đấu nào.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentMatches.map((match, index) => {
                  const upperStatus = (match.status || "").toUpperCase();
                  const upperType = (match.fieldType || "").toUpperCase();
                  const upperCost = (match.costRule || "").toUpperCase();

                  return (
                    <TableRow
                      key={match.matchId}
                      className="group border-border/50 transition-colors duration-200 hover:bg-surface-hover/60"
                    >
                      {/* STT */}
                      <TableCell className="text-center text-xs font-medium text-text-muted">
                        #{match.matchId}
                      </TableCell>

                      {/* Người tạo kèo */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
                              {getInitials(match.user?.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex flex-col">
                            <span className="truncate text-xs font-semibold text-text-primary transition-colors duration-200 group-hover:text-white">
                              {match.user?.fullName || "Người dùng ẩn danh"}
                            </span>
                            <span className="truncate text-[11px] text-text-muted">
                              {match.user?.email || "Chưa có email"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Loại sân */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${
                            fieldTypeBadge[upperType] ||
                            "border-border bg-elevated text-text-secondary"
                          }`}
                        >
                          {fieldTypeLabel[upperType] || match.fieldType}
                        </span>
                      </TableCell>

                      {/* Độ tuổi */}
                      <TableCell>
                        <span className="text-xs font-medium text-text-secondary">
                          {match.minAge && match.maxAge
                            ? `${match.minAge} - ${match.maxAge} tuổi`
                            : match.minAge
                              ? `Từ ${match.minAge}t`
                              : match.maxAge
                                ? `Dưới ${match.maxAge}t`
                                : "Linh hoạt"}
                        </span>
                      </TableCell>

                      {/* Thời gian dự kiến */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Clock className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          <span
                            className="truncate max-w-[130px]"
                            title={match.timeNote}
                          >
                            {match.timeNote || "Chưa có"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Hình thức trả tiền */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
                            costRuleBadge[upperCost] ||
                            "border-border bg-elevated text-text-secondary"
                          }`}
                        >
                          {costRuleLabel[upperCost] || match.costRule}
                        </span>
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${
                            statusBadge[upperStatus] ||
                            "border-border bg-elevated text-text-secondary"
                          }`}
                        >
                          {statusLabel[upperStatus] || match.status}
                        </span>
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* XEM */}
                          <Button
                            size="sm"
                            onClick={() => onView(match)}
                            className="h-8 border border-status-info/20 bg-status-info-bg px-2.5 text-xs font-medium text-status-info shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-info/30 hover:bg-status-info/20 cursor-pointer"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Xem
                          </Button>

                          {/* SỬA */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(match)}
                            disabled={upperStatus !== "OPEN"}
                            className="h-8 border-border bg-transparent px-2.5 text-xs font-medium text-text-secondary shadow-none transition-all duration-200 hover:-translate-y-px hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent cursor-pointer disabled:opacity-40 disabled:hover:translate-y-0"
                          >
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Sửa
                          </Button>

                          {/* XÓA */}
                          <Button
                            size="sm"
                            onClick={() => onDelete(match)}
                            disabled={upperStatus === "CANCELLED"}
                            className="h-8 border border-status-danger/20 bg-status-danger-bg px-2.5 text-xs font-medium text-status-danger shadow-none transition-all duration-200 hover:-translate-y-px hover:border-status-danger/30 hover:bg-status-danger/20 cursor-pointer disabled:opacity-40 disabled:hover:translate-y-0"
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
