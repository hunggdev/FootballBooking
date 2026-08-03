import type { Booking } from "@/types/booking";
import { formatTimeRange, formatDate } from "@/lib/utils";

interface Props {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">
        Đặt sân gần đây
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Mã</th>
            <th className="p-2 border">Khách hàng</th>
            <th className="p-2 border">Sân</th>
            <th className="p-2 border">Thời gian</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-gray-50"
              >
                <td className="p-2 border">
                  {booking.bookingId}
                </td>

                <td className="p-2 border">
                  {booking.user.fullName}
                </td>

                <td className="p-2 border">
                  {booking.fieldSlot.field.name}
                </td>

                <td className="p-2 border">
                  {formatDate(booking.bookingDate)}
                  <br />
                  {formatTimeRange(booking.fieldSlot.starttime, booking.fieldSlot.endtime)}
                </td>

                <td className="p-2 border">
                  {booking.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center text-gray-500"
              >
                Không có dữ liệu đặt sân
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}