import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import type { Booking } from "@/types/booking";
import { formatTime, formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
}

export function BookingDetailDialog({ open, onOpenChange, booking }: Props) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết Booking #{booking.bookingId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 w-full">
          <div className="flex gap-2">
            <Label>Khách hàng:</Label>
            <p className="ml-2">{booking.user?.fullName ?? "-"}</p>
          </div>

          <div className="flex gap-2">
            <Label>Sân:</Label>
            <p className="ml-2">
              {booking.bookingSlots[0].fieldSlot.field.name ?? "-"}
            </p>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Ngày</th>
                  <th className="border p-2">Khung giờ</th>
                  <th className="border p-2">Giá</th>
                </tr>
              </thead>

              <tbody>
                {booking.bookingSlots.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Không có booking nào
                    </td>
                  </tr>
                ) : (
                  booking.bookingSlots.map((slot) => (
                    <tr key={slot.bookingSlotId} className="hover:bg-gray-50">
                      <td className="border p-2">{slot.bookingSlotId}</td>

                      <td className="border p-2">
                        {formatDate(slot.bookingDate)}
                      </td>

                      <td className="border p-2">
                        {formatTime(slot.fieldSlot.starttime)} -{" "}
                        {formatTime(slot.fieldSlot.endtime)}
                      </td>

                      <td className="border p-2">{slot.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Label>Status:</Label>
            <p className="ml-2">{booking.status}</p>
          </div>

          <div className="flex gap-2">
            <Label>Created At:</Label>
            <p className="ml-2">{formatDate(booking.createdAt)}</p>
          </div>

          <div className="flex gap-2">
            <Label>Updated At:</Label>
            <p className="ml-2">{formatDate(booking.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
