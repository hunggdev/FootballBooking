// src/features/admin-booking/BookingTable.tsx

import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";
import { formatDate, formatDateTime, formatTimeRange } from "@/lib/utils";
import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";


interface Props {
  bookings: Booking[];
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
}

export function BookingTable({
  bookings,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; 

  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFields = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  


  return (
    <div>
    <div className="overflow-x-auto rounded-md border my-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Sân</th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Đã cọc</th>
            <th className="border p-2">Thời gian tạo</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {paginatedFields.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                Không có booking nào
              </td>
            </tr>
          ) : (
            paginatedFields.map((booking) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-gray-50"
              >
                <td className="border p-2">
                  {booking.bookingId}
                </td>

                <td className="border p-2">
                  {booking.user?.fullName ?? "-"}
                </td>

                <td className="border p-2">
                  {booking.bookingSlots[0].fieldSlot.field.name}
                </td>

                <td className="border p-2">
                  {booking.totalPrice}
                </td>

                <td className="border p-2">
                  {booking.depositAmount}
                </td>

                <td className="border p-2">
                  {formatDateTime(booking.createdAt)}
                </td>

                <td className="border p-2">
                  {booking.status}
                </td>

                <td className="border p-2">
                  <div className="flex gap-2">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(booking)}
                      >
                        Xem
                      </Button>
                    )}

                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(booking)}
                        disabled={booking.status === "COMPLETED" || booking.status === "CANCELLED"}
                      >
                        Sửa
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(booking)}
                        disabled={booking.status === "COMPLETED" || booking.status === "CANCELLED"}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
 
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        pageSize={pageSize}
      />

    </div>


  );
}