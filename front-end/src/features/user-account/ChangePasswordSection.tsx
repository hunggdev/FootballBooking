// src/components/account/ChangePasswordSection.tsx
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

const ChangePasswordSchema = z.object({
  password: z.string().nonempty("Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  newPassword: z.string().nonempty("Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().nonempty("Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordSection() {
  const [showPassword, setShowPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {changePassword} = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const {register, handleSubmit, reset, formState: { errors, isSubmitting }}= useForm<ChangePasswordFormValues>({
      resolver: zodResolver(ChangePasswordSchema),
      mode: "onSubmit",
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const {password, newPassword, confirmPassword} = data;
    console.log(data);
    try{
      
      await changePassword(password, newPassword, confirmPassword);
    }catch{

    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Bảo mật</CardTitle>
      </CardHeader>

      {!showForm ? (
        <>
          <CardContent>
            <p className="text-sm opacity-60">
              Đổi mật khẩu đăng nhập cho tài khoản của bạn.
            </p>
          </CardContent>

          <CardFooter className="border-t">
            <Button
              type="button"
              variant="outline"
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
              <div className="space-y-1">
                <Label htmlFor="password">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    className="pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    {...register("password")}
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
                {errors.password && (
                  <p className="text-sm text-red-500 ">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 ">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 mb-5">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 ">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>

            <Button
              type="button"
              variant="outline"
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