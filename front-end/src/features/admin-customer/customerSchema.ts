import { z } from "zod";

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Họ tên không được để trống")
    .max(100, "Họ tên tối đa 100 ký tự")
    .regex(
      /^[A-Za-zÀ-ỹ\s]+$/,
      "Họ tên chỉ được chứa chữ cái và khoảng trắng"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(255, "Email tối đa 255 ký tự"),

  phone: z
    .string()
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(
      /^(0[35789])[0-9]{8}$/,
      "Số điện thoại không hợp lệ"
    ),

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
      "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    ),

  status: z.enum(["ACTIVE", "BANNED", "INACTIVE"]),
});

export type CustomerForm = z.infer<typeof customerSchema>;