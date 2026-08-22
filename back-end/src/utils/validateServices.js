import { prisma } from "../config/database.js";

export const validateService = ({ name, price, quantity }) => {
  const serviceName = name?.trim().replace(/\s+/g, " ");

  if (!serviceName) {
    return "Tên dịch vụ không được để trống";
  }

  if (serviceName.length > 255) {
    return "Tên dịch vụ tối đa 255 ký tự";
  }

  const servicePrice = Number(price);
  if (Number.isNaN(servicePrice) || servicePrice <= 0) {
    return "Giá dịch vụ phải lớn hơn 0";
  }

  if (quantity !== undefined) {
    const serviceQuantity = Number(quantity);
    if (Number.isNaN(serviceQuantity) || serviceQuantity < 0) {
      return "Số lượng dịch vụ không được nhỏ hơn 0";
    }
  }

  return null;
};

// Check trùng tên
export const checkServiceConflict = async ({ serviceId, name }) => {
  return prisma.service.findFirst({
    where: {
      status: "ACTIVE",
      name: {
        equals: name.trim().replace(/\s+/g, " "),
        mode: "insensitive",
      },
      ...(serviceId
        ? {
            NOT: {
              serviceId,
            },
          }
        : {}),
    },
  });
};
