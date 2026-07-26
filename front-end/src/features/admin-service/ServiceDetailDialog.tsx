import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useService } from "@/stores/useServiceStore";
import type { Service } from "@/types/service";

interface ServiceDetailDialogProps {
  serviceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabel: Record<Service["status"], string> = {
  ACTIVE: "Đang kinh doanh",
  INACTIVE: "Ngừng kinh doanh",
};

const statusVariant: Record<Service["status"], "default" | "destructive"> = {
  ACTIVE: "default",
  INACTIVE: "destructive",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN");
}

export function ServiceDetailDialog({
  serviceId,
  open,
  onOpenChange,
}: ServiceDetailDialogProps) {
  const { data, isLoading, error } = useService(serviceId ?? 0);

  const service: Service | undefined = data?.service;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chi tiết dịch vụ</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Không thể tải thông tin dịch vụ.
          </p>
        )}

        {service && (
          <div className="space-y-5">
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                className="h-56 w-full rounded-lg object-cover border"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{service.name}</h2>
              </div>

              <Badge variant={statusVariant[service.status]}>
                {statusLabel[service.status]}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Giá dịch vụ
                </p>

                <p className="font-semibold">
                  {service.price.toLocaleString("vi-VN")} đ
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Ngày tạo
                </p>

                <p>{formatDate(service.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật gần nhất
                </p>

                <p>{formatDate(service.updatedAt)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Mô tả
              </p>

              <p>{service.description || "Chưa có mô tả."}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
