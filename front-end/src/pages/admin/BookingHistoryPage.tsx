// src/pages/admin/BookingHistoryPage.tsx
import { useMemo, useState } from "react";
import { PageHeader } from "@/layouts/admin/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookings } from "@/stores/useBookingStore";
import { BookingTable } from "@/features/admin-booking/BookingTable";
import { BookingDetailDialog } from "@/features/admin-booking/BookingDetaiDialog";
import type { Booking } from "@/types/booking";

type StatusFilter = "all" | "HOLD" | "CONFIRMED" | "CANCELLED";

export default function BookingHistoryPage() {
  const { data: bookings = [], isLoading, error } = useBookings();
  console.log(bookings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const matchStatus = status === "all" || booking.status === status;
        const matchSearch = booking?.user?.fullName
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [bookings, search, status]);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  if (isLoading) return <div className="p-6">Đang tải lịch sử đặt sân...</div>;
  if (error)
    return <div className="p-6 text-status-danger">Không thể tải dữ liệu.</div>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lịch sử đặt sân"
        subtitle="Toàn bộ lịch sử các lượt đặt sân trong hệ thống"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Tìm theo tên khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="HOLD">Đang giữ chỗ</SelectItem>
            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BookingTable bookings={filteredBookings} onView={handleView} />

      <BookingDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        booking={selectedBooking}
      />
    </div>
  );
}
