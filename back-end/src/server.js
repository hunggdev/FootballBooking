import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import { protectedRoute, requireAdmin } from "./middlewares/authMiddleware.js";
import { cleanExpiredUsers } from "./utils/cleanExpiredUsers.js";
import customerRoute from "./routes/customerRoute.js";
import fieldRoute from "./routes/fieldRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import cron from "node-cron";
import matchRoute from "./routes/matchRoute.js";
import http from "http";
import { Server } from "socket.io";
import paymentRoute from "./routes/paymentRoute.js";

// 1. Import hàm initSocket từ file socket.js vừa tạo
import { initializeSockets } from "./sockets/socketManager.js"

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// 2. Khởi tạo Socket.IO bằng hàm đã tách
const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

// Vẫn lưu vào app nếu muốn dùng req.app.get("io")
initializeSockets(io);
app.set("io", io);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public & hybrid routes (tự quản lý middleware trong từng file route)
app.use("/api/auth", authRoute);
app.use("/api/fields", fieldRoute);
app.use("/api/services", serviceRoute);
app.use("/api/matches", matchRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/bookings", bookingRoute);

// private routes (bắt buộc đăng nhập)
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/notifications", notificationRoute); 
app.use("/api/invoices", invoiceRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/customers", customerRoute);
// ------------------------------------------------

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${PORT} is already in use. Run: netstat -ano | findstr :${PORT}  then taskkill /PID <PID> /F`
      );
      process.exit(1);
    } else {
      throw err;
    }
  });

  cron.schedule("*/1 * * * *", () => {
    cleanExpiredUsers();
  });
});
