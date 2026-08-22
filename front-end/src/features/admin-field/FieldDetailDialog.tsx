// src/features/admin-field/FieldDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useField } from "@/stores/useFieldStore";
import type { FieldType, FieldSlot } from "@/types/field";
import { formatDateTime, formatTimeRange } from "@/lib/utils";
import {
  Layers,
  Clock,
  Coins,
  Calendar,
  AlertCircle,
  Loader2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

import { fieldTypeConfig, slotStatusConfig } from "@/types/field";

interface FieldDetailDialogProps {
  fieldId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FieldDetailDialog({
  fieldId,
  open,
  onOpenChange,
}: FieldDetailDialogProps) {
  const numericFieldId = fieldId ?? 0;
  const { data: field, isLoading, error } = useField(numericFieldId);

  const currentType = field?.fieldType
    ? fieldTypeConfig[field.fieldType as FieldType]
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết sân #{fieldId}
                  </DialogTitle>
                  {field?.createdAt && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Tạo ngày {formatDateTime(field.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {currentType && (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${currentType.badgeClass}`}
                >
                  {currentType.label}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              <p className="text-sm font-medium">
                Đang tải thông tin sân bóng...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger-bg p-4 text-status-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Không thể tải thông tin sân bóng. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {field && (
            <div className="space-y-6">
              {/* Field Media & Overview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-border bg-elevated/40 p-4">
                {/* Field Image */}
                <div className="md:col-span-5 h-44 rounded-lg overflow-hidden border border-border bg-surface flex items-center justify-center">
                  {field.image ? (
                    <img
                      src={field.image}
                      alt={field.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-text-muted p-4">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                      <span className="text-xs">Chưa cập nhật hình ảnh</span>
                    </div>
                  )}
                </div>

                {/* Field Details */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-text-primary">
                        {field.name}
                      </h3>
                    </div>
                    <p className="text-xs text-brand-primary font-medium mt-0.5">
                      {currentType?.label || field.fieldType} •{" "}
                      {currentType?.sub || ""}
                    </p>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      {field.description ||
                        "Chưa có mô tả chi tiết cho sân bóng này."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                    <span className="text-xs text-text-muted">
                      Tổng số khung giờ:
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface text-text-primary font-mono text-xs"
                    >
                      {field.fieldSlots?.length || 0} khung giờ
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Danh sách khung giờ ({field.fieldSlots?.length || 0})
                  </p>
                </div>

                {!field.fieldSlots || field.fieldSlots.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-elevated/20 p-8 text-center text-text-muted">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      Sân này hiện chưa có khung giờ hoạt động.
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Vui lòng cập nhật thêm khung giờ trong cài đặt sân.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {field.fieldSlots.map((slot: FieldSlot) => {
                      const st = slotStatusConfig[slot.status] || {
                        label: slot.status,
                        className: "border-border bg-elevated text-text-muted",
                      };
                      return (
                        <div
                          key={slot.slotId}
                          className="rounded-xl border border-border bg-elevated/40 p-3.5 flex flex-col justify-between hover:border-brand-primary/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-text-muted" />
                              {formatTimeRange(slot.starttime, slot.endtime)}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-2 py-0 font-medium rounded-full border ${st.className}`}
                            >
                              {st.label}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                            <span className="text-text-muted">Giá thuê:</span>
                            <span className="font-bold text-brand-primary flex items-center gap-0.5">
                              <Coins className="h-3 w-3" />
                              {Number(slot.price || 0).toLocaleString("vi-VN")}
                              &nbsp;đ
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end p-4 bg-elevated/40">
          <Button
            variant="outline"
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-6"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
