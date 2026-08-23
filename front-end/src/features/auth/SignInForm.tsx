import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../../components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email tối đa 255 ký tự"),

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
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { email, password } = data;
    try {
      await signIn(email, password);
      const { user } = useAuthStore.getState();
      navigate(user?.role?.toLowerCase() === "admin" ? "/admin" : "/user"); // chỉ navigate khi đăng nhập thành công
    } catch {
      // lỗi đã được xử lý và hiển thị toast trong store
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" className="w-20 h-20" />
                </a>

                <h1 className="text-2xl font-bold">
                  Đăng nhập vào tài khoản của bạn
                </h1>
                <p className="text-muted-foreground text-balance">
                  Nhập thông tin bên dưới để đăng nhập
                </p>
              </div>

              {/*  email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm text-left">
                  Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  placeholder="user@gmail.com"
                  className="w-full rounded-lg border px-3 py-2
                            autofill:shadow-[inset_0_0_0px_1000px_#ffffff]
                            autofill:[-webkit-text-fill-color:#000000]"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 ">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm text-left">
                    Mật khẩu
                  </Label>
                  <a
                    href="/forgot-password"
                    className="font-medium hover:underline underline-offset-4"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="w-full rounded-lg border px-3 py-2
                            autofill:shadow-[inset_0_0_0px_1000px_#ffffff]
                            autofill:[-webkit-text-fill-color:#000000]"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 ">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* login */}
              <Button type="submit" className="w-full">
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="text-center">
                Chưa có tài khoản ?{" "}
                <a
                  href="/signup"
                  className="font-medium underline underline-offset-4"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/3 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary *:[a]:underline text-muted-foreground *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> và{" "}
        <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  );
}
