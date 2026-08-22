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
import { Pagination } from "@/components/common/Pagination";
import type { Booking } from "@/types/booking";
import { Search } from "lucide-react";

type StatusFilter = "all" | "HOLD" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
const PAGE_SIZE = 10;

export default function BookingHistoryPage() {
  const { data: bookings = [], isLoading, error } = useBookings();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const query = search.trim().toLowerCase();
        const upperStatus = (booking.status || "").toUpperCase();
        const matchStatus = status === "all" || upperStatus === status;
        const matchSearch =
          query === "" ||
          booking.bookingId.toString().includes(query) ||
          (booking?.user?.fullName ?? "").toLowerCase().includes(query) ||
          (booking?.field?.name ?? "").toLowerCase().includes(query) ||
          (booking?.bookingSlots?.[0]?.fieldSlot?.field?.name ?? "")
            .toLowerCase()
            .includes(query);
        return matchStatus && matchSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [bookings, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, currentPage]);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-text-secondary">
        Đang tải lịch sử đặt sân...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">
        Không thể tải dữ liệu lịch sử đặt sân.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Lịch sử đặt sân"
        subtitle="Toàn bộ lịch sử các lượt đặt sân trong hệ thống"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative rounded-md p-[1px] transition-all duration-300 hover:bg-[image:var(--token-gradient-brand)]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Tìm theo mã đơn, khách hàng, tên sân..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-72 border-0 bg-elevated pl-8 text-text-primary placeholder:text-text-muted focus-visible:ring-0"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as StatusFilter);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-48 border-border bg-elevated text-text-primary data-placeholder:text-text-muted">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent className="border-border bg-elevated text-text-primary">
              <SelectItem value="all" className="text-text-secondary focus:text-text-primary">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="CONFIRMED" className="text-text-secondary focus:text-text-primary">
                Đã xác nhận
              </SelectItem>
              <SelectItem value="HOLD" className="text-text-secondary focus:text-text-primary">
                Đang giữ chỗ
              </SelectItem>
              <SelectItem value="COMPLETED" className="text-text-secondary focus:text-text-primary">
                Đã hoàn thành
              </SelectItem>
              <SelectItem value="CANCELLED" className="text-text-secondary focus:text-text-primary">
                Đã hủy
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BookingTable bookings={paginatedBookings} onView={handleView} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredBookings.length}
        pageSize={PAGE_SIZE}
      />

      <BookingDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        booking={selectedBooking}
      />
    </>
  );
}
