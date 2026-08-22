import { useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  UserCog,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onSubmit: (data: CreateCustomerPayload | UpdateCustomerPayload) => void;
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

function getFormFromCustomer(customer?: Customer | null): FormState {
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
    getFormFromCustomer(initialData),
  );

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const updateCustomer = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
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
      setError(result.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.");
      return;
    }

    setError(null);

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                {isEditing ? (
                  <UserCog className="h-5 w-5" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  {isEditing
                    ? `Sửa thông tin khách hàng #${initialData?.userId}`
                    : "Thêm khách hàng mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {isEditing
                    ? "Cập nhật lại thông tin định danh và trạng thái tài khoản"
                    : "Tạo tài khoản thành viên mới trên hệ thống"}
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
            {/* Họ tên */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Họ và tên khách hàng{" "}
                <span className="text-status-danger">*</span>
              </FieldLabel>
              <Input
                value={form.fullName}
                onChange={(e) => updateCustomer("fullName", e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Địa chỉ Email{" "}
                  {!isEditing && <span className="text-status-danger">*</span>}
                </FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateCustomer("email", e.target.value)}
                  disabled={isEditing}
                  placeholder="example@gmail.com"
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Số điện thoại <span className="text-status-danger">*</span>
                </FieldLabel>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateCustomer("phone", e.target.value)}
                  placeholder="0912345678"
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>
            </div>

            {/* Mật khẩu (khi thêm mới) */}
            {!isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Mật khẩu đăng nhập{" "}
                  <span className="text-status-danger">*</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateCustomer("password", e.target.value)}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    className="border-border bg-elevated/60 pr-10 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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

            {/* Trạng thái (khi sửa) */}
            {isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trạng thái tài khoản
                </FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateCustomer(
                      "status",
                      (value ?? "ACTIVE") as CustomerStatus,
                    )
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {form.status === "ACTIVE"
                        ? "Đang hoạt động"
                        : form.status === "INACTIVE"
                          ? "Ngừng hoạt động"
                          : form.status === "BANNED"
                            ? "Đã khóa tài khoản"
                            : "Sân 11"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="ACTIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đang hoạt động
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Ngừng hoạt động
                    </SelectItem>
                    <SelectItem
                      value="BANNED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã khóa tài khoản
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
              "Thêm khách hàng"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
