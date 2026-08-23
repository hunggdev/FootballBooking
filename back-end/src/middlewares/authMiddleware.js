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
      return res.status(401).json({ message: "Đăng nhập để tiếp tục" });
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
    where: { matchId },
  });

  if (!match) {
    return res.status(404).json({
      message: "Không tìm thấy kèo.",
    });
  }

  if (match.userId !== userId) {
    return res.status(403).json({
      message: "Bạn không có quyền.",
    });
  }

  req.match = match;

  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token && req.cookies) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    // 1. Nếu không có token -> Coi như khách vãng lai
    if (!token) {
      req.user = null;
      return next();
    }

    // 2. Verify token (nếu token sai/hết hạn sẽ tự nhảy xuống catch bên dưới)
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Tìm user trong DB
    const user = await prisma.user.findUnique({
      where: {
        userId: decodedUser.userId,
      },
      omit: {
        passwordHash: true,
      },
    });

    // Nếu tìm thấy user thì gán, không thì để null
    req.user = user || null;

  } catch (error) {
    // Nếu token hết hạn, token giả, hoặc lỗi DB -> Coi như khách vãng lai
    req.user = null;
  }

  // Luôn chỉ gọi next() ĐÚNG 1 LẦN DUY NHẤT ở đây
  return next();
};
