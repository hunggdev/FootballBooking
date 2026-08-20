import { customerBooking } from "./customerBooking.js";
import jwt from "jsonwebtoken"; // Giữ lại nếu sau này chuyển sang xác thực bằng JWT Token

export function initializeSockets(io) {
  const getTimestamp = () => new Date().toLocaleString("vi-VN");
  // 🟢 1. MIDDLEWARE XÁC THỰC SỰ KIỆN KẾT NỐI
  io.use((socket, next) => {
    try {
      // Cách 1: Lấy userId trực tiếp từ auth do Client gửi lên
      const userId = socket.handshake.auth?.userId;

      if (userId) {
        socket.userId = userId;
      }

      // ⚠️ CỰC KỲ QUAN TRỌNG: BẮT BỘC phải gọi next() thì kết nối mới thành công!
      next();
    } catch (err) {
      console.error(" Lỗi Middleware Socket:", err.message);
      // Vẫn cho kết nối dạng Guest thay vì ngắt kết nối hoàn toàn
      next();
    }
  });

  // 🟢 2. XỬ LÝ SỰ KIỆN KẾT NỐI VÀ VÀO ROOM
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id} | User: ${socket.userId || "Guest"}`);

    // Tạo phòng riêng cho từng booking để nhận thông báo thanh toán
    socket.on("join:booking_room", (bookingId) => {
      socket.join(`booking:${bookingId}`);
      console.log(`Socket ${socket.id} joined booking room: ${bookingId}`);
    });

    // A. Tự động đưa User vào Private Room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // B. Tham gia / Rời Schedule Room (Lịch theo Ngày)
    socket.on("join:schedule", ({ fieldId, bookingDate }) => {
      if (fieldId && bookingDate) {
        const room = `schedule:${fieldId}:${bookingDate}`;
        socket.join(room);
        console.log(`[${getTimestamp()}] :📥 ${socket.userId}: Joined: ${room} ---------`);
      }
    });

    socket.on("leave:schedule", ({ fieldId, bookingDate }) => {
      if (fieldId && bookingDate) {
        const room = `schedule:${fieldId}:${bookingDate}`;
        socket.leave(room); 
        console.log(`[${getTimestamp()}] :📤 ${socket.userId}:  Left: ${room}-----------`);
      }
    });

    socket.on("disconnect", () => {
      socket.leave(`user:${socket.userId}`);
      console.log(`❌ Disconnected: ${socket.id} | User: ${socket.userId || "Guest"}`);
    });
  });
}