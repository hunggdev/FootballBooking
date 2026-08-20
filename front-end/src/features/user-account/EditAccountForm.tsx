import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(10, "Số điện thoại chỉ có tối đa 10 số")
    .min(1, "Số điện thoại không được để trống"),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export function EditAccountForm({ user }: { user: User }) {
  const { updateMe } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone ?? "",
    },
  });

  const onSubmit = async (data: UpdateFormValues) => {
    const { fullName, phone } = data;

    await updateMe(fullName, phone);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-border bg-surface text-text-primary">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-text-primary">
            Chỉnh sửa thông tin
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Họ tên */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-medium text-text-secondary"
            >
              Họ và tên
            </Label>

            <Input
              id="fullName"
              className="border-border bg-surface text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
              {...register("fullName")}
            />

            {errors.fullName && (
              <p className="text-sm text-status-danger">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-text-secondary"
            >
              Email
            </Label>

            <Input
              id="email"
              className="border-border-subtle bg-elevated text-text-muted"
              value={user.email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-medium text-text-secondary"
            >
              Số điện thoại
            </Label>

            <Input
              id="phone"
              className="border-border bg-surface text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
              placeholder="Chưa cập nhật"
              {...register("phone")}
            />

            {errors.phone && (
              <p className="text-sm text-status-danger">
                {errors.phone.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border-subtle">
          <Button
            type="submit"
            className="bg-brand-primary font-semibold text-white hover:bg-brand-primary-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}