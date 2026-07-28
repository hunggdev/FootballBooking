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
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Customer | null;
  onSubmit: (data: CreateCustomerPayload | UpdateCustomerPayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  status: "ACTIVE" as "ACTIVE" | "BANNED" | "INACTIVE",
};

export function CustomerFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: CustomerFormDialogProps) { 
  const isEditing = !!initialData;
  const defaultForm = initialData
    ? {
        fullName: initialData.fullName,
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        password: initialData.password ?? "",
        status: initialData.status,
      }
    : emptyForm;

const [form, setForm] = useState(defaultForm);

const [error, setError] = useState<string | null>(null);

  
  const updateCustomer = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      return "Tên khách hàng không được để trống";
    }

    if (form.fullName.length > 255) {
      return "Tên khách hàng tối đa 255 ký tự";
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

    const payload: CreateCustomerPayload | UpdateCustomerPayload = {
      userId: initialData?.userId,
      fullName: form.fullName.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      password: form.password.trim() || undefined,
      ...(isEditing ? { status: form.status } : {}),
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa thông tin khách hàng" : "Thêm khách hàng"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">

          <FieldWrapper>
            <FieldLabel>Họ tên khách hàng</FieldLabel>

            <Input
              value={form.fullName}
              onChange={(e) => updateCustomer("fullName", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Email</FieldLabel>

            <Input
              value={form.email}
              onChange={(e) => updateCustomer("email", e.target.value)}
              disabled={isEditing?true: false}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Số điện thoại</FieldLabel>

            <Input
              value={form.phone}
              onChange={(e) => updateCustomer("phone", e.target.value)}
            />
          </FieldWrapper>

          {!isEditing && (
            <FieldWrapper>
              <FieldLabel>Mật khẩu</FieldLabel>

              <Input
                value={form.password}
                onChange={(e) => updateCustomer("password", e.target.value)}
              />
            </FieldWrapper>
          )}

          {isEditing && (
            <FieldWrapper>
              <FieldLabel>Trạng thái</FieldLabel>

              <Select   
                value={form.status}
                onValueChange={(value) =>
                  updateCustomer(
                    "status",
                    (value ?? "ACTIVE") as
                      | "ACTIVE"
                      | "BANNED"
                      | "INACTIVE"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Đang hoạt động
                  </SelectItem>

                  <SelectItem value="BANNED">
                    Khóa
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Ngừng hoạt động
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}

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
              : "Thêm khách hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}