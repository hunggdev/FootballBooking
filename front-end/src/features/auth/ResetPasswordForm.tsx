import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../../components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useSearchParams } from "react-router";




const ResetPasswordSchema = z.object({
    newPassword: z.string().nonempty("Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().nonempty("Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});


type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {resetPassword} = useAuthStore(); 
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",

  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const {newPassword} = data;
    try {
      await resetPassword(token, newPassword);
    } catch(error) {
      throw error
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/4 -translate-y-1/2 object-cover"
            />
          </div>

          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center text-center gap-2">
              <a href="/" className="mx-auto block w-fit text-center">
                <img src="/logo.svg" alt="logo" className="w-20 h-20"/>
              </a>

              <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
              <p className="text-muted-foreground text-balance">Nhập email của bạn để reset mật khẩu</p>
            </div>
            {/* newPassword */}
            <div className="flex flex-col gap-3 mt-10">
                <Label htmlFor="newPassword" className="block text-sm text-left">
                    Mật khẩu mới
                </Label>
                <Input type="text" id="newPassword" placeholder="Mật khẩu mới" {...register("newPassword")}
                />
                {errors.newPassword && (
                    <p className="text-sm text-red-500 ">
                    {errors.newPassword.message}
                    </p>
                )}
            </div>

            {/* confirmPassword */}
            <div className="flex flex-col gap-3 mt-5">
                <Label htmlFor="confirmPassword" className="block text-sm text-left">
                    Xác nhận mật khẩu
                </Label>
                <Input type="text" id="confirmPassword" placeholder="Xác nhận mật khẩu" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500 ">
                    {errors.confirmPassword.message}
                    </p>
                )}
            </div>
            {/* button submit */}
            <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Xác nhận"}
            </Button>

          </form>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary *:[a]:underline text-muted-foreground *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản sử dụng</a>{" "}
        và <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  )
}