// src/components/admin/customers/CustomersTable.tsx
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
import type { Match } from "@/types/match";

import { Button } from "@/components/ui/button";

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

const statusVariant: Record<
  Match["status"],
  "default" | "secondary" | "destructive" | "success" 
> = {
  OPEN: "default",
  MATCHED: "secondary",
  FINISHED: "success",
  CANCELLED: "destructive",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

// onView, onEdit, onDelete,

export function MatchesTable({matches, currentPage, pageSize, onView, onEdit, onDelete, onSelect, onCancel, filter }: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentMatches = matches.slice(startIndex, endIndex);
  return (
    <Card className="border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Người tạo kèo</TableHead>
              <TableHead>Tuổi (min)</TableHead>
              <TableHead>Tuổi (max)</TableHead>
              <TableHead>Loại sân</TableHead>
              <TableHead>Thời gian dự kiện</TableHead>
              <TableHead>Hình thức trả tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMatches.map((match, index) => (
              <TableRow key={match.matchId}>
                <TableCell>{startIndex+index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarFallback>{ match.user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{match.user.fullName}</p>
                      <p className="text-xs opacity-60">{match.user.fullName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{match.minAge ?? "Chưa cập nhật"}</TableCell>
                <TableCell>{match.maxAge ?? "Chưa cập nhật"}</TableCell>
                <TableCell>{typeLabel[match.fieldType.toUpperCase()] || match.fieldType}</TableCell>
                <TableCell>{match.timeNote}</TableCell>
                <TableCell>{costRuleLabel[match.costRule.toUpperCase()] || match.costRule}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[match.status.toUpperCase()] || "default"}>
                    {statusLabel[match.status.toUpperCase()] || match.status}
                  </Badge>
                </TableCell> 

                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="secondary" onClick={() => onView(match)}>Xem</Button>
                  {filter === "OPEN" && <Button size="sm" variant="secondary" onClick={() => onSelect(match.matchId)}>Tham gia</Button>}
                  {filter === "MINE" && <Button size="sm" variant="outline" onClick={() => onEdit(match)} disabled={match.status !== "OPEN"}>Sửa</Button>}
                  {(filter === "MINE") && <Button size="sm" variant="destructive" onClick={() => onDelete(match)} disabled={match.status === "FINISHED" || match.status === "CANCELLED"}>Xóa</Button>}
                  {(filter === "JOINED") && <Button size="sm" variant="destructive" onClick={() => onCancel(match)} disabled={match.status === "FINISHED" || match.status === "CANCELLED"}>Hủy</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
