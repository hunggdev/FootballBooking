import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/sockets/socketClient";

export const useUserSocket = (userId: string | number | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();

    const onCartUpdated = () => {
      // Invalidate query giỏ hàng/đơn đặt của tôi
      queryClient.invalidateQueries({ queryKey: ["my-cart"] });
    };

    const onHoldExpired = (data: any) => {
      alert(`Khung giờ ${data.slotId} đã hết hạn giữ chỗ!`);
      queryClient.invalidateQueries({ queryKey: ["my-cart"] });
    };

    socket.on("user:cart_updated", onCartUpdated);
    socket.on("user:hold_expired", onHoldExpired);

    return () => {
      socket.off("user:cart_updated", onCartUpdated);
      socket.off("user:hold_expired", onHoldExpired);
    };
  }, [userId, queryClient]);
};