import { io } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";

// ✅ Lấy userId trực tiếp từ Zustand Store mà KHÔNG dùng React Hook
const getUserSocketId = () => {
  const user = useAuthStore.getState().user;
  return user ? user.userId : null;
};

export const socket = io("http://localhost:5001", {
  // ✅ Dùng hàm callback để Socket.io luôn lấy userId mới nhất khi gọi socket.connect()
  auth: (cb) => {
    cb({
      userId: getUserSocketId(),
    });
  },
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
});