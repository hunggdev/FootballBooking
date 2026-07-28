import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";

// authorization - xac minh nguoi dung la ai
export const protectedRoute = (req, res, next) => {
  try {
    // lay token tu header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xac nhan token hop le
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }
        // console.log(decodedUser);

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

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Bạn không có quyền",
    });
  }

  next();
};
