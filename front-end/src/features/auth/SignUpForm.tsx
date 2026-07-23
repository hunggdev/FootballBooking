import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../../components/ui/label"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

const signUpSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.email("Email không hợp lệ").min(1, "Email không được để trống"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").max(10, "Số điện thoại chỉ có tối đa 10 số").min(1, "Số điện thoại không được để trống"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").min(1, "Mật khẩu không được để trống"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema)     
  });

  const onSubmit = async (data: SignUpFormValues) => {
    // goi BE de signup
    const {fullName, email, phone, password} = data;
    try {
      await signUp(fullName, email, phone, password); 
      navigate("/signin");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" className="w-20 h-20"/>
                </a>

              <h1 className="text-2xl font-bold">Tạo tài khoản của bạn</h1>
              <p className="text-muted-foreground text-balance">Nhập thông tin bên dưới để tạo tài khoản</p>
              </div>
              {/* họ và tên */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="fullName" className="block text-sm text-left">
                  Họ và tên
                </Label>
                <Input type="text" id="fullName" placeholder="Nguyen Van A" {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 ">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/*  email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm text-left">
                  Email
                </Label>
                <Input type="text" id="email" placeholder="user@gmail.com" {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 ">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/*  phone */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="phone" className="block text-sm text-left">
                  Số điện thoại
                </Label>
                <Input type="text" id="phone" placeholder="03xxxxxxxx" {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 ">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm text-left">
                  Mật khẩu
                </Label>
                <Input type="password" id="password" placeholder="********" {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 ">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* login */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Tạo tài khoản"}
              </Button>

              <div className="text-center">
                Đã có tài khoản ? {" "}
                <a href="/signin" className="font-medium underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>

            </div>



          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary *:[a]:underline text-muted-foreground *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản sử dụng</a>{" "}
        và <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  )
}
