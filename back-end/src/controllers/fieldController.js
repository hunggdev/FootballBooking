import { prisma } from "../config/database.js";
import { validateField, checkFieldConflict } from "../utils/validateFields.js";
import { parseTimeStringToDate } from "../utils/validateFieldSlots.js";

export const getFields = async (req, res) => {
  try {
    const { type } = req.query;

    const fields = await prisma.field.findMany({
      where: type
        ? {
            fieldType: type,
          }
        : {},
    });

    return res.status(200).json({
      message: "Lấy danh sách sân thành công",
      fields,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const getFieldById = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const field = await prisma.field.findUnique({
      where: {
        fieldId,
      },
      include: {
        fieldSlots: {
          orderBy: {
            starttime: "asc",
          },
        },
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
    console.log(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const createField = async (req, res) => {
  try {
    const {
      name,
      description = null,
      image = null,
      fieldType,
      selectedFieldSlots,
    } = req.body;

    const error = validateField({
      name,
      fieldType,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    const duplicated = await checkFieldConflict({
      name: normalizedName,
      fieldType,
    });

    if (duplicated) {
      return res.status(409).json({
        message: "Tên sân đã tồn tại",
      });
    }

    const field = await prisma.field.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        image: image?.trim() || null,
        fieldType,
        status: "ACTIVE",
      },
    });

    const data = selectedFieldSlots.map((slot) => ({
      fieldId: field.fieldId,
      starttime: parseTimeStringToDate(slot.starttime),
      endtime: parseTimeStringToDate(slot.endtime),
      price: Number(slot.price),
      status: slot.status,
    }));

    const result = await prisma.fieldSlot.createMany({
      data: data,
      skipDuplicates: true, // Tùy chọn: Bỏ qua nếu bị trùng lặp trường Unique (ví dụ trùng email)
    });

    return res.status(201).json({
      message: "Tạo sân thành công",
      field,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const updateField = async (req, res) => {
  try {
    const fieldId = Number(req.params.id);

    const oldField = await prisma.field.findUnique({
      where: {
        fieldId,
      },
    });

    if (!oldField) {
      return res.status(404).json({
        message: "Không tìm thấy sân",
      });
    }

    const finalName = req.body.name ?? oldField.name;
    const finalType = req.body.fieldType ?? oldField.fieldType;

    const error = validateField({
      name: finalName,
      fieldType: finalType,
    });

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const normalizedName = finalName.trim().replace(/\s+/g, " ");

    const duplicated = await checkFieldConflict({
      fieldId,
      name: normalizedName,
      fieldType: finalType,
    });

    if (duplicated) {
      return res.status(409).json({
        message: "Tên sân đã tồn tại",
      });
    }

    const updated = await prisma.field.update({
      where: {
        fieldId,
      },

      data: {
        name: normalizedName,

        description:
          req.body.description !== undefined
            ? req.body.description?.trim()
            : oldField.description,

        image:
          req.body.image !== undefined
            ? req.body.image?.trim()
            : oldField.image,

        fieldType: finalType,
      },
    });

    return res.status(200).json({
      message: "Cập nhật sân thành công",
      field: updated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const deleteField = async (req, res) => {
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

    await prisma.field.update({
      where: {
        fieldId,
      },
      data: {
        status: "INACTIVE",
      },
    });

    return res.status(200).json({
      message: "Xóa sân thành công",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
