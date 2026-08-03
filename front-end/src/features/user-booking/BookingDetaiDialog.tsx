import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import type { Booking } from "@/types/booking";
import { formatTime, formatDateTime } from "@/lib/utils";

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

        <div className="space-y-4">
          <div>
            <Label>Khách hàng:</Label>
            <p>{booking.user?.fullName ?? "-"}</p>
          </div>

          <div>
            <Label>Sân:</Label>
            <p>{booking.fieldSlot?.field?.name ?? "-"}</p>
          </div>

          <div>
            <Label>Start Time:</Label>
            <p>{booking.fieldSlot?.starttime ? formatTime(booking.fieldSlot.starttime) : "-"}</p>
          </div>

          <div>
            <Label>End Time:</Label>
            <p>{booking.fieldSlot?.endtime ? formatTime(booking.fieldSlot.endtime) : "-"}</p>
          </div>

          <div>
            <Label>Status:</Label>
            <p>{booking.status}</p>
          </div>

          <div>
            <Label>Created At:</Label>
            <p>{formatDateTime(booking.createdAt)}</p>
          </div>

          <div>
            <Label>Updated At:</Label>
            <p>{formatDateTime(booking.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
