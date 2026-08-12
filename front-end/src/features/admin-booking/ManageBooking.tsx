import { useState } from "react";
import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useCancelBooking,
} from "@/stores/useBookingStore";
import type { Booking, CreateBookingPayload, UpdateBookingPayload } from "@/types/booking";

import { BookingTable } from "./BookingTable";
import { BookingFormDialog } from "./BookingFormDialog";
import { BookingDetailDialog } from "./BookingDetaiDialog";
import { BookingFilterBar } from "./BookingFilterBar";

export function ManageBooking() {
  const { data: bookings = [], isLoading } = useBookings();
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED">("all");

  // Gom tạo mới và cập nhật vào một hàm duy nhất
  const handleSubmit = (values: CreateBookingPayload | UpdateBookingPayload) => {
    if (selectedBooking) {
      updateMutation.mutate(
        { bookingId: selectedBooking.bookingId, payload: values as UpdateBookingPayload },
        { onSuccess: () => setOpenForm(false) }
      );
    } else {
      createMutation.mutate(values as CreateBookingPayload, {
        onSuccess: () => setOpenForm(false),
      });
    }
  };

  const handleCancel = (booking: Booking) => {
    const ok = confirm(`Bạn có chắc muốn hủy đơn đặt sân #${booking.bookingId}?`);
    if (!ok) return;
    cancelMutation.mutate(booking.bookingId);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      search === "" ||
      b.bookingId.toString().includes(search) ||
      (b.user?.fullName ?? "").toLowerCase().includes(search.toLowerCase()) || 
      (b.fieldSlot?.field?.name ?? "").toLowerCase().includes(search.toLowerCase()); 
    const matchStatus = status === "all" || b.status === status;
    return matchSearch && matchStatus;
  });


  return (
    <div className="space-y-4">
      <BookingFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onClick={() => {
          setSelectedBooking(null);
          setOpenForm(true);
        }}
      />

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <BookingTable
          bookings={filteredBookings}
          onEdit={(booking) => {
            setSelectedBooking(booking);
            setOpenForm(true);
          }}
          onDelete={handleCancel}
          onView={(booking) => {
            setSelectedBooking(booking);
            setOpenDetail(true);
          }}
        />
      )}

      <BookingFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initialData={selectedBooking}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        serverError={
          (createMutation.error as Error)?.message ||
          (updateMutation.error as Error)?.message ||
          null
        }
      />

      <BookingDetailDialog
        open={openDetail}
        onOpenChange={setOpenDetail}
        booking={selectedBooking}
      />
    </div>
  );
}
