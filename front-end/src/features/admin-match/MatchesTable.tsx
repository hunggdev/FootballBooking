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

const statusBadge: Record<string, string> = {
  OPEN: "border-status-info/20 bg-status-info-bg text-status-info",
  MATCHED:
    "border-status-success/20 bg-status-success-bg text-status-success",
  FINISHED: "border-border bg-elevated text-text-muted",
  CANCELLED:
    "border-status-danger/20 bg-status-danger-bg text-status-danger",
};

const typeLabel: Record<string, string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
  ELEVEN: "Sân 11",
};

const typeBadge: Record<string, string> = {
  FIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  SEVEN: "border-status-info/20 bg-status-info-bg text-status-info",
  ELEVEN: "border-status-indigo/20 bg-status-indigo/15 text-status-indigo",
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
    <div
      className="
        mt-5
        rounded-xl
        bg-[#2d3a4f]
        p-px
        transition-all
        duration-300
        hover:bg-[image:var(--token-gradient-brand)]
      "
    >
      <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
        <CardContent className="p-0">
          <Table>
            {/* ================= HEADER ================= */}
            <TableHeader>
              <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                <TableHead className="w-16 text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  STT
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Người tạo kèo
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Độ tuổi
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Loại sân
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Thời gian dự kiến
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hình thức trả tiền
                </TableHead>

                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Trạng thái
                </TableHead>

                <TableHead className="pr-6 text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {currentMatches.length === 0 && (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-text-muted"
                  >
                    Không tìm thấy kèo đấu nào.
                  </TableCell>
                </TableRow>
              )}

              {currentMatches.map((match, index) => {
                const upperStatus = match.status?.toUpperCase() || "";
                const upperType = match.fieldType?.toUpperCase() || "";
                const upperCost = match.costRule?.toUpperCase() || "";

                return (
                  <TableRow
                    key={match.matchId}
                    className="
                      group
                      border-border/50
                      transition-colors
                      duration-200
                      hover:bg-surface-hover/60
                    "
                  >
                    {/* ================= STT ================= */}
                    <TableCell className="text-center text-xs font-medium text-text-muted">
                      {startIndex + index + 1}
                    </TableCell>

                    {/* ================= NGƯỜI TẠO ================= */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="
                            h-9
                            w-9
                            shrink-0
                            border
                            border-brand-primary/30
                            bg-brand-primary/10
                          "
                        >
                          <AvatarFallback
                            className="
                              bg-brand-primary/10
                              text-sm
                              font-semibold
                              text-brand-primary
                            "
                          >
                            {match.user?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-text-primary
                              transition-colors
                              duration-200
                              group-hover:text-white
                            "
                          >
                            {match.user?.fullName || "Người dùng ẩn danh"}
                          </p>

                          <p className="text-xs text-text-muted">
                            {match.user?.email || "Chưa có email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* ================= ĐỘ TUỔI ================= */}
                    <TableCell className="text-sm text-text-secondary">
                      {match.minAge && match.maxAge
                        ? `${match.minAge} - ${match.maxAge} tuổi`
                        : "Chưa cập nhật"}
                    </TableCell>

                    {/* ================= LOẠI SÂN ================= */}
                    <TableCell>
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-md
                          border
                          px-2.5
                          py-1
                          text-[11px]
                          font-semibold
                          ${typeBadge[upperType] ||
                          "border-border bg-elevated text-text-muted"
                          }
                        `}
                      >
                        {typeLabel[upperType] || match.fieldType}
                      </span>
                    </TableCell>

                    {/* ================= THỜI GIAN ================= */}
                    <TableCell className="text-sm text-text-secondary">
                      {match.timeNote || "Chưa cập nhật"}
                    </TableCell>

                    {/* ================= HÌNH THỨC TRẢ TIỀN ================= */}
                    <TableCell>
                      <span className="text-sm font-medium text-brand-primary">
                        {costRuleLabel[upperCost] || match.costRule}
                      </span>
                    </TableCell>

                    {/* ================= TRẠNG THÁI ================= */}
                    <TableCell>
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-md
                          border
                          px-2.5
                          py-1
                          text-[11px]
                          font-semibold
                          ${statusBadge[upperStatus] ||
                          "border-border bg-elevated text-text-muted"
                          }
                        `}
                      >
                        {statusLabel[upperStatus] || match.status}
                      </span>
                    </TableCell>

                    {/* ================= HÀNH ĐỘNG ================= */}
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* XEM */}
                        <Button
                          size="sm"
                          onClick={() => onView(match)}
                          className="
                            h-8
                            border
                            border-status-info/20
                            bg-status-info-bg
                            px-2.5
                            text-xs
                            font-medium
                            text-status-info
                            shadow-none
                            transition-all
                            duration-200
                            hover:-translate-y-px
                            hover:border-status-info/30
                            hover:bg-status-info/20
                          "
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Xem
                        </Button>

                        {/* SỬA */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(match)}
                          disabled={upperStatus !== "OPEN"}
                          className="
                            h-8
                            border-border
                            bg-transparent
                            px-2.5
                            text-xs
                            font-medium
                            text-text-secondary
                            shadow-none
                            transition-all
                            duration-200
                            hover:-translate-y-px
                            hover:border-brand-accent/40
                            hover:bg-brand-accent/10
                            hover:text-brand-accent
                            disabled:opacity-40
                          "
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Sửa
                        </Button>

                        {/* XÓA */}
                        <Button
                          size="sm"
                          onClick={() => onDelete(match)}
                          disabled={
                            upperStatus === "FINISHED" ||
                            upperStatus === "CANCELLED"
                          }
                          className="
                            h-8
                            border
                            border-status-danger/20
                            bg-status-danger-bg
                            px-2.5
                            text-xs
                            font-medium
                            text-status-danger
                            shadow-none
                            transition-all
                            duration-200
                            hover:-translate-y-px
                            hover:border-status-danger/30
                            hover:bg-status-danger/20
                            disabled:opacity-40
                          "
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}