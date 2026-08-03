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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xuất hóa đơn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bookingId">Mã booking</Label>
            <Input
              id="bookingId"
              type="number"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Nhập mã đơn đặt sân..."
            />
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !bookingId}>
              {isSubmitting ? "Đang xuất..." : "Xuất hóa đơn"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
