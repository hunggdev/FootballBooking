// src/features/admin-booking/BookingTable.tsx

import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";
import { formatDate, formatTimeRange } from "@/lib/utils";

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
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Sân</th>
            <th className="border p-2">Ngày</th>
            <th className="border p-2">Khung giờ</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                Không có booking nào
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
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
                  {booking.fieldSlot?.field?.name ?? "-"}
                </td>

                <td className="border p-2">
                  {booking.bookingDate ? formatDate(booking.bookingDate) : "-"}
                </td>

                <td className="border p-2">
                  {formatTimeRange(booking.fieldSlot?.starttime, booking.fieldSlot?.endtime)}
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
                      >
                        Sửa
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(booking)}
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
  );
}