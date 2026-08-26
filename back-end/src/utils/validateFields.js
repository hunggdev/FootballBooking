import { prisma } from "../config/database.js";

export const validateField = ({ name, fieldType }) => {
  const fieldName = (name ?? "").trim().replace(/\s+/g, " ");

  if (!fieldName) {
    return "Tên sân không được để trống";
  }

  if (!["FIVE", "SEVEN", "ELEVEN"].includes(fieldType)) {
    return "Loại sân không hợp lệ";
  }

  return null;
};

export const checkFieldConflict = async ({ fieldId, name, fieldType }) => {
  return prisma.field.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      status: "ACTIVE", 
      fieldType,

      ...(fieldId && {
        NOT: {
          fieldId,
        },
      }),
    },
  });
};
