// src/features/admin-service/ServiceDetailDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useService } from "@/stores/useServiceStore";
import { formatDateTime } from "@/lib/utils";
import {
  Coffee,
  Coins,
  Calendar,
  AlertCircle,
  Loader2,
  ImageIcon,
  Archive,
} from "lucide-react";

interface ServiceDetailDialogProps {
  serviceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailDialog({
  serviceId,
  open,
  onOpenChange,
}: ServiceDetailDialogProps) {
  const numericServiceId = serviceId ?? 0;
  const { data: service, isLoading, error } = useService(numericServiceId);

  const isAvailable = service?.status === "ACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[500px] p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                    Chi tiết dịch vụ #{serviceId}
                  </DialogTitle>
                  {service?.createdAt && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Tạo ngày {formatDateTime(service.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {service && (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    isAvailable
                      ? "border-status-success/30 bg-status-success-bg text-status-success"
                      : "border-status-danger/30 bg-status-danger-bg text-status-danger"
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                      isAvailable ? "bg-status-success" : "bg-status-danger"
                    }`}
                  />
                  {isAvailable ? "Đang kinh doanh" : "Ngừng kinh doanh"}
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
              <p className="text-sm font-medium">Đang tải thông tin dịch vụ...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger-bg p-4 text-status-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {service && (
            <div className="space-y-6">
              {/* Product Media & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-xl border border-border bg-elevated/40 p-4">
                <div className="sm:col-span-5 h-44 rounded-lg overflow-hidden border border-border bg-surface flex items-center justify-center">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-text-muted p-4">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                      <span className="text-xs">Chưa có hình ảnh</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {service.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      {service.description || "Không có mô tả cho dịch vụ này."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[11px] text-text-muted">
                      {service.updatedAt
                        ? `Cập nhật lần cuối: ${formatDateTime(service.updatedAt)}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Stock Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Price Card */}
                <div className="flex items-center gap-3.5 rounded-xl border border-border bg-elevated/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium">Giá niêm yết</p>
                    <p className="text-lg font-bold text-brand-primary mt-0.5">
                      {Number(service.price || 0).toLocaleString("vi-VN")}&nbsp;đ
                    </p>
                  </div>
                </div>

                {/* Stock Card */}
                <div className="flex items-center gap-3.5 rounded-xl border border-border bg-elevated/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-info-bg text-status-info border border-status-info/20">
                    <Archive className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-medium">Số lượng mặc định</p>
                    <p className="text-lg font-bold text-text-primary mt-0.5">
                      {service.quantity}&nbsp;sản phẩm
                    </p>
                  </div>
                </div>
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