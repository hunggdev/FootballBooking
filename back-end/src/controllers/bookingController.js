import { prisma } from "../config/database.js";
import { Prisma } from "@prisma/client";
import {
  getFieldHolds,
  getHold,
  setHold,
  getHoldTTL,
  deleteHold,
  makeKey,
  getUserHolds,
  addUserHoldIndex,
  removeUserHoldIndex,
} from "../libs/redisHold.js";
import { redis } from "../config/redis.js";
import { createNotification } from "../libs/notifications.js";

export const getSlots = async (req, res) => {
  try {
    const { fieldId, date } = req.query;
    const currentUserId = req.user?.userId;

    if (!fieldId) {
      return res.status(400).json({
        message: "Thiếu fieldId.",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Thiếu ngày.",
      });
    }

    const bookingDate = new Date(date);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        message: "Ngày không hợp lệ.",
      });
    }

    const [field, bookedSlots, holds, blockedSlots] = await Promise.all([
      prisma.field.findUnique({
        where: {
          fieldId: Number(fieldId),
        },
        include: {
          fieldSlots: {
            orderBy: {
              starttime: "asc",
            },
          },
        },
      }),

      prisma.bookingSlot.findMany({
        where: {
          bookingDate,
          booking: {
            status: "CONFIRMED",
          },
          fieldSlot: {
            fieldId: Number(fieldId),
          },
        },
        select: {
          slotId: true,
        },
      }),

      getFieldHolds(fieldId, date),

      prisma.blockedSlot.findMany({
        where: {
          bookingDate,
          fieldSlot: {
            fieldId: Number(fieldId),
          },
        },
        select: {
          slotId: true,
        },
      }),
    ]);

    if (!field) {
      return res.status(404).json({
        message: "Không tìm thấy sân.",
      });
    }

    const blockedSet = new Set(blockedSlots.map((b) => b.slotId));
    const bookedSet = new Set(bookedSlots.map((b) => b.slotId));

    const holdMap = new Map(holds.map((hold) => [hold.slotId, hold]));

    const now = Date.now();

    const slots = field.fieldSlots.map((slot) => {
      let status = "AVAILABLE";
      let isMyHold = false;
      let expiresAt = null;
      let ttl = null;

      const hold = holdMap.get(slot.slotId);

      if (blockedSet.has(slot.slotId)) {
        status = "CLOSED";
      } else if (bookedSet.has(slot.slotId)) {
        status = "BOOKED";
      } else if (hold) {
        status = "HOLD";
        expiresAt = hold.expiresAt;
        // ĐỔI: không lấy thẳng hold.ttl từ Redis -> luôn derive lại từ expiresAt
        // tại thời điểm response, tránh lệch đơn vị/độ trễ (bug 9999 phút trước đó).
        ttl = Math.max(
          0,
          Math.floor((new Date(hold.expiresAt).getTime() - now) / 1000),
        );

        if (Number(hold.userId) === Number(currentUserId)) {
          isMyHold = true;
        }
      }

      return {
        holdId: makeKey(
          fieldId,
          slot.slotId,
          bookingDate.toISOString().split("T")[0],
        ),
        bookingDate: bookingDate.toISOString().split("T")[0],
        slotId: slot.slotId,
        starttime: slot.starttime,
        endtime: slot.endtime,
        price: slot.price,
        status,
        isMyHold,
        expiresAt,
        ttl,
      };
    });

    return res.status(200).json({
      userId: currentUserId,
      bookingDate: bookingDate.toISOString().split("T")[0],
      field: {
        fieldId: field.fieldId,
        name: field.name,
        fieldType: field.fieldType,
        description: field.description,
        image: field.image,
      },
      slots,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

export const getMyHolds = async (req, res) => {
  try {
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Chưa đăng nhập.",
      });
    }

    const myHolds = await getUserHolds(currentUserId);

    if (myHolds.length === 0) {
      return res.status(200).json({
        userId: currentUserId,
        holds: [],
      });
    }

    // Gom theo fieldId/slotId để tránh N+1 query khi enrich thông tin hiển thị
    const fieldIds = [...new Set(myHolds.map((h) => Number(h.fieldId)))];
    const slotIds = [...new Set(myHolds.map((h) => h.slotId))];

    const [fields, fieldSlots] = await Promise.all([
      prisma.field.findMany({
        where: { fieldId: { in: fieldIds } },
        select: { fieldId: true, name: true, fieldType: true, image: true },
      }),
      prisma.fieldSlot.findMany({
        where: { slotId: { in: slotIds } },
        select: {
          slotId: true,
          fieldId: true,
          starttime: true,
          endtime: true,
          price: true,
        },
      }),
    ]);

    const fieldMap = new Map(fields.map((f) => [f.fieldId, f]));
    const slotMap = new Map(fieldSlots.map((s) => [s.slotId, s]));

    const holds = myHolds
      .map((hold) => {
        const field = fieldMap.get(Number(hold.fieldId));
        const slot = slotMap.get(hold.slotId);

        // Field/slot đã bị xoá khỏi DB nhưng hold vẫn còn -> bỏ qua thay vì làm hỏng response
        if (!field || !slot) return null;

        return {
          holdId: makeKey(hold.fieldId, hold.slotId, hold.bookingDate),
          fieldId: field.fieldId,
          fieldName: field.name,
          fieldType: field.fieldType,
          fieldImage: field.image,
          bookingDate: hold.bookingDate,
          slotId: slot.slotId,
          starttime: slot.starttime,
          endtime: slot.endtime,
          price: slot.price,
          status: "HOLD",
          isMyHold: true,
          expiresAt: hold.expiresAt,
          ttl: hold.ttl,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      userId: currentUserId,
      holds,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

export const holdSlot = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userId = req.user.userId;
    const { slotId, bookingDate, fieldId } = req.body;

    if (!slotId || !bookingDate || !fieldId) {
      return res.status(400).json({
        message: "Thiếu slotId hoặc bookingDate hoặc fieldId.",
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

    if (slot.fieldId !== Number(fieldId)) {
      return res.status(400).json({ message: "Slot không thuộc sân này." });
    }

    // ĐỔI: Booking không còn slotId/bookingDate trực tiếp -> query qua BookingSlot.
    // Chỉ cần check CONFIRMED, vì HOLD giờ do Redis quản lý (check ở dưới).
    const existedBookingSlot = await prisma.bookingSlot.findFirst({
      where: {
        slotId: Number(slotId),
        bookingDate: bookingDay,
        booking: { status: "CONFIRMED" },
      },
    });

    if (existedBookingSlot) {
      return res.status(409).json({ message: "Slot đã được đặt." });
    }

    const dateKey = bookingDate.split("T")[0];
    const holdId = makeKey(fieldId, slotId, dateKey);

    const currentUserId = await getHold(fieldId, slotId, dateKey);
    if (currentUserId) {
      if (currentUserId !== String(userId)) {
        return res
          .status(409)
          .json({ message: "Khung giờ đang được người khác giữ." });
      }

      // ĐỔI: trả expiresAt/ttl thật, không để FE hiểu nhầm là chưa có dữ liệu.
      const ttl = await getHoldTTL(fieldId, slotId, dateKey);
      const expiresAt = new Date(Date.now() + ttl * 1000);

      return res.status(200).json({
        message: "Đang giữ chỗ.",
        hold: {
          holdId,
          userId,
          bookingDate: dateKey,
          fieldId,
          slotId,
          status: "HOLD",
          expiresAt,
          ttl,
        },
      });
    }

    const success = await setHold(fieldId, slotId, dateKey, userId);
    if (!success) {
      return res
        .status(409)
        .json({ message: "Khung giờ đang được người khác giữ." });
    }

    const ttl = await getHoldTTL(fieldId, slotId, dateKey);
    const expiresAt = new Date(Date.now() + ttl * 1000);

    // ĐỔI: thêm await để đảm bảo reverse-index ghi xong trước khi response trả về.
    await addUserHoldIndex(userId, holdId);

    io.to(`schedule:${fieldId}:${dateKey}`).emit("schedule:updated", {
      holdId,
      fieldId,
      bookingDate: dateKey,
      slotId: Number(slotId),
      status: "HOLD",
      userId,
      expiresAt,
      ttl,
    });
    // .to(`user:${userId}`)
    io.emit("user:cart_updated", {
      fieldId,
      slotId,
      bookingDate: dateKey,
      status: "HOLD",
      expiresAt,
      ttl,
    });

    return res.status(201).json({
      message: "Giữ chỗ thành công.",
      hold: {
        holdId,
        expiresAt,
        userId,
        bookingDate: dateKey,
        fieldId,
        slotId,
        status: "HOLD",
        ttl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const deleteSlotHold = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userId = req.user.userId;
    const { slotId, bookingDate, fieldId } = req.body;

    if (!slotId || !bookingDate || !fieldId) {
      return res.status(400).json({
        message: "Thiếu slotId hoặc bookingDate hoặc fieldId.",
      });
    }

    const bookingDay = new Date(bookingDate);

    if (isNaN(bookingDay.getTime())) {
      return res.status(400).json({ message: "Ngày không hợp lệ." });
    }

    const dateKey = bookingDate.split("T")[0];

    const currentUserId = await getHold(fieldId, slotId, dateKey);

    if (!currentUserId || String(currentUserId) !== String(userId)) {
      return res.status(403).json({
        message: "Không tìm thấy hold hoặc bạn không có quyền hủy.",
      });
    }

    const deleted = await deleteHold(fieldId, slotId, dateKey, userId);
    if (!deleted) {
      return res.status(403).json({
        message: "Không tìm thấy hold hoặc bạn không có quyền hủy.",
      });
    }

    const holdId = makeKey(fieldId, slotId, dateKey);

    removeUserHoldIndex(userId, makeKey(fieldId, slotId, dateKey));

    io.to(`schedule:${fieldId}:${dateKey}`).emit("schedule:updated", {
      holdId,
      fieldId,
      bookingDate: dateKey,
      slotId: Number(slotId),
      status: "AVAILABLE",
      userId: null,
      expiresAt: null,
      ttl: null,
    });
    // .to(`user:${userId}`)
    io.emit("user:cart_updated", {
      fieldId,
      slotId,
      bookingDate: dateKey,
      status: "AVAILABLE",
      expiresAt: null,
      ttl: null,
    });

    return res.status(200).json({
      message: "Hủy giữ chỗ thành công.",
      slotId: Number(slotId),
    });
  } catch (error) {
    console.error("Lỗi khi hủy giữ chỗ:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      slots, // [{ fieldId, slotId, bookingDate }] — thay cho 1 slotId đơn lẻ
      type = "ONE_TIME" || "LONG_TERM",
      depositAmount = 0,
      note,
      services = [],
    } = req.body;

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Thiếu danh sách khung giờ." });
    }

    for (const s of slots) {
      if (!s.slotId || !s.bookingDate || !s.fieldId) {
        return res
          .status(400)
          .json({ message: "Thông tin khung giờ không hợp lệ." });
      }
    }

    const fieldId = slots[0]?.fieldId;

    const normalizedSlots = slots.map((s) => ({
      fieldId: Number(s.fieldId),
      slotId: Number(s.slotId),
      bookingDay: new Date(s.bookingDate),
      dateKey: String(s.bookingDate).split("T")[0],
    }));

    if (normalizedSlots.some((s) => isNaN(s.bookingDay.getTime()))) {
      return res.status(400).json({ message: "Ngày không hợp lệ." });
    }

    // Redis không nằm trong transaction Prisma -> phải xác thực hold TRƯỚC khi mở transaction.
    for (const s of normalizedSlots) {
      const holdUserId = await getHold(s.fieldId, s.slotId, s.dateKey);
      if (!holdUserId || holdUserId !== String(userId)) {
        return res.status(409).json({
          message: `Bạn chưa giữ chỗ hoặc giữ chỗ đã hết hạn cho khung giờ ${s.slotId} ngày ${s.dateKey}.`,
        });
      }
    }

    const booking = await prisma.$transaction(async (tx) => {
      const slotIds = normalizedSlots.map((s) => s.slotId);
      const fieldSlots = await tx.fieldSlot.findMany({
        where: { slotId: { in: slotIds } },
      });
      const slotMap = new Map(fieldSlots.map((fs) => [fs.slotId, fs]));

      for (const s of normalizedSlots) {
        const fs = slotMap.get(s.slotId);
        if (!fs) throw new Error(`Không tìm thấy khung giờ ${s.slotId}.`);
        if (fs.fieldId !== s.fieldId)
          throw new Error(`Khung giờ ${s.slotId} không thuộc sân đã chọn.`);
      }

      const existedBookingSlots = await tx.bookingSlot.findMany({
        where: {
          OR: normalizedSlots.map((s) => ({
            slotId: s.slotId,
            bookingDate: s.bookingDay,
          })),
          booking: { status: "CONFIRMED" },
        },
      });
      if (existedBookingSlots.length > 0) {
        throw new Error("Một hoặc nhiều khung giờ đã được đặt.");
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
            servicesTotal = servicesTotal.plus(s.price.mul(qty));
            serviceItemsToCreate.push({
              serviceId: s.serviceId,
              quantity: qty,
              price: s.price,
            });
          }
        }
      }

      const fieldAmount = normalizedSlots.reduce(
        (sum, s) => sum.plus(slotMap.get(s.slotId).price),
        new Prisma.Decimal(0),
      );
      const totalPrice = fieldAmount.plus(servicesTotal);
      const deposit = new Prisma.Decimal(depositAmount);

      const newBooking = await tx.booking.create({
        data: {
          fieldId,
          userId,
          type,
          status: "CONFIRMED",
          depositAmount: deposit,
          totalPrice,
          note,
          bookingSlots: {
            create: normalizedSlots.map((s) => ({
              slotId: s.slotId,
              bookingDate: s.bookingDay,
              price: slotMap.get(s.slotId).price, // snapshot giá tại thời điểm đặt
            })),
          },
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

      const remainAmount = totalPrice.minus(deposit);
      const invoiceStatus = remainAmount.lessThanOrEqualTo(0)
        ? "PAID"
        : "DEPOSITED";

      // ĐỔI: Invoice không còn field bookingId -> tạo Invoice trước, gắn ngược invoiceId vào Booking.
      const invoice = await tx.invoice.create({
        data: {
          bookingId: newBooking.bookingId,
          userId,
          fieldAmount,
          serviceAmount: servicesTotal,
          totalAmount: totalPrice,
          deposit,
          remainAmount: remainAmount.lessThan(0)
            ? new Prisma.Decimal(0)
            : remainAmount,
          status: invoiceStatus,
          paymentMethod: "DEPOSIT",
          paidAt: invoiceStatus === "DEPOSITED" ? new Date() : null,
        },
      });

      await tx.booking.update({
        where: { bookingId: newBooking.bookingId },
        data: { invoiceId: invoice.invoiceId },
      });

      return tx.booking.findUnique({
        where: { bookingId: newBooking.bookingId },
        include: {
          bookingSlots: {
            include: { fieldSlot: { include: { field: true } } },
          },
          invoice: true,
          bookingServices: { include: { service: true } },
        },
      });
    });

    // Dọn Redis SAU khi transaction DB commit thành công — tránh xoá hold rồi transaction lại fail.
    const io = req.app.get("io");
    await Promise.all(
      normalizedSlots.map(async (s) => {
        await deleteHold(s.fieldId, s.slotId, s.dateKey, userId);
        await removeUserHoldIndex(
          userId,
          makeKey(s.fieldId, s.slotId, s.dateKey),
        );

        console.log("Xoa thanh cong");

        io.to(`schedule:${s.fieldId}:${s.dateKey}`).emit("schedule:updated", {
          holdId: makeKey(s.fieldId, s.slotId, s.dateKey),
          fieldId: s.fieldId,
          slotId: s.slotId,
          bookingDate: s.dateKey,
          status: "BOOKED",
          userId: null,
          expiresAt: null,
          ttl: null,
        });

        io.to(`user:${userId}`).emit("user:cart_updated", {
          fieldId: s.fieldId,
          slotId: s.slotId,
          bookingDate: s.dateKey,
          status: "BOOKED",
          expiresAt: null,
          ttl: null,
        });
      }),
    );
    // io.to(`user:${userId}`).emit("user:cart_updated", { action: "CLEAR" });

    await createNotification({
      recipientId: 1,
      actorId: userId,
      type: "NEW_BOOKING",
      title: "Booking mới",
      message: `${req.user.fullName} vừa đặt sân`,
      entityType: "BOOKING",
      entityId: booking.bookingId,
    }).then(() => {
      io.to("user:1").emit("user:notification", { userId: 1 });
    });

    return res.status(201).json({ message: "Đặt sân thành công.", booking });
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
        bookingSlots: { include: { fieldSlot: { include: { field: true } } } },
        invoice: true,
        review: true,
        bookingServices: {
          include: {
            service: true,
          },
        },
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
        bookingSlots: { include: { fieldSlot: { include: { field: true } } } },
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
        bookingSlots: { include: { fieldSlot: { include: { field: true } } } },
        invoice: true,
        review: true,
        bookingServices: { include: { service: true } },
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

    const result = await prisma.$transaction(async (tx) => {
      // 1. Tìm booking
      const booking = await tx.booking.findUnique({
        where: { bookingId },
      });

      if (!booking) {
        throw new Error("Không tìm thấy booking này.");
      }

      if (booking.status === "CANCELLED") {
        throw new Error("Booking này đã được hủy trước đó.");
      }

      // 2. Update Booking
      const updatedBooking = await tx.booking.update({
        where: { bookingId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason,
        },
        include: {
          bookingSlots: {
            include: {
              fieldSlot: true,
            },
          },
        },
      });

      // 3. Update Invoice tương ứng với booking
      const updatedInvoice = await tx.invoice.updateMany({
        where: {
          bookingId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      return {
        booking: updatedBooking,
        invoice: updatedInvoice,
      };
    });

    // Transaction thành công thì mới emit Socket
    const io = req.app.get("io");

    result.booking.bookingSlots.forEach((bs) => {
      const dateKey = bs.bookingDate.toISOString().split("T")[0];

      io.to(`schedule:${bs.fieldSlot.fieldId}:${dateKey}`).emit(
        "schedule:updated",
        {
          fieldId: bs.fieldSlot.fieldId,
          slotId: bs.slotId,
          bookingDate: dateKey,
          status: "AVAILABLE",
        },
      );
    });

    await createNotification({
      recipientId: 1,
      actorId: req.user.userId,
      type: "BOOKING_CANCELLED",
      title: "Hủy Booking",
      message: `${req.user.fullName} vừa hủy đặt sân`,
      entityType: "BOOKING",
      entityId: bookingId,
    }).then(() => {
      io.to("user:1").emit("user:notification", { userId: 1 });
    });

    return res.status(200).json({
      message: "Hủy booking thành công.",
      booking: result.booking,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        message: "Không tìm thấy booking.",
      });
    }

    if (error.message === "BOOKING_ALREADY_CANCELLED") {
      return res.status(400).json({
        message: "Booking đã được hủy trước đó.",
      });
    }

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { status, note } = req.body;

    const booking = await prisma.booking.findUnique({ where: { bookingId } });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking." });
    }

    const invoiceId = await prisma.booking.findFirst({
      where: { bookingId },
      select: { invoiceId: true },
    });

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
        bookingSlots: { include: { fieldSlot: { include: { field: true } } } },
        invoice: true,
      },
    });

    if (dataToUpdate.status === "COMPLETED") {
      await prisma.invoice.update({
        where: { invoiceId: invoiceId.invoiceId },
        data: { status: "PAID" },
      });
    }

    if (dataToUpdate.status === "CANCELLED") {
      await prisma.invoice.update({
        where: { invoiceId: invoiceId.invoiceId },
        data: { status: "CANCELLED" },
      });
    }

    return res
      .status(200)
      .json({ message: "Cập nhật booking thành công.", booking: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const getSlotStatusRange = async (req, res) => {
  try {
    const { fieldId, slotId, startDate, endDate } = req.query;
    const currentUserId = req.user?.userId;

    if (!fieldId || !slotId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Thiếu fieldId, slotId, startDate hoặc endDate." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Ngày không hợp lệ." });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ message: "startDate phải trước hoặc bằng endDate." });
    }

    const MAX_RANGE_DAYS = 90;
    const rangeDays =
      Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    if (rangeDays > MAX_RANGE_DAYS) {
      return res
        .status(400)
        .json({ message: `Khoảng ngày tối đa ${MAX_RANGE_DAYS} ngày.` });
    }

    const slot = await prisma.fieldSlot.findUnique({
      where: { slotId: Number(slotId) },
    });

    if (!slot || slot.fieldId !== Number(fieldId)) {
      return res
        .status(404)
        .json({ message: "Slot không hợp lệ hoặc không thuộc sân này." });
    }

    // 1. Tạo danh sách dateKeys
    const dates = [];
    const dateKeys = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      dates.push(new Date(cursor));
      // Dùng format YYYY-MM-DD chuẩn địa phương tránh lệch múi giờ ISO
      const dateStr = cursor.toISOString().split("T")[0];
      dateKeys.push(dateStr);
      cursor.setDate(cursor.getDate() + 1);
    }

    // 2. Tạo Redis Pipeline để gom tất cả lệnh đọc Redis vào 1 Network Roundtrip
    const redisPipeline = redis.pipeline(); // Nếu dùng ioredis
    dateKeys.forEach((dateKey) => {
      const key = `hold:${fieldId}:${slotId}:${dateKey}`; // Điều chỉnh key pattern của bạn
      redisPipeline.get(key);
      redisPipeline.ttl(key);
    });

    // 3. Chạy song song: Postgres (Booked/Blocked) + Redis Pipeline
    const [bookedSlots, redisResults] = await Promise.all([
      prisma.bookingSlot.findMany({
        where: {
          slotId: Number(slotId),
          bookingDate: { gte: start, lte: end },
          booking: { status: "CONFIRMED" },
        },
        select: { bookingDate: true },
      }),

      redisPipeline.exec(), // Gửi 1 lần duy nhất sang Redis
    ]);

    // 4. Parse kết quả từ Redis Pipeline
    // Redis trả về mảng kết quả song song: [ [err, userId1], [err, ttl1], [err, userId2], [err, ttl2], ... ]
    const holdMap = new Map();
    const now = Date.now();

    for (let i = 0; i < dateKeys.length; i++) {
      const dateKey = dateKeys[i];
      const holdUserId = redisResults[i * 2][1]; // Kết quả của get
      const ttl = redisResults[i * 2 + 1][1]; // Kết quả của ttl

      if (holdUserId && ttl > 0) {
        holdMap.set(dateKey, {
          userId: holdUserId,
          ttl,
          expiresAt: new Date(now + ttl * 1000),
        });
      }
    }

    // 5. Map ra kết quả trả về UI
    const bookedSet = new Set(
      bookedSlots.map((b) => b.bookingDate.toISOString().split("T")[0]),
    );

    const result = dateKeys.map((dateKey) => {
      let status = "AVAILABLE";
      let isMyHold = false;
      let expiresAt = null;
      let ttl = null;

      const hold = holdMap.get(dateKey);

      if (bookedSet.has(dateKey)) {
        status = "BOOKED";
      } else if (hold) {
        status = "HOLD";
        expiresAt = hold.expiresAt;
        ttl = hold.ttl;
        if (Number(hold.userId) === Number(currentUserId)) {
          isMyHold = true;
        }
      }

      return {
        holdId: makeKey(fieldId, slotId, dateKey),
        bookingDate: dateKey,
        slotId: slotId,
        starttime: startDate,
        endtime: endDate,
        price: slot.price,
        status,
        isMyHold,
        expiresAt,
        ttl,
      };
    });

    return res.status(200).json({
      fieldId: Number(fieldId),
      slotId: Number(slotId),
      starttime: slot.starttime,
      endtime: slot.endtime,
      price: slot.price,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      slots: result,
    });
  } catch (error) {
    console.error("Error in getSlotStatusRange:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
