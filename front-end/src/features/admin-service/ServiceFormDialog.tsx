import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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
import { PackagePlus, PackageCheck, AlertCircle, Loader2 } from "lucide-react";

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
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) setError(null);
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
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                {isEditing ? (
                  <PackageCheck className="h-5 w-5" />
                ) : (
                  <PackagePlus className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  {isEditing
                    ? `Sửa dịch vụ #${initialData?.serviceId || initialData?.id}`
                    : "Thêm dịch vụ mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {isEditing
                    ? "Cập nhật thông tin đơn giá, tồn kho và hình ảnh dịch vụ"
                    : "Tạo mới dịch vụ/tiện ích đi kèm cho khách đặt sân"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {(error || serverError) && (
            <div className="flex items-center gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg p-3.5 text-xs font-medium text-status-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error ?? serverError}</span>
            </div>
          )}

          <FieldGroup className="space-y-4">
            {/* TÊN DỊCH VỤ */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Tên dịch vụ <span className="text-status-danger">*</span>
              </FieldLabel>
              <Input
                value={form.name}
                onChange={(e) => updateService("name", e.target.value)}
                placeholder="VD: Nước khoáng Lavie 500ml, Thuê áo pitch..."
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* MÔ TẢ */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mô tả chi tiết
              </FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => updateService("description", e.target.value)}
                placeholder="Nhập thông tin chi tiết về dịch vụ..."
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted min-h-[75px] focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* ẢNH */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                URL Hình ảnh
              </FieldLabel>
              <Input
                value={form.image}
                onChange={(e) => updateService("image", e.target.value)}
                placeholder="https://example.com/nuoc-khoang.jpg"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* GIÁ + SỐ LƯỢNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Đơn giá (VNĐ) <span className="text-status-danger">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) =>
                    updateService("price", Number(e.target.value))
                  }
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Số lượng mặc định<span className="text-status-danger">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(e) =>
                    updateService("quantity", Number(e.target.value))
                  }
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>
            </div>

            {/* TRẠNG THÁI */}
            {isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trạng thái kinh doanh
                </FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateService("status", value as "ACTIVE" | "INACTIVE")
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {form.status === "ACTIVE"
                        ? "Đang kinh doanh"
                        : "Ngừng kinh doanh"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="ACTIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đang kinh doanh
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Ngừng kinh doanh
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          </FieldGroup>
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end gap-3 p-4 bg-elevated/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={isSubmitting}
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-5"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo dịch vụ"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
