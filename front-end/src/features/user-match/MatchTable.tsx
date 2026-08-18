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
  MATCHED:
    "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  FINISHED:
    "border-border bg-elevated text-text-secondary",
  CANCELLED:
    "border-status-danger/30 bg-status-danger-bg text-status-danger",
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

  return (
    <Card className="overflow-hidden border-border bg-surface text-text-primary">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-elevated hover:bg-elevated">
              <TableHead className="font-semibold text-text-secondary">
                No.
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Người tạo kèo
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Tuổi (min)
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Tuổi (max)
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Loại sân
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Thời gian dự kiến
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Hình thức trả tiền
              </TableHead>

              <TableHead className="font-semibold text-text-secondary">
                Trạng thái
              </TableHead>

              <TableHead className="text-right font-semibold text-text-secondary">
                Thao tác
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
              currentMatches.map((match, index) => (
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
                      <Avatar className="h-8 w-8 border-2 border-border bg-elevated">
                        <AvatarFallback className="bg-elevated text-xs font-semibold text-text-primary">
                          {match.user.fullName
                            ?.charAt(0)
                            .toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="font-medium text-text-primary">
                          {match.user.fullName}
                        </p>

                        <p className="text-xs text-text-muted">
                          Người tạo kèo
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Tuổi min */}
                  <TableCell className="text-text-secondary">
                    {match.minAge ?? "Chưa cập nhật"}
                  </TableCell>

                  {/* Tuổi max */}
                  <TableCell className="text-text-secondary">
                    {match.maxAge ?? "Chưa cập nhật"}
                  </TableCell>

                  {/* Loại sân */}
                  <TableCell>
                    <span className="font-medium text-text-primary">
                      {typeLabel[match.fieldType] ??
                        match.fieldType}
                    </span>
                  </TableCell>

                  {/* Thời gian */}
                  <TableCell className="text-text-secondary">
                    {match.timeNote || "Chưa cập nhật"}
                  </TableCell>

                  {/* Hình thức trả tiền */}
                  <TableCell>
                    <span className="text-text-secondary">
                      {costRuleLabel[match.costRule] ??
                        match.costRule}
                    </span>
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusClass[match.status]}
                    >
                      {statusLabel[match.status] ??
                        match.status}
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}