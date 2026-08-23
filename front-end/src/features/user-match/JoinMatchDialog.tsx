import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserCheck, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  Xác nhận tham gia kèo đấu
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  Gửi yêu cầu ghép đối tới đội chủ kèo
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

          <div className="space-y-3 rounded-xl border border-border bg-elevated/40 p-4 text-xs">
            <p className="text-text-primary font-semibold text-sm">
              Lưu ý khi tham gia kèo:
            </p>

            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Yêu cầu ghép đối sẽ được thông báo ngay lập tức tới đội tạo kèo.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Hai đội có thể chủ động liên hệ qua SĐT/Email sau khi được xác nhận.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Bạn có thể hủy kèo trong vòng 24h kể từ khi xác nhận tham gia kèo.</span> 
              </li>
            </ul>
          </div>
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
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang gửi...
              </span>
            ) : (
              "Xác nhận tham gia"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}