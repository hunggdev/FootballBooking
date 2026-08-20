import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Booking, CreateBookingPayload, UpdateBookingPayload } from "@/types/booking";
import { formatTime } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Booking | null;
  onSubmit: (values: CreateBookingPayload | UpdateBookingPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

const getInitialFormState = (booking?: Booking | null) => ({
  userId: booking?.user?.userId ?? 0,
  fieldId: booking?.field?.fieldId ?? 0,
  // starttime: booking?.fieldSlot?.starttime ? formatTime(booking.fieldSlot.starttime) : "",
  // endtime: booking?.fieldSlot?.endtime ? formatTime(booking.fieldSlot.endtime) : "",
  status: (booking?.status ?? "PENDING") as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
});

export function BookingFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [formState, setFormState] = useState(() => getInitialFormState(initialData));

  useEffect(() => {
    if (open) {
      setFormState(getInitialFormState(initialData));
    }
  }, [open, initialData]);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
  };

  const handleSubmit = () => {
    if (initialData) {
      onSubmit(formState as UpdateBookingPayload);
    } 
    // else {
    //   onSubmit(formState as CreateBookingPayload);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa Booking" : "Tạo Booking mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="number"
              value={formState.userId}
              disabled={true}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, userId: Number(e.target.value) }))
              }
            />
          </div>

          <div>
            <Label htmlFor="fieldId">Field ID</Label>
            <Input
              id="fieldId"
              type="number"
              value={formState.fieldId}
              disabled={true}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, fieldId: Number(e.target.value) }))
              }
            />
          </div>

          {/* <div>
            <Label htmlFor="starttime">Start Time</Label>
            <Input
              id="starttime"
              type="datetime-local"
              value={formState.starttime}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, starttime: e.target.value }))
              }
            />
          </div> */}

          {/* <div>
            <Label htmlFor="endtime">End Time</Label>
            <Input
              id="endtime"
              type="datetime-local"
              value={formState.endtime}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, endtime: e.target.value }))
              }
            />
          </div> */}

          {initialData && (
            <div>
              <Label>Trạng thái</Label>
              <Select
                value={formState.status}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: value as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {serverError && (
            <p className="text-sm text-red-500">{serverError}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Đang lưu..."
                : initialData
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
