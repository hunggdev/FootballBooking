import { prisma } from "../config/database.js";
const validateField = ({
  name,
  pricePerHour,
  openTime,
  closeTime,
  fieldType,
}) => {
  const fieldName = (name ?? "").trim().replace(/\s+/g, " ");

  if (!fieldName) {
    return "Tên sân không được để trống";
  }

  if (fieldName.length > 255) {
    return "Tên sân tối đa 255 ký tự";
  }

  const price = Number(pricePerHour);

  if (Number.isNaN(price) || price <= 0) {
    return "Giá thuê phải lớn hơn 0";
  }

  if (!openTime || !closeTime) {
    return "Vui lòng nhập giờ hoạt động";
  }

  if (openTime >= closeTime) {
    return "Giờ mở phải nhỏ hơn giờ đóng";
  }

  if (!["FIVE", "SEVEN"].includes(fieldType)) {
    return "Loại sân không hợp lệ";
  }

  return null;
};
const checkFieldConflict = async ({
  fieldId,
  name,
  fieldType,
  openTime,
  closeTime,
}) => {
  const normalizedName = name.trim().replace(/\s+/g, " ");

  return prisma.field.findFirst({
    where: {
      fieldType,
      status: {
        in: ["ACTIVE", "MAINTENANCE"],
      },
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      ...(fieldId
        ? {
            NOT: {
              fieldId,
            },
          }
        : {}),
      AND: [
        {
          openTime: {
            lt: closeTime,
          },
        },
        {
          closeTime: {
            gt: openTime,
          },
        },
      ],
    },
  });
};
// Xem dsach
export const getFields = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const showAll = isAdmin && req.query.all === "1";

    const fields = await prisma.field.findMany({
      where: showAll ? {} : { status: "ACTIVE" },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Lấy danh sách sân thành công",
      fields,
    });
  } catch (error) {
    console.error("GET FIELDS:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

//Xem chi tiết
export const getFieldById = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const field = await prisma.field.findUnique({
      where: {
        fieldId,
      },
    });

    if (!field) {
      return res.status(404).json({
        message: "Không tìm thấy sân",
      });
    }

    return res.status(200).json({
      field,
    });
  } catch (error) {
    console.error("GET FIELD:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

//Tạo sân
export const createField = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      pricePerHour,
      openTime,
      closeTime,
      fieldType,
    } = req.body;

    const error = validateField({
      name,
      pricePerHour,
      openTime,
      closeTime,
      fieldType,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    const conflict = await checkFieldConflict({
      name: normalizedName,
      fieldType,
      openTime,
      closeTime,
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "Đã tồn tại sân cùng tên, cùng loại và thời gian hoạt động bị trùng.",
      });
    }

    const field = await prisma.field.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        image: image?.trim() || null,
        pricePerHour: Number(pricePerHour),
        openTime,
        closeTime,
        fieldType,
        status: "ACTIVE",
      },
    });

    return res.status(201).json({
      message: "Tạo sân thành công",
      field,
    });
  } catch (error) {
    console.error("CREATE FIELD:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

//update sân
export const updateField = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const {
      name,
      description,
      image,
      pricePerHour,
      openTime,
      closeTime,
      fieldType,
      status,
    } = req.body;

    const field = await prisma.field.findUnique({
      where: {
        fieldId,
      },
    });

    if (!field) {
      return res.status(404).json({
        message: "Không tìm thấy sân",
      });
    }

    const error = validateField({
      name,
      pricePerHour,
      openTime,
      closeTime,
      fieldType,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    if (!["ACTIVE", "MAINTENANCE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
      });
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    const conflict = await checkFieldConflict({
      fieldId,
      name: normalizedName,
      fieldType,
      openTime,
      closeTime,
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "Đã tồn tại sân cùng tên, cùng loại và thời gian hoạt động bị trùng.",
      });
    }

    const updatedField = await prisma.field.update({
      where: {
        fieldId,
      },
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        image: image?.trim() || null,
        pricePerHour: Number(pricePerHour),
        openTime,
        closeTime,
        fieldType,
        status,
      },
    });

    return res.status(200).json({
      message: "Cập nhật sân thành công",
      field: updatedField,
    });
  } catch (error) {
    console.error("UPDATE FIELD:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// Deleted sân
export const deleteField = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const field = await prisma.field.findUnique({
      where: { fieldId },
    });

    if (!field) {
      return res.status(404).json({
        message: "Không tìm thấy sân",
      });
    }

    const updatedField = await prisma.field.update({
      where: { fieldId },
      data: {
        status: "INACTIVE",
      },
    });

    return res.status(200).json({
      message: "Xóa sân thành công",
      field: updatedField,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
// Khi hoàn thành module Booking,
// kiểm tra xem sân còn lịch đặt có trạng thái
// PENDING / CONFIRMED / PLAYING hay không.
// Nếu có thì không cho xóa.
