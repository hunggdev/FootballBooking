// src/features/user-booking/CancelBookingDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
} from "lucide-react";

// ── Preset reasons ─────────────────────────────────────────────────────────
const PRESET_REASONS = [
  "Bận việc đột xuất, không thể đến chơi",
  "Thời tiết xấu, không đảm bảo an toàn",
  "Thiếu người chơi, không đủ số lượng",
  "Thay đổi lịch trình cá nhân",
  "Tìm được sân khác phù hợp hơn",
  "Lý do khác (nhập bên dưới)",
];

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number | null;
  fieldName?: string;
  onConfirm: (cancelReason: string) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  bookingId,
  fieldName,
  onConfirm,
  isSubmitting = false,
  serverError,
}: CancelBookingDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleSelectPreset = (reason: string) => {
    const isCustom = reason === PRESET_REASONS[PRESET_REASONS.length - 1];
    setSelectedPreset(reason);
    setShowCustom(isCustom);
    if (!isCustom) setCustomReason("");
  };

  const finalReason =
    selectedPreset === PRESET_REASONS[PRESET_REASONS.length - 1]
      ? customReason.trim()
      : selectedPreset ?? "";

  const canSubmit = finalReason.length > 0 && !isSubmitting;

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedPreset(null);
    setCustomReason("");
    setShowCustom(false);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm(finalReason);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* ── Header ── */}
        <div className="bg-elevated/80 p-5 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-danger-bg text-status-danger border border-status-danger/25">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-text-primary">
                  Hủy đặt sân
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {fieldName ? (
                    <>
                      Sân: <span className="text-text-secondary font-medium">{fieldName}</span>
                    </>
                  ) : (
                    <>Mã đặt: <span className="font-mono font-medium text-text-secondary">#{bookingId}</span></>
                  )}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Body ── */}
        <div className="p-5 space-y-4">
          {/* Warning banner */}
          <div className="flex items-start gap-2.5 rounded-lg border border-status-warning/25 bg-status-warning-bg px-4 py-3">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-status-warning" />
            <p className="text-xs text-status-warning leading-relaxed">
              Sau khi hủy, đơn đặt sân sẽ không thể khôi phục. Tiền đặt cọc sẽ
              được xử lý theo chính sách hoàn tiền.
            </p>
          </div>

          {/* Preset reasons */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              Chọn lý do hủy
            </p>
            <div className="space-y-2">
              {PRESET_REASONS.map((reason) => {
                const isSelected = selectedPreset === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handleSelectPreset(reason)}
                    className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-xs transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "border-status-danger/40 bg-status-danger-bg text-status-danger font-medium"
                        : "border-border bg-elevated/40 text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{reason}</span>
                      {isSelected && (
                        <span className="shrink-0 h-2 w-2 rounded-full bg-status-danger" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom reason textarea — shown when "Lý do khác" is selected */}
          {showCustom && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Nhập lý do cụ thể
              </p>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Mô tả lý do hủy sân của bạn..."
                rows={3}
                className="resize-none border-border bg-elevated/40 text-text-primary placeholder:text-text-muted focus:border-status-danger/40 focus:ring-status-danger/20 text-sm"
                maxLength={300}
              />
              <p className="text-right text-[11px] text-text-muted">
                {customReason.length}/300
              </p>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <p className="flex items-center gap-2 rounded-lg border border-status-danger/25 bg-status-danger-bg px-3 py-2.5 text-xs text-status-danger">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {serverError}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <Separator className="bg-border/60" />
        <div className="flex items-center justify-end gap-2.5 p-4 bg-elevated/40">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
          >
            Không hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-1.5 border border-status-danger/30 bg-status-danger-bg text-status-danger hover:bg-status-danger/20 hover:border-status-danger/50 font-semibold shadow-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {isSubmitting ? "Đang hủy..." : "Xác nhận hủy sân"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
