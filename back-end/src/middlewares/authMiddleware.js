import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";

// authorization - xac minh nguoi dung la ai
export const protectedRoute = (req, res, next) => {
  try {
    // lay token tu header hoac cookies
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token && req.cookies) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xac nhan token hop le
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error("JWT verify error:", err.message);
          return res
            .status(401)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }
        
        try {
          // tim user
          const user = await prisma.user.findUnique({
            where: {
              userId: decodedUser.userId,
            },
            omit: {
              passwordHash: true,
            },
          });

          if (!user) {
            return res.status(401).json({ message: "User không tồn tại" });
          }

          req.user = user;
          next();
        } catch (dbErr) {
          console.error("Lỗi khi tìm user trong authMiddleware", dbErr);
          return res.status(500).json({ message: "Lỗi hệ thống" });
        }
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// ===== Middleware kiểm tra Admin =====
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Chưa đăng nhập",
    });
  }

  if (req.user.role?.toUpperCase() !== "ADMIN") {
    return res.status(403).json({
      message: "Bạn không có quyền",
    });
  }

  next();
};


// Quyền cập nhật kèo đấu

export const requireMatchOwner = async (req, res, next) => {
    if (req.user.role === "ADMIN") {
        next();
        return;
    }
  
    const { matchId } = req.params;
    const userId = req.user.userId;

    const match = await prisma.match.findUnique({
        where: { matchId }
    });

    if (!match) {
        return res.status(404).json({
            message: "Không tìm thấy kèo."
        });
    }

    if (match.userId !== userId) {
        return res.status(403).json({
            message: "Bạn không có quyền."
        });
    }

    req.match = match;

    next();
};
