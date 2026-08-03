import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; 

import { validateUser, validatePhone, validateEmail, duplicateUser } from "../utils/validateUsers.js";

//Xem danh sách trận đấu
export const getMatches = async (req, res) => {
    try {        
        const currentUserId = req.user.userId;
        const showAll = req.query.all === "1";
        const matches = await prisma.match.findMany({
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
              participants: {
                select: {
                  userId: true,
                },
              },
            },
        });

    const result = matches.map(({ participants, ...match }) => ({
      ...match,
      isMine: match.userId === currentUserId,
      isJoined: participants.some(
        (participant) => participant.userId === currentUserId
      ),
    }));
    return res.status(200).json({
      matches: result,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

//Xem chi tiết
export const getMatchById = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    const match = await prisma.match.findUnique({
      where: {
        matchId,
      },

      include: {  
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      }
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }
    return res.status(200).json({
      match,
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
        }
    });

    return res.status(200).json({message: "Tạo trận đấu thành công", match: newMatch});
    } catch (error) {
        console.error("CREATE MATCH:", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
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

    const match = await prisma.match.findFirst({
      where: {
        matchId,
        userId,
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
        userId,
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
      match: updatedMatch
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
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findFirst({
      where: { matchId, userId },
    });

    if (!match) {
      return res.status(404).json({
        message: "Không tìm thấy trận đấu",
      });
    }

    const updatedMatch = await prisma.match.update({
      where: { matchId, userId },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      message: "Xóa trận đấu thành công",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("DELETE MATCH: ",error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const statsMatch = async (req, res) => {
  try {
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
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
}

export const joinMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findUnique({
      where: { matchId },
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
}

export const cancelJoinMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.id);
    const userId = req.user.userId;

    const match = await prisma.match.findUnique({
      where: { matchId },
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

    if (!existingParticipant) {
      return res.status(400).json({
        message: "Bạn chưa tham gia trận đấu này",
      });
    }

    // Delete participant record
    await prisma.matchParticipant.delete({
      where: {
        matchId_userId: {
          matchId,
          userId,
        },
      },
    });

    // Decrement participant count if status is OPEN (optional, depending on your logic)
    const participant =  await prisma.match.update({
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
}

