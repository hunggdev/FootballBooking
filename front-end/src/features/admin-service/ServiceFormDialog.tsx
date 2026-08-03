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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Service | null;
  onSubmit: (values: CreateServicePayload | UpdateServicePayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

const getInitialFormState = (service?: Service | null) => ({
  name: service?.name ?? "",
  description: service?.description ?? "",
  image: service?.image ?? "",
  price: service?.price ?? 0,
  quantity: service?.quantity ?? 0,
  status: service?.status ?? "ACTIVE" as "ACTIVE" | "INACTIVE",
});

export function ServiceFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const [formState, setFormState] = useState(() =>
    getInitialFormState(initialData)
  );

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setFormState(getInitialFormState(initialData));
    }

    onOpenChange(value);
  };

const handleSubmit = () => {
  if (initialData) {
    onSubmit(formState as UpdateServicePayload);
  } else {
    onSubmit(formState as CreateServicePayload);
  }
};


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="image">Ảnh (URL)</Label>
            <Input
              id="image"
              value={formState.image}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="price">Giá</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={formState.price}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="quantity">Số lượng</Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={formState.quantity}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
            />
          </div>

          {initialData && (
            <div>
              <Label>Trạng thái</Label>

              <Select
                value={formState.status}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: value as "ACTIVE" | "INACTIVE",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Đang hoạt động
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Ngừng hoạt động
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {serverError && (
            <p className="text-sm text-red-500">{serverError}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Hủy
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang lưu..."
                : initialData
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}