import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/service";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Service | null;
  onSubmit: (data: CreateServicePayload | UpdateServicePayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const emptyForm = {
  name: "",
  description: "",
  image: "",
  price: "",
  quantity: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: ServiceFormDialogProps) {
  const isEditing = !!initialData;

  const defaultForm = initialData
    ? {
        name: initialData.name,
        description: initialData.description ?? "",
        image: initialData.image ?? "",
        price: String(initialData.price),
        quantity: String(initialData.quantity ?? ""),
        status: initialData.status,
      }
    : emptyForm;

  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      return "Tên dịch vụ không được để trống";
    }

    if (form.name.length > 255) {
      return "Tên dịch vụ tối đa 255 ký tự";
    }

    const price = Number(form.price);
    if (Number.isNaN(price) || price <= 0) {
      return "Giá dịch vụ phải lớn hơn 0";
    }

    // Thêm validation cho Số lượng
    const quantity = Number(form.quantity);
    if (form.quantity === "" || Number.isNaN(quantity) || quantity <= 0) {
      return "Số lượng dịch vụ phải lớn hơn 0";
    }

    return null;
  };

  const handleSubmit = () => {
    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError(null);

    const payload: CreateServicePayload | UpdateServicePayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      image: form.image.trim() || undefined,
      price: Number(form.price),
      quantity: Number(form.quantity),
      ...(isEditing ? { status: form.status } : {}),
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa dịch vụ" : "Thêm dịch vụ"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          <FieldWrapper>
            <FieldLabel>Tên dịch vụ</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Giá dịch vụ</FieldLabel>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Số lượng</FieldLabel>
            <Input
              type="number"
              value={form.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
            />
          </FieldWrapper>

          {isEditing && (
            <FieldWrapper>
              <FieldLabel>Trạng thái</FieldLabel>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateField(
                    "status",
                    (value ?? "ACTIVE") as "ACTIVE" | "INACTIVE"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Đang kinh doanh
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Ngừng kinh doanh
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}

          <FieldWrapper>
            <FieldLabel>Ảnh (URL)</FieldLabel>
            <Input
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Mô tả</FieldLabel>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </FieldWrapper>

          {(error || serverError) && (
            <p className="text-sm text-red-500">
              {error ?? serverError}
            </p>
          )}
        </FieldGroup>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
              ? "Lưu thay đổi"
              : "Tạo dịch vụ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}