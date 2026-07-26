import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useField } from "@/stores/useFieldStore";
import type { Field } from "@/types/field";

interface FieldDetailDialogProps {
  fieldId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabel: Record<Field["status"], string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Đang bảo trì",
  INACTIVE: "Ngừng hoạt động",
};

const statusVariant: Record<
  Field["status"],
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  MAINTENANCE: "secondary",
  INACTIVE: "destructive",
};

const fieldTypeLabel: Record<Field["fieldType"], string> = {
  FIVE: "Sân 5 người",
  SEVEN: "Sân 7 người",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN");
}

export function FieldDetailDialog({
  fieldId,
  open,
  onOpenChange,
}: FieldDetailDialogProps) {
  const { data, isLoading, error } = useField(fieldId ?? 0);

  const field: Field | undefined = data?.field;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chi tiết sân bóng</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Không thể tải thông tin sân.
          </p>
        )}

        {field && (
          <div className="space-y-5">
            {field.image && (
              <img
                src={field.image}
                alt={field.name}
                className="h-56 w-full rounded-lg object-cover border"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{field.name}</h2>

                <p className="text-muted-foreground">
                  {fieldTypeLabel[field.fieldType]}
                </p>
              </div>

              <Badge variant={statusVariant[field.status]}>
                {statusLabel[field.status]}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Giá thuê / giờ
                </p>

                <p className="font-semibold">
                  {field.pricePerHour.toLocaleString("vi-VN")} đ
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Khung giờ hoạt động
                </p>

                <p className="font-semibold">
                  {field.openTime} - {field.closeTime}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Ngày tạo
                </p>

                <p>{formatDate(field.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật gần nhất
                </p>

                <p>{formatDate(field.updatedAt)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Mô tả
              </p>

              <p>{field.description || "Chưa có mô tả."}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}