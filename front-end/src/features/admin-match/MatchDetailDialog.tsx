// src/components/admin/customers/CustomerDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerBookingHistoryRow } from "@/features/admin-customer/types";
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

const bookingStatusLabel: Record<CustomerBookingHistoryRow["status"], string> = {
  booked: "Đã đặt",
  held: "Giữ chỗ",
  "pending-confirm": "Chờ xác nhận",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

const mockHistory: CustomerBookingHistoryRow[] = [
  { id: "#DS1267", fieldName: "Sân A", dateTime: "14/07/2026 - 20:00", amount: 200000, status: "paid" },
  { id: "#DS1240", fieldName: "Sân B", dateTime: "02/07/2026 - 19:00", amount: 180000, status: "paid" },
  { id: "#DS1198", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
  { id: "#DS1199", fieldName: "Sân A", dateTime: "20/06/2026 - 18:00", amount: 200000, status: "cancelled" },
];

interface MatchDetailDialogProps {
  matchId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function MatchDetailDialog({ matchId, open, onOpenChange, }: MatchDetailDialogProps) {
  const {data, isLoading, error} = useMatch(matchId ?? 0);
  const match: Match | undefined = data?.match;
  console.log(match, "match");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-w-full border">
        <DialogHeader>
          <DialogTitle>Thông tin trận đấu</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Không thể tải thông tin sân.
          </p>
        )}

        {match && (
          <div>
            <div className="flex items-center gap-4 border p-4">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>{match.matchId}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{match.user?.fullName}</p>
              <p className="text-xs opacity-60">{match.user?.email}</p>
            </div>
            <Badge variant="outline">{match.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 border p-4 sm:grid-cols-2 text-2xl">
            <div>
              <p className="text-xs opacity-60">Tuổi (min)</p>
              <p className="font-medium">{match.minAge ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Tuổi (max)</p>
              <p className="font-medium">{match.maxAge ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Loại sân</p>
              <p className="font-medium">{typeLabel[match.fieldType] ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Thời gian dự kiến</p>
              <p className="font-medium">{match.timeNote ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Mô tả</p>
              <p className="font-medium">{match.description ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Hình thức trả tiền</p>
              <p className="font-medium">{costRuleLabel[match.costRule] ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs opacity-60">Trạng thái</p>
              <p className="font-medium">{statusLabel[match.status] ?? "Chưa cập nhật"}</p>
            </div>
          </div>

          <Separator />

          {/* <div>
            <p className="mb-2 text-sm font-semibold">Lịch sử đặt sân gần đây</p>
            <div className="border max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đặt sân</TableHead>
                    <TableHead>Sân</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="max-h-96 overflow-y-auto">
                  {mockHistory.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.fieldName}</TableCell>
                      <TableCell>{row.dateTime}</TableCell>
                      <TableCell>{row.amount.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bookingStatusLabel[row.status]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div> */}

          <div className="flex justify-end gap-2">
            {/* <Button variant="outline" className="border">
              {customer.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </Button> */}
            <Button variant="outline" className="border">
              Chỉnh sửa thông tin
            </Button>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
