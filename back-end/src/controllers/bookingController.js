import { prisma } from "../config/database.js";
import { Prisma } from "@prisma/client";

export const searchSlots = async (req, res) => {
  try {
    const { fieldId, date, type } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Thiếu ngày." });
    }

    const bookingDate = new Date(date);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Ngày không hợp lệ." });
    }

    // Clean up expired holds
    await prisma.slotHold.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    const currentUserId = req.user?.userId;

    if (fieldId) {
      const field = await prisma.field.findUnique({
        where: { fieldId: Number(fieldId) },
        include: { fieldSlots: { orderBy: { starttime: "asc" } } },
      });

      if (!field) {
        return res.status(404).json({ message: "Không tìm thấy sân." });
      }

      const bookings = await prisma.booking.findMany({
        where: {
          bookingDate,
          status: { in: ["HOLD", "CONFIRMED"] },
          fieldSlot: { fieldId: Number(fieldId) },
        },
        select: { slotId: true },
      });

      const holds = await prisma.slotHold.findMany({
        where: {
          bookingDate,
          expiresAt: { gt: new Date() },
          fieldSlot: { fieldId: Number(fieldId) },
        },
        select: { slotId: true, userId: true, expiresAt: true },
      });

      const bookedIds = bookings.map((b) => b.slotId);

      const slots = field.fieldSlots.map((slot) => {
        let status = "AVAILABLE";
        let isMyHold = false;

        const hold = holds.find((h) => h.slotId === slot.slotId);

        if (slot.status === "MAINTENANCE") {
          status = "MAINTENANCE";
        } else if (bookedIds.includes(slot.slotId)) {
          status = "BOOKED";
        } else if (hold) {
          status = "HOLD";
          if (currentUserId && hold.userId === currentUserId) {
            isMyHold = true;
          }
        }

        return {
          slotId: slot.slotId,
          starttime: slot.starttime,
          endtime: slot.endtime,
          price: slot.price,
          status,
          isMyHold,
          expiresAt: hold ? hold.expiresAt : null,
        };
      });

      return res.status(200).json({
        field: {
          fieldId: field.fieldId,
          name: field.name,
          fieldType: field.fieldType,
          description: field.description,
          image: field.image,
        },
        bookingDate,
        slots,
      });
    }

    const fieldWhere = type ? { fieldType: type } : {};

    const fields = await prisma.field.findMany({
      where: fieldWhere,
      include: { fieldSlots: { orderBy: { starttime: "asc" } } },
      orderBy: { name: "asc" },
    });

    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate,
        status: { in: ["HOLD", "CONFIRMED"] },
      },
      select: { slotId: true },
    });

    const holds = await prisma.slotHold.findMany({
      where: {
        bookingDate,
        expiresAt: { gt: new Date() },
      },
      select: { slotId: true, userId: true, expiresAt: true },
    });

    const bookedIds = bookings.map((b) => b.slotId);

    const resultFields = fields.map((field) => ({
      fieldId: field.fieldId,
      name: field.name,
      fieldType: field.fieldType,
      description: field.description,
      image: field.image,
      slots: field.fieldSlots.map((slot) => {
        let status = "AVAILABLE";
        let isMyHold = false;

        const hold = holds.find((h) => h.slotId === slot.slotId);

        if (slot.status === "MAINTENANCE") {
          status = "MAINTENANCE";
        } else if (bookedIds.includes(slot.slotId)) {
          status = "BOOKED";
        } else if (hold) {
          status = "HOLD";
          if (currentUserId && hold.userId === currentUserId) {
            isMyHold = true;
          }
        }

        return {
          slotId: slot.slotId,
          starttime: slot.starttime,
          endtime: slot.endtime,
          price: slot.price,
          status,
          isMyHold,
          expiresAt: hold ? hold.expiresAt : null,
        };
      }),
    }));

    return res.status(200).json({
      bookingDate,
      fields: resultFields,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const holdSlot = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slotId, bookingDate } = req.body;

    if (!slotId || !bookingDate) {
      return res.status(400).json({
        message: "Thiếu slotId hoặc bookingDate.",
      });
    }

    const bookingDay = new Date(bookingDate);

    if (isNaN(bookingDay.getTime())) {
      return res.status(400).json({ message: "Ngày không hợp lệ." });
    }

    const slot = await prisma.fieldSlot.findUnique({
      where: { slotId: Number(slotId) },
    });

    if (!slot) {
      return res.status(404).json({ message: "Không tìm thấy slot." });
    }

    const existedBooking = await prisma.booking.findFirst({
      where: {
        slotId: Number(slotId),
        bookingDate: bookingDay,
        status: { in: ["HOLD", "CONFIRMED"] },
      },
    });

    if (existedBooking) {
      return res.status(409).json({ message: "Slot đã được đặt." });
    }

    // Clean up existing hold for this slotId and bookingDate if present
    const existingHold = await prisma.slotHold.findFirst({
      where: {
        slotId: Number(slotId),
        bookingDate: bookingDay,
      },
    });

    if (existingHold) {
      if (existingHold.expiresAt > new Date()) {
        if (existingHold.userId !== userId) {
          return res.status(409).json({ message: "Khung giờ đang được người khác giữ." });
        }
        // Giữ lại thời gian giữ chỗ ban đầu của chính user này, KHÔNG reset đếm ngược!
        return res.status(200).json({
          message: "Đang giữ chỗ.",
          hold: existingHold,
          holdId: existingHold.holdId,
          expiresAt: existingHold.expiresAt,
        });
      }
      await prisma.slotHold.delete({
        where: { holdId: existingHold.holdId },
      });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const hold = await prisma.slotHold.create({
      data: {
        slotId: Number(slotId),
        userId,
        bookingDate: bookingDay,
        expiresAt,
      },
    });

    return res.status(201).json({
      message: "Giữ chỗ thành công.",
      hold,
      holdId: hold.holdId,
      expiresAt: hold.expiresAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      slotId,
      bookingDate,
      type = "ONE_TIME",
      depositAmount = 0,
      note,
      services = [],
    } = req.body;

    if (!slotId || !bookingDate) {
      return res.status(400).json({ message: "Thiếu thông tin đặt sân." });
    }

    const bookingDay = new Date(bookingDate);

    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.fieldSlot.findUnique({
        where: { slotId: Number(slotId) },
      });

      if (!slot) {
        throw new Error("Không tìm thấy khung giờ.");
      }

      const existedBooking = await tx.booking.findFirst({
        where: {
          slotId: Number(slotId),
          bookingDate: bookingDay,
          status: { in: ["HOLD", "CONFIRMED"] },
        },
      });

      if (existedBooking) {
        throw new Error("Khung giờ đã được đặt.");
      }

      const hold = await tx.slotHold.findFirst({
        where: {
          slotId: Number(slotId),
          bookingDate: bookingDay,
          userId,
        },
      });

      if (!hold || hold.expiresAt <= new Date()) {
        throw new Error("Bạn chưa giữ chỗ hoặc giữ chỗ đã hết hạn.");
      }

      let servicesTotal = new Prisma.Decimal(0);
      const serviceItemsToCreate = [];

      if (Array.isArray(services) && services.length > 0) {
        for (const item of services) {
          const s = await tx.service.findUnique({
            where: { serviceId: Number(item.serviceId) },
          });
          if (s) {
            const qty = Number(item.quantity) || 1;
            const itemPrice = s.price.mul(qty);
            servicesTotal = servicesTotal.plus(itemPrice);
            serviceItemsToCreate.push({
              serviceId: s.serviceId,
              quantity: qty,
              price: s.price,
            });
          }
        }
      }

      const slotPrice = slot.price;
      const totalPrice = slotPrice.plus(servicesTotal);
      const deposit = new Prisma.Decimal(depositAmount);

      const newBooking = await tx.booking.create({
        data: {
          userId,
          slotId: Number(slotId),
          bookingDate: bookingDay,
          type,
          status: "CONFIRMED",
          depositAmount: deposit,
          totalPrice,
          note,
        },
      });

      for (const svc of serviceItemsToCreate) {
        await tx.bookingServices.create({
          data: {
            bookingId: newBooking.bookingId,
            serviceId: svc.serviceId,
            quantity: svc.quantity,
            price: svc.price,
          },
        });
      }

      // Tự động xuất Hóa đơn (Invoice) cho lượt đặt sân này (Phương án 1)
      const remainAmount = totalPrice.minus(deposit);
      const invoiceStatus = remainAmount.lessThanOrEqualTo(0) ? "PAID" : "PENDING";

      await tx.invoice.create({
        data: {
          bookingId: newBooking.bookingId,
          userId,
          fieldAmount: slotPrice,
          serviceAmount: servicesTotal,
          totalAmount: totalPrice,
          deposit: deposit,
          remainAmount: remainAmount.lessThan(0) ? new Prisma.Decimal(0) : remainAmount,
          status: invoiceStatus,
          paymentMethod: "DEPOSIT",
          paidAt: invoiceStatus === "PAID" ? new Date() : null,
        },
      });

      await tx.slotHold.delete({
        where: { holdId: hold.holdId },
      });

      return await tx.booking.findUnique({
        where: { bookingId: newBooking.bookingId },
        include: {
          fieldSlot: { include: { field: true } },
          invoice: true,
          bookingServices: { include: { service: true } },
        },
      });
    });

    return res.status(201).json({
      message: "Đặt sân thành công.",
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { userId: true, fullName: true, email: true } },
        fieldSlot: { include: { field: true } },
        invoice: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      include: {
        user: { select: { userId: true, fullName: true, email: true } },
        fieldSlot: { include: { field: true } },
        invoice: true,
        review: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking." });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const bookingHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        fieldSlot: { include: { field: true } },
        invoice: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { cancelReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking." });
    }

    const updated = await prisma.booking.update({
      where: { bookingId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason,
      },
    });

    return res.status(200).json({
      message: "Hủy booking thành công.",
      booking: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { status, note } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking." });
    }

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (note !== undefined) dataToUpdate.note = note;
    if (status === "CANCELLED" && !booking.cancelledAt) {
      dataToUpdate.cancelledAt = new Date();
    }

    const updated = await prisma.booking.update({
      where: { bookingId },
      data: dataToUpdate,
      include: {
        user: { select: { userId: true, fullName: true, email: true } },
        fieldSlot: { include: { field: true } },
        invoice: true,
      },
    });

    return res.status(200).json({
      message: "Cập nhật booking thành công.",
      booking: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

