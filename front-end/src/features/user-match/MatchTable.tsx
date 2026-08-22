import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { Match } from "@/types/match";
import { fieldTypeBadge, fieldTypeLabel } from "@/types/field";

const costRuleBadge: Record<string, string> = {
  SPLIT: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  LOSER_PAYS: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  WINNER_PAYS: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  NEGOTIATE: "border-slate-500/20 bg-slate-500/10 text-slate-300",
};

interface Props {
  matches: Match[];
  currentPage: number;
  pageSize: number;
  onView?: (match: Match) => void;
  onEdit?: (match: Match) => void;
  onDelete?: (match: Match) => void;
  onSelect?: (id: number) => void;
  onCancel?: (match: Match) => void;
  filter: string;
}

const statusLabel: Record<string, string> = {
  OPEN: "Đang tìm",
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
  FINISHED: "border-border bg-elevated text-text-secondary",
  CANCELLED: "border-status-danger/30 bg-status-danger-bg text-status-danger",
};

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleDateString("vi-VN");
// }

export function MatchesTable({
  matches,
  currentPage,
  pageSize,
  onView,
  onEdit,
  onDelete,
  onSelect,
  onCancel,
  filter,
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
    <Card className="overflow-hidden border-border bg-surface text-text-primary">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
              <TableHead className="font-semibold uppercase text-text-secondary">
                ID
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Người tạo kèo
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Độ tuổi
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Loại sân
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Thời gian dự kiến
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Hình thức trả tiền
              </TableHead>

              <TableHead className="font-semibold uppercase text-text-secondary">
                Trạng thái
              </TableHead>

              <TableHead className="text-right font-semibold uppercase text-text-secondary">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentMatches.length === 0 ? (
              <TableRow className="border-border hover:bg-surface">
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-text-muted"
                >
                  Không có kèo đấu nào.
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
                    className="border-border transition-colors hover:bg-surface-hover"
                  >
                    {/* STT */}
                    <TableCell className="font-medium text-text-secondary">
                      {startIndex + index + 1}
                    </TableCell>

                    {/* Người tạo */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border/60">
                          <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
                            {getInitials(match.user?.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="font-medium text-text-primary">
                            {match.user.fullName}
                          </p>

                          {/* <p className="text-xs text-text-muted">Người tạo kèo</p> */}
                        </div>
                      </div>
                    </TableCell>

                    {/* Độ tuổi */}
                    <TableCell className="text-text-secondary">
                      {match.minAge && match.maxAge
                        ? `${match.minAge} - ${match.maxAge} tuổi`
                        : match.minAge
                          ? `Từ ${match.minAge}t`
                          : "Bất kỳ"}
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

                    {/* Thời gian */}
                    <TableCell className="text-text-secondary">
                      {match.timeNote || "Chưa cập nhật"}
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
                      <Badge
                        variant="outline"
                        className={statusClass[match.status]}
                      >
                        {statusLabel[match.status] ?? match.status}
                      </Badge>
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Xem */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView?.(match)}
                          className="border-border bg-elevated text-text-primary hover:bg-surface-hover hover:text-text-primary"
                        >
                          Xem
                        </Button>

                        {/* Tham gia */}
                        {filter === "OPEN" && (
                          <Button
                            size="sm"
                            onClick={() => onSelect?.(match.matchId)}
                            className="bg-brand-primary text-white hover:bg-brand-primary-hover"
                          >
                            Tham gia
                          </Button>
                        )}

                        {/* Sửa */}
                        {filter === "MINE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(match)}
                            disabled={match.status !== "OPEN"}
                            className="border-brand-primary/40 bg-transparent text-brand-primary hover:bg-brand-primary/10 hover:text-brand-primary"
                          >
                            Sửa
                          </Button>
                        )}

                        {/* Xóa */}
                        {filter === "MINE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete?.(match)}
                            disabled={
                              match.status === "FINISHED" ||
                              match.status === "CANCELLED"
                            }
                            className="border-status-danger/40 bg-transparent text-status-danger hover:bg-status-danger-bg hover:text-status-danger"
                          >
                            Xóa
                          </Button>
                        )}

                        {/* Hủy tham gia */}
                        {filter === "JOINED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCancel?.(match)}
                            disabled={
                              match.status === "FINISHED" ||
                              match.status === "CANCELLED"
                            }
                            className="border-status-danger/40 bg-transparent text-status-danger hover:bg-status-danger-bg hover:text-status-danger"
                          >
                            Hủy
                          </Button>
                        )}
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
  );
}
