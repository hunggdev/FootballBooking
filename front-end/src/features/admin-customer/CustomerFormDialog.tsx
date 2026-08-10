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

import { z } from "zod";

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Họ tên không được để trống")
    .max(100, "Họ tên tối đa 100 ký tự")
    .regex(
      /^[A-Za-zÀ-ỹ\s]+$/,
      "Họ tên chỉ được chứa chữ cái và khoảng trắng"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email tối đa 255 ký tự"),

  phone: z
    .string()
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(
      /^(0[3|5|7|8|9])[0-9]{8}$/,
      "Số điện thoại không hợp lệ"
    ),

  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(64, "Mật khẩu tối đa 64 ký tự")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    ),

  status: z.enum(["ACTIVE", "BANNED", "INACTIVE"]),
});

export type CustomerForm = z.infer<typeof customerSchema>;

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
        password: "",
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

  

  const handleSubmit = () => {
    const schema = isEditing
      ? customerSchema.omit({ password: true })
      : customerSchema;

    const result = schema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);

    if (isEditing && initialData) {
      const updatePayload: UpdateCustomerPayload = {
        userId: initialData.userId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        status: (form.status === "ACTIVE" ? "ACTIVE" : (form.status === "BANNED" ? "BANNED" : "INACTIVE") as "BANNED" | "INACTIVE") as "ACTIVE" | "INACTIVE",
      };

      onSubmit(updatePayload);
      resetForm();
      return;
    }

    const createPayload: CreateCustomerPayload = {
      userId: 0,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
    };

    onSubmit(createPayload);
  };

  const resetForm = () => { 
    setForm(initialData ? defaultForm : emptyForm);
    setError(null);
  }

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
              : isEditing
              ? "Lưu thay đổi"
              : "Thêm khách hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}