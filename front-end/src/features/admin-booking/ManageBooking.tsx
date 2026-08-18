import { useMemo, useState } from "react";

import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useCancelBooking,
} from "@/stores/useBookingStore";

import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/types/booking";

import { BookingTable } from "./BookingTable";
import { BookingFormDialog } from "./BookingFormDialog";
import { BookingDetailDialog } from "./BookingDetaiDialog";
import { BookingFilterBar } from "./BookingFilterBar";
import { Pagination } from "@/components/common/Pagination";

const PAGE_SIZE = 10;

export function ManageBooking() {
  const { data: bookings = [], isLoading } = useBookings();

  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    "all" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // FILTER BOOKING
  // =========================
  const filteredBookings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchSearch =
        keyword === "" ||
        booking.bookingId.toString().includes(keyword) ||
        (booking.user?.fullName ?? "")
          .toLowerCase()
          .includes(keyword) ||
        booking.bookingSlots.some((slot) =>
          (slot.fieldSlot?.field?.name ?? "")
            .toLowerCase()
            .includes(keyword)
        );

      const matchStatus =
        status === "all" || booking.status === status;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  // =========================
  // SEARCH
  // =========================
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // =========================
  // STATUS FILTER
  // =========================
  const handleStatusChange = (
    value:
      | "all"
      | "PENDING"
      | "CONFIRMED"
      | "CANCELLED"
      | "COMPLETED"
  ) => {
    setStatus(value);
    setCurrentPage(1);
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = (
    values: CreateBookingPayload | UpdateBookingPayload
  ) => {
    if (selectedBooking) {
      updateMutation.mutate(
        {
          bookingId: selectedBooking.bookingId,
          payload: values as UpdateBookingPayload,
        },
        {
          onSuccess: () => {
            setOpenForm(false);
            setSelectedBooking(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        values as CreateBookingPayload,
        {
          onSuccess: () => {
            setOpenForm(false);
          },
        }
      );
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancel = (booking: Booking) => {
    const ok = confirm(
      `Bạn có chắc muốn hủy đơn đặt sân #${booking.bookingId}?`
    );

    if (!ok) return;

    cancelMutation.mutate(booking.bookingId);
  };

  return (
    <div className="space-y-4">
      <BookingFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        onClick={() => {
          setSelectedBooking(null);
          setOpenForm(true);
        }}
      />

      {isLoading ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Đang tải dữ liệu...
        </p>
      ) : (
        <>
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <BookingFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initialData={selectedBooking}
        onSubmit={handleSubmit}
        isSubmitting={
          createMutation.isPending ||
          updateMutation.isPending
        }
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