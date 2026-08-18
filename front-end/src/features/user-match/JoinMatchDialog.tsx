import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  FieldGroup,
} from "@/components/ui/field";

interface JoinMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function JoinMatchDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  serverError,
}: JoinMatchDialogProps) {
  const [error] = useState<string | null>(null);

  const handleSubmit = () => {
    toast.success("Gửi yêu cầu tham gia thành công", {
      position: "top-center",
    });
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-xl
          border-border
          bg-elevated
          text-text-primary
          shadow-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Xác nhận tham gia kèo đấu
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          <div
            className="
              space-y-2
              rounded-lg
              border
              border-border
              bg-surface-hover/40
              p-4
              text-sm
              text-text-primary
            "
          >
            <p>
              Bạn sắp gửi{" "}
              <strong className="text-text-primary">
                yêu cầu tham gia
              </strong>{" "}
              vào kèo đấu này.
            </p>

            <ul className="list-disc space-y-1 pl-5 text-text-secondary">
              <li>Yêu cầu sẽ được gửi đến đội tạo kèo.</li>
              <li>
                Bạn chỉ có thể thi đấu khi được chủ kèo chấp nhận.
              </li>
              <li>
                Bạn có thể hủy yêu cầu nếu chủ kèo chưa xác nhận.
              </li>
            </ul>
          </div>

          {(error || serverError) && (
            <p className="text-sm text-status-danger">
              {error ?? serverError}
            </p>
          )}
        </FieldGroup>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="
              border-border
              bg-surface
              text-text-secondary
              hover:bg-surface-hover
              hover:text-text-primary
            "
          >
            Hủy
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              bg-brand-primary
              text-white
              hover:bg-brand-primary-hover
              disabled:bg-surface-hover
              disabled:text-text-muted
            "
          >
            {isSubmitting
              ? "Đang gửi yêu cầu..."
              : "Gửi yêu cầu tham gia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}