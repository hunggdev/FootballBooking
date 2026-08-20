import { prisma } from "../config/database.js";

export const validateUser = (user) => {
  const { fullName, email, phone, password } = user;

  if (!fullName || !email || !phone || !password) {
    return "Tất cả các trường không được để trống";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email không đúng định dạng";
  }

  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phone)) {
    return "Số điện thoại không đúng định dạng";
  }

  return null;
};

export const duplicateUser = async (email, phone) => {
  const duplicate = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { phone: phone }],
    },
  });

  if (duplicate) {
    return "Email hoặc số điện thoại đã tồn tại";
  }

  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phone)) {
    return "Số điện thoại không đúng định dạng";
  }

  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email không đúng định dạng";
  }

  return null;
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Mật khẩu không đúng định dạng";
  }
  return null;
};
