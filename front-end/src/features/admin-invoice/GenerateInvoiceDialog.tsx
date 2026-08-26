// src/features/admin-invoice/GenerateInvoiceDialog.tsx
import { useState } from "react";
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
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AlertCircle, Receipt, Loader2, Info } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bookingId: number) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

export function GenerateInvoiceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = () => {
    const id = Number(bookingId);
    if (!id) return;
    onSubmit(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  Xuất hóa đơn thanh toán
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  Tạo hóa đơn thanh toán từ đơn đặt sân đã có
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

          <FieldGroup className="space-y-3">
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mã đơn đặt sân (Booking ID){" "}
                <span className="text-status-danger">*</span>
              </FieldLabel>
              <Input
                id="bookingId"
                type="number"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="VD: 1024"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 text-base font-semibold"
              />
            </FieldWrapper>

            <div className="rounded-xl border border-border bg-elevated/30 p-3.5 flex items-start gap-2.5 text-xs text-text-secondary">
              <Info className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
              <p>
                Hệ thống sẽ tự động tổng hợp tiền sân và các dịch vụ phát sinh
                từ đơn đặt sân này để xuất hóa đơn.
              </p>
            </div>
          </FieldGroup>
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
            disabled={isSubmitting || !bookingId}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xuất...
              </span>
            ) : (
              "Xuất hóa đơn"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
