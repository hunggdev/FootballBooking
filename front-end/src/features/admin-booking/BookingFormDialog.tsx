import { useState } from "react";

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

import type {
  Booking,
  UpdateBookingPayload,
} from "@/types/booking";

import { formatTime } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Booking | null;
  onSubmit: (values: UpdateBookingPayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

const getInitialFormState = (booking?: Booking | null) => {
  const bookingSlot = booking?.bookingSlots?.[0];

  return {
    fieldId: bookingSlot?.fieldSlot?.field?.fieldId ?? 0,

    starttime: bookingSlot?.fieldSlot?.starttime
      ? formatTime(bookingSlot.fieldSlot.starttime)
      : "",

    endtime: bookingSlot?.fieldSlot?.endtime
      ? formatTime(bookingSlot.fieldSlot.endtime)
      : "",

    status: (booking?.status ?? "PENDING") as BookingStatus,
  };
};

export function BookingFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [formState, setFormState] = useState(() =>
    getInitialFormState(initialData)
  );

  const handleSubmit = () => {
    const payload: UpdateBookingPayload = {
      fieldId: formState.fieldId,
      starttime: formState.starttime,
      endtime: formState.endtime,
      status: formState.status,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-lg
          border-border
          bg-elevated
          text-text-primary
          ring-border
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            Chỉnh sửa Booking #{initialData?.bookingId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Khách hàng */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary">
              Khách hàng
            </Label>

            <Input
              value={initialData?.user?.fullName ?? ""}
              disabled
              className="
                border-border
                bg-surface
                text-text-muted
                disabled:opacity-70
              "
            />
          </div>

          {/* Sân */}
          <div className="space-y-1.5">
            <Label
              htmlFor="fieldId"
              className="text-text-secondary"
            >
              Sân
            </Label>

            <Input
              id="fieldId"
              type="number"
              value={formState.fieldId}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  fieldId: Number(e.target.value),
                }))
              }
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                focus-visible:border-brand-accent
                focus-visible:ring-brand-accent/30
              "
            />
          </div>

          {/* Giờ bắt đầu */}
          <div className="space-y-1.5">
            <Label
              htmlFor="starttime"
              className="text-text-secondary"
            >
              Giờ bắt đầu
            </Label>

            <Input
              id="starttime"
              type="time"
              value={formState.starttime}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  starttime: e.target.value,
                }))
              }
              className="
                border-border
                bg-surface
                text-text-primary
                focus-visible:border-brand-accent
                focus-visible:ring-brand-accent/30
              "
            />
          </div>

          {/* Giờ kết thúc */}
          <div className="space-y-1.5">
            <Label
              htmlFor="endtime"
              className="text-text-secondary"
            >
              Giờ kết thúc
            </Label>

            <Input
              id="endtime"
              type="time"
              value={formState.endtime}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  endtime: e.target.value,
                }))
              }
              className="
                border-border
                bg-surface
                text-text-primary
                focus-visible:border-brand-accent
                focus-visible:ring-brand-accent/30
              "
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary">
              Trạng thái
            </Label>

            <Select
              value={formState.status}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  status: value as BookingStatus,
                }))
              }
            >
              <SelectTrigger
                className="
                  w-full
                  border-border
                  bg-surface
                  text-text-primary
                  data-placeholder:text-text-muted
                  focus:ring-brand-accent/30
                "
              >
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>

              <SelectContent
                className="
                  border-border
                  bg-elevated
                  text-text-primary
                "
              >
                <SelectItem
                  value="PENDING"
                  className="
                    text-text-secondary

                    focus:text-text-primary
                  "
                >
                  Chờ xử lý
                </SelectItem>

                <SelectItem
                  value="CONFIRMED"
                  className="
                    text-text-secondary
                    
                    focus:text-text-primary
                  "
                >
                  Đã xác nhận
                </SelectItem>

                <SelectItem
                  value="CANCELLED"
                  className="
                    text-text-secondary
                   
                    focus:text-text-primary
                  "
                >
                  Đã hủy
                </SelectItem>

                <SelectItem
                  value="COMPLETED"
                  className="
                    text-text-secondary
                    
                    focus:text-text-primary
                  "
                >
                  Đã hoàn thành
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lỗi */}
          {serverError && (
            <div
              className="
                rounded-md
                border
                border-status-danger/30
                bg-status-danger-bg
                px-3
                py-2
                text-sm
                font-medium
                text-status-danger
              "
            >
              {serverError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="
                  border-border
              bg-transparent
              text-text-secondary
              transition-all
              duration-200
              hover:border-brand-accent/40
              hover:bg-brand-accent/10
              hover:text-brand-accent
              "
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="
                border-transparent
                bg-brand-accent
                font-semibold
                text-accent-foreground
                hover:bg-brand-accent-hover
              "
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}