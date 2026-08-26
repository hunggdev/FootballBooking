import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";
import { createNotification } from "../libs/notifications.js";
import { sendEmail } from "../utils/sendEmail.js";


const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

import {
  validateUser,
  validatePhone,
  validateEmail,
  duplicateUser,
} from "../utils/validateUsers.js";
//Xem danh sách trận đấu
export const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user?.userId;
    const showAll = req.query.all === "1";
    const matches = await prisma.match.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],

      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },

        participants: {
          select: {
            participantId: true,
            userId: true,
            joinedAt: true,
            user: {
              select: {
                userId: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    const result = matches.map((match) => ({
      ...match,
      isMine: Boolean(currentUserId && match.userId === currentUserId),
      isJoined: Boolean(
        currentUserId && match.participants?.userId === currentUserId,
      ),
    }));
    return res.status(200).json({
      matches: result,
    });
  } catch (error) {
    console.error("GET MATCHES:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//Xem chi tiết
export const getMatchById = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    if (!matchId || isNaN(matchId)) {
      return res.status(400).json({
        message: "ID trận đấu không hợp lệ",
      });
    }

    const currentUserId = req.user?.userId;

    const match = await prisma.match.findUnique({
      where: {
        matchId,
      },

      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },

        participants: {
          select: {
            participantId: true,
            userId: true,
            joinedAt: true,

            user: {
              select: {
                userId: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    const result = {
      ...match,
      isMine: Boolean(currentUserId && match.userId === currentUserId),
      isJoined: Boolean(
        currentUserId && match.participants?.userId === currentUserId,
      ),
    };

    return res.status(200).json({
      match: result,
    });
  } catch (error) {
    console.error("GET MATCH:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

//Tạo trận đấu
export const createMatch = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userId = req.user.userId;
    const {
      minAge,
      maxAge,
      fieldType,
      timeNote,
      description,
      costRule,
      status,
    } = req.body;

    // tạo user mới (với status là active)
    const newMatch = await prisma.match.create({
      data: {
        userId,
        minAge,
        maxAge,
        fieldType,
        timeNote,
        description,
        costRule,
        status: "OPEN",
      },
    });

    await createNotification({
      recipientId: 1,
      actorId: userId,
      type: "NEW_MATCH",
      title: "Kèo đấu mới",
      message: `${req.user.fullName} vừa tạo kèo đấu`,
      entityType: "MATCH",
      entityId: newMatch.matchId,
    }).then(() => {
      io.to("user:1").emit("user:notification", { userId: 1 });
    });

    return res
      .status(200)
      .json({ message: "Tạo trận đấu thành công", match: newMatch });
  } catch (error) {
    console.error("CREATE MATCH:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//Updat thông tin trận đấu
export const updateMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    const userId = req.user.userId;
    const {
      minAge,
      maxAge,
      fieldType,
      timeNote,
      description,
      costRule,
      status,
    } = req.body;
    const customer = await prisma.user.findUnique({
      where: {
        userId,
      },
    });
    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }

    const match = await prisma.match.findFirst({
      where: {
        matchId,
        ...(customer.role !== "ADMIN" && { userId: userId }),
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    const updatedMatch = await prisma.match.update({
      where: {
        matchId,
        ...(customer.role !== "ADMIN" && { userId: userId }),
      },
      data: {
        minAge: minAge,
        maxAge: maxAge,
        fieldType: fieldType,
        timeNote: timeNote,
        description: description,
        costRule: costRule,
        status: status,
      },
    });

    return res.status(200).json({
      message: "Cập nhật thông tin trận đấu thành công",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("UPDATE MATCH:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// Deleted trận đấu
export const deleteMatch = async (req, res) => {
  try {
    const io = req.app.get("io");
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findFirst({
      where: { matchId },
      include: {
        participants: true,
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const opponent = Array.isArray(match.participants)
      ? match.participants[0]
      : match.participant;

    if (opponent) {
      const timeSinceJoined =
        Date.now() - new Date(opponent.joinedAt).getTime();

      if (timeSinceJoined > ONE_DAY_IN_MS) {
        return res.status(400).json({
          message: "Không thể hủy/xóa kèo do đối thủ đã tham gia quá 24 giờ",
        });
      }
    }

    const customer = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    const updatedMatch = await prisma.match.update({
      where: { matchId, ...(customer.role !== "ADMIN" && { userId: userId }) },
      data: {
        status: "CANCELLED",
      },
    });

    if (customer.role !== "ADMIN") {
      await createNotification({
        recipientId: 1,
        actorId: userId,
        type: "MATCH_CANCELLED",
        title: "Hủy kèo đấu",
        message: `${req.user.fullName} vừa hủy kèo đấu`,
        entityType: "MATCH",
        entityId: matchId,
      }).then(() => {
        io.to("user:1").emit("user:notification", { userId: 1 });
      });
    } else {
      const id = match?.userId;
      await createNotification({
        recipientId: id,
        actorId: 1,
        type: "MATCH_CANCELLED",
        title: "Hủy kèo đấu",
        message: `Quản trị viên vừa hủy kèo đấu`,
        entityType: "MATCH",
        entityId: matchId,
      }).then(() => {
        io.to(`user:${id}`).emit("user:notification", { userId: id });
      });
    }

    const joinerId = match.participants?.userId;
    const actorId = customer.role !== "ADMIN" ? userId : 1;
    const actorName =
      customer.role !== "ADMIN" ? req.user.fullName : "Quản trị viên";

    if (joinerId) {
      await createNotification({
        recipientId: joinerId,
        actorId,
        type: "MATCH_CANCELLED",
        title: "Hủy kèo đấu",
        message: `${actorName} vừa hủy kèo đấu`,
        entityType: "MATCH",
        entityId: matchId,
      }).then(() => {
        io.to(`user:${joinerId}`).emit("user:notification", {
          userId: joinerId,
        });
      });
    }

    return res.status(200).json({
      message: "Xóa trận đấu thành công",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("DELETE MATCH: ", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const statsMatch = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const [
      matches,
      totalMatchInThisMonth,
      matchOpen,
      matchMatched,
      matchFinished,
      matchCancelled,
    ] = await Promise.all([
      prisma.match.count(),

      prisma.match.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      prisma.match.count({
        where: {
          status: "OPEN",
        },
      }),

      prisma.match.count({
        where: {
          status: "MATCHED",
        },
      }),

      prisma.match.count({
        where: {
          status: "FINISHED",
        },
      }),

      prisma.match.count({
        where: {
          status: "CANCELLED",
        },
      }),
    ]);

    return res.status(200).json({
      matches,
      totalMatchInThisMonth,
      matchOpen,
      matchMatched,
      matchFinished,
      matchCancelled,
    });
  } catch (error) {
    console.error("STATS MATCH:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const joinMatch = async (req, res) => {
  try {
    const io = req.app.get("io");
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findUnique({
      where: { matchId },
      include: {
        user: true,
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    // Check if already joined
    const existingParticipant = await prisma.matchParticipant.findFirst({
      where: {
        matchId,
        userId,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({
        message: "Bạn đã tham gia trận đấu này rồi",
      });
    }

    // Create participant record
    const participant = await prisma.matchParticipant.create({
      data: {
        matchId,
        userId,
      },
    });

    // Increment participant count if status is OPEN (optional, depending on your logic)
    await prisma.match.update({
      where: { matchId },
      data: {
        status: "MATCHED",
      },
    });

    await createNotification({
      recipientId: match.userId,
      actorId: userId,
      type: "NEW_MATCH",
      title: "Tham gia kèo đấu",
      message: `${req.user.fullName} vừa tham gia trận đấu của bạn`,
      entityType: "MATCH",
      entityId: matchId,
    }).then(() => {
      io.to(`user:${match.userId}`).emit("user:notification", {
        userId: match.userId,
      });
    });

    await createNotification({
      recipientId: 1,
      actorId: userId,
      type: "NEW_MATCH",
      title: "Tham gia kèo đấu",
      message: `${req.user.fullName} vừa tham gia trận đấu của ${match.user.fullName}`,
      entityType: "MATCH",
      entityId: matchId,
    }).then(() => {
      io.to("user:1").emit("user:notification", {
        userId: 1,
      });
    });

    const url = `${process.env.CLIENT_URL || "http://localhost:5173"}/user/match`;

    const messageHtml = `
            <h2>Xin chào ${match.user.fullName},</h2>
            <p>Có người mới tham gia trận đấu của bạn. Vui lòng click vào link bên dưới để xem chi tiết trận đấu:</p>
            <a href="${url}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Xem chi tiết trận đấu</a>
            <br/><br/>
            <p>Hoặc copy link này dán vào trình duyệt: <br> <a href="${url}">${url}</a></p>
        `;

    await sendEmail({
      to: match.user.email,
      subject: "CÓ NGƯỜI MỚI THAM GIA TRẬN ĐẤU CỦA BẠN",
      html: messageHtml,
    });

    return res.status(200).json({
      message: "Tham gia trận đấu thành công",
      participant,
    });
  } catch (error) {
    console.error("JOIN MATCH:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const cancelJoinMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findUnique({
      where: { matchId },
      include: {
        participants: true,
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const opponent = Array.isArray(match.participants)
      ? match.participants[0]
      : match.participant;

    if (opponent) {
      const timeSinceJoined =
        Date.now() - new Date(opponent.joinedAt).getTime();

      if (timeSinceJoined > ONE_DAY_IN_MS) {
        return res.status(400).json({
          message: "Không thể hủy/xóa kèo do đối thủ đã tham gia quá 24 giờ",
        });
      }
    }

    // Check if already joined
    const existingParticipant = await prisma.matchParticipant.findFirst({
      where: {
        matchId,
        userId,
      },
    });

    if (!existingParticipant) {
      return res.status(400).json({
        message: "Bạn chưa tham gia trận đấu này",
      });
    }

    // Delete participant record
    await prisma.matchParticipant.delete({
      where: {
        matchId,
      },
    });

    // Decrement participant count if status is OPEN (optional, depending on your logic)
    const participant = await prisma.match.update({
      where: { matchId },
      data: {
        status: "OPEN",
      },
    });

    return res.status(200).json({
      message: "Hủy tham gia trận đấu thành công",
      participant,
    });
  } catch (error) {
    console.error("CANCEL MATCH:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
