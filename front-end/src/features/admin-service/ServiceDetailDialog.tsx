import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useService } from "@/stores/useServiceStore";
import { formatDateTime } from "@/lib/utils";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            Chi tiết dịch vụ
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="py-4 text-center text-sm text-text-muted">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-status-danger">
            Không thể tải thông tin dịch vụ.
          </p>
        )}

        {!service && !isLoading && !error && (
          <p className="py-4 text-center text-sm text-text-muted">
            Không có dữ liệu dịch vụ.
          </p>
        )}

        {service && (
          <div className="space-y-5 pt-2">
            {/* Ảnh đại diện & Thông tin chính */}
            <div className="flex gap-4">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-28 w-36 shrink-0 rounded-lg border border-border object-cover"
                />
              ) : (
                <div className="flex h-28 w-36 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-xs font-medium text-text-muted">
                  Không có ảnh
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {service.name}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                    {service.description || "Chưa có mô tả cho dịch vụ này."}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${service.status === "ACTIVE"
                        ? "bg-status-success-bg text-status-success"
                        : "bg-status-danger-bg text-status-danger"
                      }`}
                  >
                    {service.status === "ACTIVE"
                      ? "Đang kinh doanh"
                      : "Ngừng kinh doanh"}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Chi tiết Giá & Số lượng */}
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-3.5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Đơn giá
                </p>
                <p className="mt-0.5 text-base font-bold text-brand-primary">
                  {Number(service.price).toLocaleString("vi-VN")} đ
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Số lượng tồn / phục vụ
                </p>
                <p className="mt-0.5 text-base font-bold text-text-primary">
                  {service.quantity}
                </p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Thời gian tạo & Cập nhật */}
            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
              <div>
                <span className="block font-medium">Ngày tạo:</span>
                <span className="text-text-secondary">
                  {service.createdAt
                    ? formatDateTime(service.createdAt)
                    : "Chưa rõ"}
                </span>
              </div>
              <div>
                <span className="block font-medium">Cập nhật lần cuối:</span>
                <span className="text-text-secondary">
                  {service.updatedAt
                    ? formatDateTime(service.updatedAt)
                    : "Chưa rõ"}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}