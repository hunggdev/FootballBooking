import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";

const ChangePasswordSchema = z
  .object({
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
        "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      ),

    newPassword: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(64, "Mật khẩu tối đa 64 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      ),

    confirmPassword: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(64, "Mật khẩu tối đa 64 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword } = useUserStore();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const { password, newPassword, confirmPassword } = data;

    await changePassword(password, newPassword, confirmPassword);
  };

  return (
    <Card className="border-border bg-surface text-text-primary">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-text-primary">
          Bảo mật
        </CardTitle>
      </CardHeader>

      {!showForm ? (
        <>
          <CardContent>
            <p className="text-sm text-text-secondary">
              Đổi mật khẩu đăng nhập cho tài khoản của bạn.
            </p>
          </CardContent>

          <CardFooter className="border-t border-border-subtle">
            <Button
              type="button"
              className="bg-brand-primary font-semibold text-white hover:bg-brand-primary-hover"
              onClick={() => setShowForm(true)}
            >
              Đổi mật khẩu
            </Button>
          </CardFooter>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-4">
              {/* Mật khẩu hiện tại */}
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-text-secondary"
                >
                  Mật khẩu hiện tại
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    className="border-border bg-surface pr-10 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-status-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-text-secondary"
                >
                  Mật khẩu mới
                </Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    {...register("newPassword")}
                    className="border-border bg-surface pr-10 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.newPassword && (
                  <p className="text-sm text-status-danger">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="mb-5 space-y-1">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-text-secondary"
                >
                  Xác nhận mật khẩu mới
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    {...register("confirmPassword")}
                    className="border-border bg-surface pr-10 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-sm text-status-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 border-t border-border-subtle">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-primary font-semibold text-white hover:bg-brand-primary-hover"
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-border bg-transparent text-text-primary hover:bg-surface-hover hover:text-text-primary"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
            >
              Hủy
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}