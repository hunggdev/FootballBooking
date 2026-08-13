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
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Match } from "@/types/match";

interface MatchesTableProps {
  matches: Match[];
  onView: (match: Match) => void;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
  currentPage: number;
  pageSize: number;
}

const statusLabel: Record<string, string> = {
  OPEN: "Đang tìm đối",
  MATCHED: "Đã ghép đối",
  FINISHED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "MATCHED":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "FINISHED":
      return "bg-text-muted/10 text-text-secondary border-border";
    case "CANCELLED":
      return "bg-status-danger/10 text-status-danger border-status-danger/20";
    default:
      return "bg-surface text-text-primary border-border";
  }
};

const typeLabel: Record<string, string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
  ELEVEN: "Sân 11",
};

const costRuleLabel: Record<string, string> = {
  SPLIT: "Chia đều",
  LOSER_PAYS: "Thua trả",
  WINNER_PAYS: "Thắng trả",
  NEGOTIATE: "Thương lượng",
};

export function MatchesTable({
  matches,
  onView,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: MatchesTableProps) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentMatches = matches.slice(startIndex, endIndex);

  return (
    <Card className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-elevated">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold text-text-muted">
                STT
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Người tạo kèo
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Độ tuổi
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Loại sân
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Thời gian dự kiến
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Hình thức trả tiền
              </TableHead>
              <TableHead className="font-semibold text-text-muted">
                Trạng thái
              </TableHead>
              <TableHead className="pr-6 text-right font-semibold text-text-muted">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMatches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-text-muted"
                >
                  Không tìm thấy kèo đấu nào.
                </TableCell>
              </TableRow>
            ) : (
              currentMatches.map((match, index) => {
                const upperStatus = match.status?.toUpperCase() || "";
                const upperType = match.fieldType?.toUpperCase() || "";
                const upperCost = match.costRule?.toUpperCase() || "";

                return (
                  <TableRow
                    key={match.matchId}
                    className="border-border transition-colors hover:bg-surface-hover/50"
                  >
                    <TableCell className="text-center text-xs font-medium text-text-muted">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 border border-brand-primary/30 bg-brand-primary/10">
                          <AvatarFallback className="bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                            {match.user?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {match.user?.fullName || "Người dùng ẩn danh"}
                          </p>
                          <p className="text-xs text-text-muted">
                            {match.user?.email || "Chưa có email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-text-secondary">
                      {match.minAge && match.maxAge
                        ? `${match.minAge} - ${match.maxAge} tuổi`
                        : "Chưa cập nhật"}
                    </TableCell>

                    <TableCell className="text-sm font-medium text-text-primary">
                      {typeLabel[upperType] || match.fieldType}
                    </TableCell>

                    <TableCell className="text-sm text-text-secondary">
                      {match.timeNote || "Chưa cập nhật"}
                    </TableCell>

                    <TableCell className="text-sm font-medium text-brand-primary">
                      {costRuleLabel[upperCost] || match.costRule}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                          match.status
                        )}`}
                      >
                        {statusLabel[upperStatus] || match.status}
                      </span>
                    </TableCell>

                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(match)}
                          className="h-8 px-2.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                          title="Xem chi tiết"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Xem
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(match)}
                          disabled={upperStatus !== "OPEN"}
                          className="h-8 px-2.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:opacity-40"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Sửa
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(match)}
                          disabled={
                            upperStatus === "FINISHED" ||
                            upperStatus === "CANCELLED"
                          }
                          className="h-8 px-2.5 text-status-danger hover:bg-status-danger-bg hover:text-status-danger disabled:opacity-40"
                          title="Xóa"
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
  );
}