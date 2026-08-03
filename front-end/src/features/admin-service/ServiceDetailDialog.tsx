import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
// import type { Service } from "@/types/service";
import { useService } from "@/stores/useServiceStore";

interface Props {
  serviceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailDialog({ serviceId, open, onOpenChange }: Props) {
  const { data: service, isLoading, error } = useService(serviceId ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết dịch vụ</DialogTitle>
        </DialogHeader>

        {isLoading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">Không thể tải dịch vụ.</p>}
        {!service && !isLoading && !error && (
          <p className="text-muted-foreground">Không có dữ liệu.</p>
        )}

        {service && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-24 w-32 rounded-md object-cover border"
                />
              ) : (
                <div className="flex h-24 w-32 items-center justify-center rounded-md border text-xs text-muted-foreground">
                  No Image
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold">{service.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {service.description ?? "Không có mô tả"}
                </p>
              </div>
            </div>

            <div>
              <Label>Giá</Label>
              <p>{service.price.toLocaleString("vi-VN")} đ</p>
            </div>

            <div>
              <Label>Số lượng</Label>
              <p>{service.quantity}</p>
            </div>

            <div>
              <Label>Trạng thái</Label>
              <p>
                {service.status === "ACTIVE" ? (
                  <span className="text-green-600 font-semibold">Đang hoạt động</span>
                ) : (
                  <span className="text-red-600 font-semibold">Ngừng hoạt động</span>
                )}
              </p>
            </div>

            <div>
              <Label>Ngày tạo</Label>
              <p>{new Date(service.createdAt).toLocaleString("vi-VN")}</p>
            </div>

            <div>
              <Label>Ngày cập nhật</Label>
              <p>{new Date(service.updatedAt).toLocaleString("vi-VN")}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
