import { prisma } from "../config/database.js";

const validateService = ({ name, price, quantity }) => {
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
const checkServiceConflict = async ({ serviceId, name }) => {
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

// Xem danh sách
export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Lấy danh sách dịch vụ thành công",
      services,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xem chi tiết
export const getServiceById = async (req, res) => {
  try {
    const serviceId = Number(req.params.id);

    const service = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    return res.status(200).json({ service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Create dịch vụ
export const createService = async (req, res) => {
  try {
    const { name, description, image, price, quantity } = req.body;

    const error = validateService({ name, price, quantity });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    const duplicated = await checkServiceConflict({
      name: normalizedName,
    });

    if (duplicated) {
      return res.status(409).json({ message: "Tên dịch vụ đã tồn tại" });
    }

    const service = await prisma.service.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        image: image?.trim() || null,
        price: Number(price),
        quantity: Number(quantity || 0),
        status: "ACTIVE",
      },
    });

    return res.status(201).json({
      message: "Tạo dịch vụ thành công",
      service,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Update dịch vụ
export const updateService = async (req, res) => {
  try {
    const serviceId = Number(req.params.id);
    const { name, description, image, price, quantity, status } = req.body;

    const existingService = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!existingService) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    // Xử lý dữ liệu
    const finalName = name !== undefined ? name : existingService.name;
    const finalPrice = price !== undefined ? price : existingService.price;
    const finalQuantity =
      quantity !== undefined ? quantity : existingService.quantity; // Thêm dòng này
    const finalDescription =
      description !== undefined
        ? description?.trim()
        : existingService.description;
    const finalImage =
      image !== undefined ? image?.trim() : existingService.image;
    const finalStatus = status !== undefined ? status : existingService.status;

    // Validate dữ liệu mới
    const error = validateService({
      name: finalName,
      price: finalPrice,
      quantity: finalQuantity,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!["ACTIVE", "INACTIVE"].includes(finalStatus)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const normalizedName = finalName.trim().replace(/\s+/g, " ");

    if (normalizedName !== existingService.name) {
      const duplicated = await checkServiceConflict({
        serviceId,
        name: normalizedName,
      });

      if (duplicated) {
        return res.status(409).json({ message: "Tên dịch vụ đã tồn tại" });
      }
    }

    const updated = await prisma.service.update({
      where: { serviceId },
      data: {
        name: normalizedName,
        description: finalDescription,
        image: finalImage,
        price: Number(finalPrice),
        quantity: Number(finalQuantity),
        status: finalStatus,
      },
    });

    return res.status(200).json({
      message: "Cập nhật dịch vụ thành công",
      service: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Delete dịch vụ
export const deleteService = async (req, res) => {
  try {
    const serviceId = Number(req.params.id);

    const service = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    const updated = await prisma.service.update({
      where: { serviceId },
      data: { status: "INACTIVE" },
    });

    return res.status(200).json({
      message: "Xóa dịch vụ thành công",
      service: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
