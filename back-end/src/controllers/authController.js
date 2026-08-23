import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import {
  validateUser,
  duplicateUser,
  validateEmail,
  validatePassword,
} from "../utils/validateUsers.js";

const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const validationError = validateUser({ fullName, email, phone, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const duplicate = await duplicateUser(email, phone);
    if (duplicate) {
      return res.status(400).json({ message: duplicate });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        status: "INACTIVE",
      },
    });

    try {
      const activationToken = jwt.sign(
        { email: newUser.email },
        process.env.ACTIVATION_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${activationToken}`;

      const messageHtml = `
            <h2>Xin chào ${newUser.fullName},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào link bên dưới để kích hoạt tài khoản của bạn (link có hiệu lực trong 15 phút):</p>
            <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Kích hoạt tài khoản</a>
            <br/><br/>
            <p>Hoặc copy link này dán vào trình duyệt: <br> <a href="${verificationUrl}">${verificationUrl}</a></p>
        `;

      await sendEmail({
        to: newUser.email,
        subject: "XÁC THỰC TÀI KHOẢN FOOTBALL BOOKING",
        html: messageHtml,
      });
    } catch (processError) {
      try {
        await prisma.user.delete({ where: { userId: newUser.userId } });
      } catch (rollbackError) {
        console.error("Lỗi khi rollback user:", rollbackError);
      }
      console.error("Lỗi xử lý đăng ký, đã xóa user:", processError);
      return res.status(500).json({
        message: "Không thể gửi email xác thực.",
        errorDetail: processError.message,
      });
    }
    return res.status(201).json({
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản, link kích hoạt có hiệu lực trong 15 phút. Nếu không thấy email trong "hộp thư đến", vui lòng kiểm tra "thư rác"',
    });
  } catch (error) {
    console.log("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email và mật khẩu không được để trống" });
    }

    const validate = validateEmail(email) || validatePassword(password);
    if (validate) {
      return res.status(400).json({ message: validate });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc password không chính xác" });
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Email hoặc password không chính xác" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message:
          "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.",
      });
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await prisma.session.create({
      data: {
        userId: user.userId,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ACCESS_TOKEN_TTL,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.fullName} đã đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.",
      });
    }

    try {
      await prisma.session.deleteMany({
        where: { refreshToken: token },
      });
    } catch (dbError) {
      console.log("Session không tồn tại trong DB hoặc đã bị xóa trước đó.");
    }
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.log("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token không hợp lệ" });
    }

    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    if (user.status === "ACTIVE") {
      return res
        .status(400)
        .json({ message: "Tài khoản đã được kích hoạt trước đó" });
    }

    await prisma.user.update({
      where: { email: decoded.email },
      data: { status: "ACTIVE" },
    });

    return res.status(200).json({
      message:
        "Tài khoản đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập.",
    });
  } catch (error) {
    console.error("Lỗi khi gọi verifyEmail:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Link kích hoạt đã hết hạn" });
    }
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại" });
    }

    const session = await prisma.session.findFirst({
      where: {
        refreshToken: token,
      },
    });

    if (!session) {
      return res.status(403).json({
        message: "Không tìm thấy session, token không hợp lệ hoặc đã hết hạn",
      });
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { sessionId: session.sessionId } });
      return res
        .status(403)
        .json({ message: "Refresh token đã hết hạn. Vui lòng đăng nhập lại." });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ACCESS_TOKEN_TTL,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email không được để trống" });
    }

    const validate = validateEmail(email);
    if (validate) {
      return res.status(400).json({ message: validate });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.userId },
    });

    try {
      const resetToken = jwt.sign(
        { userId: user.userId },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      await prisma.passwordResetToken.create({
        data: {
          userId: user.userId,
          token: resetToken,
          used: false,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

      const messageHtml = `
                <h2>Xin chào ${user.fullName},</h2>
                <p>Vui lòng click vào link bên dưới để xác thực cấp lại mật khẩu (link hết hạn sau 15 phút):</p>
                <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Xác thực reset mật khẩu</a>
                <br/><br/>
                <p>Hoặc copy link này dán vào trình duyệt: <br> <a href="${verificationUrl}">${verificationUrl}</a></p>
            `;

      await sendEmail({
        to: user.email,
        subject: "XÁC THỰC CẤP LẠI MẬT KHẨU",
        html: messageHtml,
      });

      return res
        .status(200)
        .json({ message: "Email reset password đã được gửi" });
    } catch (processError) {
      console.error("Lỗi xử lý cấp lại mật khẩu:", processError);
      return res.status(500).json({
        message:
          "Không thể gửi email cấp lại mật khẩu. Vui lòng kiểm tra lại cấu hình EMAIL_USER và EMAIL_PASS trong file .env",
        errorDetail: processError.message,
      });
    }
  } catch (error) {
    console.log("Lỗi khi gọi forgotPassword", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token và mật khẩu không được để trống" });
    }

    const validateP = validatePassword(newPassword);
    if (validateP) {
      return res.status(400).json({ message: validateP });
    }

    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!passwordResetToken) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    if (passwordResetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token: passwordResetToken.token },
      });
      return res.status(403).json({
        message: "Token đã hết hạn. Vui lòng gửi lại yêu cầu đổi mật khẩu.",
      });
    }

    if (passwordResetToken.used) {
      return res.status(400).json({
        message: "Token đã được sử dụng.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);
    } catch (error) {
      console.log("Lỗi khi verify token", error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }

    if (decoded.userId !== passwordResetToken.userId) {
      return res.status(400).json({
        message: "Token không hợp lệ.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { userId: passwordResetToken.userId },
      data: { passwordHash: hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
      },
      data: {
        used: true,
      },
    });

    // await prisma.passwordResetToken.delete({ where: { token: token } });
    return res.status(200).json({
      message: "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập",
    });
  } catch (error) {
    console.log("Lỗi khi gọi resetPassword", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
