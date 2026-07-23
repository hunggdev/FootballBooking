// src/components/account/EditAccountForm.tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";

const updateSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").max(10, "Số điện thoại chỉ có tối đa 10 số").min(1, "Số điện thoại không được để trống"),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export function EditAccountForm({ user }: { user: User }) {
  const {updateMe} = useUserStore();
  const {register, handleSubmit, formState: { errors, isSubmitting }}= useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone ?? "",
    },
  });

  const onSubmit = async (data: UpdateFormValues) => {
    const {fullName, phone} = data;

    try {
      await updateMe(fullName, phone);
    } catch (error) {
      throw error;
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base">
            Chỉnh sửa thông tin
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Họ tên */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName" className="text-xs">Họ và tên</Label>

            <Input
              className="border"
              {...register("fullName")}
            />

            {errors.fullName && (
              <p className="text-sm text-red-500 ">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs">Email</Label>

            <Input
              className="border"
              value={user.email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="text-xs">Số điện thoại</Label>

            <Input
              className="border"
              placeholder="Chưa cập nhật"
              {...register("phone")}
            />

            {errors.phone && (
                  <p className="text-sm text-red-500 ">
                    {errors.phone.message}
                  </p>
                )}
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <Button
            type="submit"
            variant="outline"
            className="border"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
