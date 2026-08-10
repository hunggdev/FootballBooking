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

import {
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Service | null;
  onSubmit: (values: CreateServicePayload | UpdateServicePayload) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

const emptyForm = {
  name: "",
  description: "",
  image: "",
  price: 0,
  quantity: 0,
  status: "ACTIVE",
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: Props) {
  const isEditing = !!initialData;

  const defaultForm = initialData
    ? {
        name: initialData.name,
        description: initialData.description ?? "",
        image: initialData.image ?? "",
        price: initialData.price,
        quantity: initialData.quantity,
        status: initialData.status ?? "ACTIVE" as "ACTIVE" | "INACTIVE",
      }
    : emptyForm;

const [form, setForm] = useState(defaultForm);

const [error, setError] = useState<string | null>(null);

const updateService = <K extends keyof typeof form>(
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
  if (form.price < 0) {
    return "Giá không hợp lệ";
  }
  if (form.quantity < 0) {
    return "Số lượng không hợp lệ";
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
      price: form.price,
      quantity: form.quantity,
      status: form.status as "ACTIVE" | "INACTIVE",
    };

    onSubmit(payload);

    resetForm();
  };

  const resetForm = () => { 
    setForm(initialData ? defaultForm : emptyForm);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          <FieldWrapper>
            <FieldLabel htmlFor="name">Tên dịch vụ</FieldLabel>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateService("name", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="description">Mô tả</FieldLabel>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateService("description", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="image">Ảnh (URL)</FieldLabel>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => updateService("image", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="price">Giá</FieldLabel>
            <Input
              id="price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => updateService("price", Number(e.target.value))}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="quantity">Số lượng</FieldLabel>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => updateService("quantity", Number(e.target.value))}
            />
          </FieldWrapper>


          {isEditing &&
          <FieldWrapper>
            <FieldLabel>Trạng thái</FieldLabel>
            <Select
              value={form.status || undefined}
              onValueChange={(value) => updateService("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </FieldWrapper>}

          {(error || serverError) && (
              <p className="text-sm text-red-500">
                  {error ?? serverError}
              </p>
          )}
        </FieldGroup>

        <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                  resetForm();
                  onOpenChange(false);
              }}
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
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}