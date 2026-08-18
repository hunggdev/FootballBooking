import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

import { customerSchema } from "./customerSchema";

type CustomerStatus = "ACTIVE" | "BANNED" | "INACTIVE";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  status: CustomerStatus;
}

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Customer | null;
  onSubmit: (
    data: CreateCustomerPayload | UpdateCustomerPayload
  ) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  status: "ACTIVE",
};

function getFormFromCustomer(
  customer?: Customer | null
): FormState {
  if (!customer) {
    return emptyForm;
  }

  return {
    fullName: customer.fullName,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    password: "",
    status: customer.status as CustomerStatus,
  };
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: CustomerFormDialogProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<FormState>(() =>
    getFormFromCustomer(initialData)
  );

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const updateCustomer = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError(null);
  };

  const resetForm = () => {
    setForm(getFormFromCustomer(initialData));
    setError(null);
    setShowPassword(false);
  };

  const handleSubmit = () => {
    const schema = isEditing
      ? customerSchema.omit({ password: true })
      : customerSchema;

    const result = schema.safeParse(form);

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Dữ liệu không hợp lệ."
      );
      return;
    }

    setError(null);

    // =========================
    // UPDATE CUSTOMER
    // =========================
    if (isEditing && initialData) {
      const updatePayload: UpdateCustomerPayload = {
        userId: initialData.userId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        status: form.status,
      };

      onSubmit(updatePayload);
      return;
    }

    // =========================
    // CREATE CUSTOMER
    // =========================
    const createPayload: CreateCustomerPayload = {
      userId: 0,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
    };

    onSubmit(createPayload);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        className="
          max-h-[85vh]
          max-w-xl
          overflow-y-auto
          border-border
          bg-elevated
          text-text-primary
          ring-border
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            {isEditing
              ? "Sửa thông tin khách hàng"
              : "Thêm khách hàng"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4 pt-2">
          {/* =========================
              HỌ TÊN
          ========================== */}
          <FieldWrapper>
            <FieldLabel className="text-sm font-medium text-text-secondary">
              Họ tên khách hàng
            </FieldLabel>

            <Input
              value={form.fullName}
              onChange={(e) =>
                updateCustomer(
                  "fullName",
                  e.target.value
                )
              }
              placeholder="Nhập họ tên khách hàng"
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                focus-visible:border-brand-primary
                focus-visible:ring-brand-primary/20
              "
            />
          </FieldWrapper>

          {/* =========================
              EMAIL
          ========================== */}
          <FieldWrapper>
            <FieldLabel className="text-sm font-medium text-text-secondary">
              Email
            </FieldLabel>

            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateCustomer(
                  "email",
                  e.target.value
                )
              }
              disabled={isEditing}
              placeholder="example@gmail.com"
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                focus-visible:border-brand-primary
                focus-visible:ring-brand-primary/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </FieldWrapper>

          {/* =========================
              SỐ ĐIỆN THOẠI
          ========================== */}
          <FieldWrapper>
            <FieldLabel className="text-sm font-medium text-text-secondary">
              Số điện thoại
            </FieldLabel>

            <Input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                updateCustomer(
                  "phone",
                  e.target.value
                )
              }
              placeholder="Nhập số điện thoại"
              className="
                border-border
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                focus-visible:border-brand-primary
                focus-visible:ring-brand-primary/20
              "
            />
          </FieldWrapper>

          {/* =========================
              MẬT KHẨU
          ========================== */}
          {!isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-sm font-medium text-text-secondary">
                Mật khẩu
              </FieldLabel>

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    updateCustomer(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Nhập mật khẩu"
                  className="
                    border-border
                    bg-surface
                    pr-10
                    text-text-primary
                    placeholder:text-text-muted
                    focus-visible:border-brand-primary
                    focus-visible:ring-brand-primary/20
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-text-muted
                    transition-colors
                    hover:text-text-primary
                  "
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FieldWrapper>
          )}

          {/* =========================
              TRẠNG THÁI
          ========================== */}
          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-sm font-medium text-text-secondary">
                Trạng thái
              </FieldLabel>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateCustomer(
                    "status",
                    (value ??
                      "ACTIVE") as CustomerStatus
                  )
                }
              >
                <SelectTrigger
                  className="
                    border-border
                    bg-surface
                    text-text-primary
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
                      focus:bg-status-success-bg
                      focus:text-status-success
                    "
                  >
                    Đang hoạt động
                  </SelectItem>

                  <SelectItem
                    value="BANNED"
                    className="
                      text-text-secondary
                      focus:bg-status-danger-bg
                      focus:text-status-danger
                    "
                  >
                    Đã khóa
                  </SelectItem>

                  <SelectItem
                    value="INACTIVE"
                    className="
                      text-text-secondary
                      focus:bg-status-warning-bg
                      focus:text-status-warning
                    "
                  >
                    Ngừng hoạt động
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}

          {/* =========================
              ERROR
          ========================== */}
          {(error || serverError) && (
            <div
              className="
                rounded-lg
                border
                border-status-danger/30
                bg-status-danger-bg
                px-3
                py-2
              "
            >
              <p className="text-sm text-status-danger">
                {error ?? serverError}
              </p>
            </div>
          )}
        </FieldGroup>

        {/* =========================
            FOOTER
        ========================== */}
        <DialogFooter className="border-border bg-elevated">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={isSubmitting}
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
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              border-transparent bg-brand-accent font-semibold text-accent-foreground hover:bg-brand-accent-hover"

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