import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../../components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"


const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email tối đa 255 ký tự"),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotPassword } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema)
  });


  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const { email } = data;
    await forgotPassword(email);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 h-100">
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
                <img src="/logo.svg" alt="logo" className="w-20 h-20" />
              </a>

              <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
              <p className="text-muted-foreground text-balance">Nhập email của bạn để reset mật khẩu</p>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <Label htmlFor="email" className="block text-sm text-left">
                Email
              </Label>
              <Input type="text" id="email" placeholder="user@gmail.com" {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-status-danger ">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Tiếp tục"}
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