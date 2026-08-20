import { Eye, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import type { Booking, HighlightMatch, SystemAlert } from "@/types/dashboard";
import type { Booking } from "@/types/booking";
import { formatDate } from "@/lib/utils";
import type { Match } from "@/types/match";
import type { Review } from "@/types/review";
import { useNavigate } from "react-router";

interface BookingsAndHighlightsProps {
  // bookings: Booking[];
  // highlightMatches: HighlightMatch[];
  // systemAlerts: SystemAlert[];
  bookings: Booking[];
  matchs: Match[];
  reviews: Review[];
}

export function BookingsAndHighlights({
  bookings,
  matchs,
  reviews,
  // highlightMatches,
  // systemAlerts,
}: BookingsAndHighlightsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
      {/* Bảng đặt sân mới nhất */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Đặt sân mới nhất</CardTitle>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => navigate("/admin/bookings/history")}
          >
            Xem tất cả →
          </Button>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[380px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đặt sân</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sân</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Tiền cọc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell className="font-medium">
                    {booking.bookingId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 shrink-0 rounded-full border" />
                      {booking.user.fullName}
                    </div>
                  </TableCell>
                  <TableCell>{booking.field?.name || "trống"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(booking.createdAt)}
                  </TableCell>
                  <TableCell>{booking.depositAmount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cột phải: Kèo đấu nổi bật + Cảnh báo hệ thống */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Kèo đấu nổi bật</CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => navigate("/admin/matches")}
            >
              Xem tất cả →
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {matchs.map((match) => (
              <div
                key={match.matchId}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <div className="h-8 w-8 shrink-0 rounded-md border" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {match.fieldType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {match.timeNote}
                  </p>
                  {/* <p className="text-xs text-muted-foreground">{match.playerCount}</p> */}
                </div>
                <Badge variant="outline">{match.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Đánh giá gần đây</CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => navigate("/admin/feedback")}
            >
              Xem tất cả →
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="flex flex-row items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="flex flex-row gap-2 items-center justify-center">
                  <div className="h-3 w-3 shrink-0 rounded-full border" />
                  <p className="truncate text-xs font-medium">
                    {review.user.fullName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
                <p className="truncate text-xs font-medium">
                  {review.rating}/5
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
