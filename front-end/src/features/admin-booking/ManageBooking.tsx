// src/features/admin-booking/ManageBooking.tsx
import { useState, useMemo } from "react";
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
import { PageHeader } from "@/layouts/admin/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { BookingTable } from "./BookingTable";
import { BookingFormDialog } from "./BookingFormDialog";
import { BookingDetailDialog } from "./BookingDetaiDialog";
import { BookingFilterBar } from "./BookingFilterBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export function ManageBooking() {
  const navigate = useNavigate();

  const { data: bookings = [], isLoading, error } = useBookings();
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();

  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "all" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = (
    values: CreateBookingPayload | UpdateBookingPayload,
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
            toast.success("Cập nhật đơn đặt sân thành công");
          },
          onError: () => {
            toast.error("Cập nhật đơn đặt sân thất bại");
          },
        },
      );
    } else {
      createMutation.mutate(values as CreateBookingPayload, {
        onSuccess: () => {
          setOpenForm(false);
          toast.success("Tạo đơn đặt sân thành công");
        },
        onError: () => {
          toast.error("Tạo đơn đặt sân thất bại");
        },
      });
    }
  };

  const handleCancel = (booking: Booking) => {
    const ok = confirm(
      `Bạn có chắc muốn hủy đơn đặt sân #${booking.bookingId}?`,
    );
    if (!ok) return;

    cancelMutation.mutate({ bookingId: booking.bookingId }, {
      onSuccess: () => {
        toast.success(`Đã hủy đơn đặt sân #${booking.bookingId}`);
      },
      onError: () => {
        toast.error("Hủy đơn đặt sân thất bại");
      },
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const query = search.trim().toLowerCase();
        const matchSearch =
          query === "" ||
          b.bookingId.toString().includes(query) ||
          (b.user?.fullName ?? "").toLowerCase().includes(query) ||
          (b?.field?.name ?? "").toLowerCase().includes(query) ||
          (b?.bookingSlots?.[0]?.fieldSlot?.field?.name ?? "")
            .toLowerCase()
            .includes(query);

        const upperStatus = (b.status || "").toUpperCase();
        const matchStatus =
          status === "all" || upperStatus === status.toUpperCase();

        return matchSearch && matchStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [bookings, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE),
  );
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, currentPage]);

  if (isLoading) {
    return (
      <div className="p-8 text-text-secondary">
        Đang tải danh sách đặt sân...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">
        Không thể tải danh sách đặt sân. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý đặt sân"
        subtitle="Quản lý các lượt đặt sân trong hệ thống theo thời gian thực"
      />

      <BookingFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onClick={() => {
          navigate("/user/booking");
        }}
      />

      <BookingTable
        bookings={paginatedBookings}
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
        totalItems={filteredBookings.length}
        pageSize={PAGE_SIZE}
      />

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
    </>
  );
}
