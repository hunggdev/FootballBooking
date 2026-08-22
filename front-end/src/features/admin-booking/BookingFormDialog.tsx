// src/features/admin-booking/BookingFormDialog.tsx
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/types/booking";
import { AlertCircle, Loader2 } from "lucide-react";

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
  customerName: booking?.user?.fullName ?? "",
  fieldName:
    booking?.bookingSlots?.[0]?.fieldSlot?.field?.name ??
    booking?.field?.name ??
    "",
  status: (booking?.status ?? "CONFIRMED") as
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED",
});

export function BookingFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [formState, setFormState] = useState(() =>
    getInitialFormState(initialData),
  );

  useEffect(() => {
    if (open) {
      setFormState(getInitialFormState(initialData));
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (initialData) {
      onSubmit({ status: formState.status } as UpdateBookingPayload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                {/* <CalendarEdit className="h-5 w-5" /> */}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  {initialData
                    ? `Cập nhật đơn đặt sân #${initialData.bookingId}`
                    : "Tạo đơn đặt sân mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  Thay đổi trạng thái tiến trình xử lý đơn đặt sân của khách
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {serverError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg p-3.5 text-xs font-medium text-status-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {initialData && (
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldWrapper>
                  <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Khách hàng
                  </FieldLabel>
                  <Input
                    value={formState.customerName || "Khách vãng lai"}
                    readOnly
                    className="border-border bg-elevated/60 text-text-muted disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Sân bóng
                  </FieldLabel>
                  <Input
                    value={formState.fieldName || "Chưa xác định"}
                    readOnly
                    className="border-border bg-elevated/60 text-text-muted disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </FieldWrapper>
              </div>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trạng thái đơn đặt sân{" "}
                  <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: value as "CONFIRMED" | "CANCELLED" | "COMPLETED",
                    }))
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {formState.status === "CONFIRMED"
                        ? "Đã xác nhận"
                        : formState.status === "CANCELLED"
                          ? "Đã hủy đơn"
                          : "Đã hoàn thành"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="CONFIRMED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã xác nhận (CONFIRMED)
                    </SelectItem>
                    <SelectItem
                      value="COMPLETED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã hoàn thành (COMPLETED)
                    </SelectItem>
                    <SelectItem
                      value="CANCELLED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã hủy đơn (CANCELLED)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            </FieldGroup>
          )}
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end gap-3 p-4 bg-elevated/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-5"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : initialData ? (
              "Lưu thay đổi"
            ) : (
              "Tạo đơn"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
