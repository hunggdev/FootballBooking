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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Service | null;
  onSubmit: (
    values: CreateServicePayload | UpdateServicePayload
  ) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

const emptyForm = {
  name: "",
  description: "",
  image: "",
  price: 0,
  quantity: 0,
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
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
      status: initialData.status ?? "ACTIVE",
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

    const payload:
      | CreateServicePayload
      | UpdateServicePayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      image: form.image.trim() || undefined,
      price: form.price,
      quantity: form.quantity,
      status: form.status,
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
      <DialogContent
        className="
          max-w-xl
          border-border
          bg-elevated
          text-text-primary
          ring-border
        "
      >
        {/* ================= HEADER ================= */}
        <DialogHeader>
          <DialogTitle
            className="
              text-xl
              font-semibold
              text-brand-primary
            "
          >
            {isEditing
              ? "Chỉnh sửa dịch vụ"
              : "Thêm dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>

        {/* ================= FORM ================= */}
        <FieldGroup className="space-y-4">
          {/* TÊN */}
          <FieldWrapper>
            <FieldLabel className="text-text-secondary">
              Tên dịch vụ
            </FieldLabel>

            <Input
              value={form.name}
              onChange={(e) =>
                updateService("name", e.target.value)
              }
              placeholder="Nhập tên dịch vụ..."
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                transition-all
                duration-200
                focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
              "
            />
          </FieldWrapper>

          {/* MÔ TẢ */}
          <FieldWrapper>
            <FieldLabel className="text-text-secondary">
              Mô tả
            </FieldLabel>

            <Textarea
              value={form.description}
              onChange={(e) =>
                updateService("description", e.target.value)
              }
              placeholder="Nhập mô tả dịch vụ..."
              className="
                min-h-[90px]
                resize-none
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                transition-all
                duration-200
                focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
              "
            />
          </FieldWrapper>

          {/* ẢNH */}
          <FieldWrapper>
            <FieldLabel className="text-text-secondary">
              Ảnh (URL)
            </FieldLabel>

            <Input
              value={form.image}
              onChange={(e) =>
                updateService("image", e.target.value)
              }
              placeholder="https://..."
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                transition-all
                duration-200
                focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
              "
            />
          </FieldWrapper>

          {/* GIÁ + SỐ LƯỢNG */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper>
              <FieldLabel className="text-text-secondary">
                Giá
              </FieldLabel>

              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  updateService(
                    "price",
                    Number(e.target.value)
                  )
                }
                className="
                  border-border
                  bg-surface
                  text-text-primary
                  transition-all
                  duration-200
                  focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
                "
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-text-secondary">
                Số lượng
              </FieldLabel>

              <Input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) =>
                  updateService(
                    "quantity",
                    Number(e.target.value)
                  )
                }
                className="
                  border-border
                  bg-surface
                  text-text-primary
                  transition-all
                  duration-200
                  focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
                "
              />
            </FieldWrapper>
          </div>

          {/* TRẠNG THÁI */}
          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-text-secondary">
                Trạng thái
              </FieldLabel>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateService(
                    "status",
                    value as "ACTIVE" | "INACTIVE"
                  )
                }
              >
                <SelectTrigger
                  className="
                    w-full
                    border-border
                    bg-surface
                    text-text-primary
                    data-placeholder:text-text-muted
                    transition-all
                    duration-200
                    hover:border-brand-accent/50
                    focus-visible:border-brand-accent focus-visible:ring-brand-accent/30
                  "
                >
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>

                <SelectContent
                  className="
                    border-border
                    bg-elevated
                    text-text-primary
                  "
                >
                  <SelectItem
                    value="ACTIVE"
                    className="
                      text-text-secondary
                  
                      focus:text-text-primary
                    "
                  >
                    Đang hoạt động
                  </SelectItem>

                  <SelectItem
                    value="INACTIVE"
                    className="
                      text-text-secondary
                
                      focus:text-text-primary
                    "
                  >
                    Ngừng hoạt động
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}

          {/* ERROR */}
          {(error || serverError) && (
            <p className="text-sm text-status-danger">
              {error ?? serverError}
            </p>
          )}
        </FieldGroup>

        {/* ================= FOOTER ================= */}
        <DialogFooter className="border-border bg-elevated">
          <Button
            variant="outline"
            className="
              border-border
              bg-transparent
              text-text-secondary
              transition-all
              duration-200
              hover:border-brand-accent/40
              hover:bg-brand-accent/10
              hover:text-brand-accent
            "
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
            className="border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"
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