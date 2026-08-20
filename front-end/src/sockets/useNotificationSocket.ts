import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "./socketClient";

export const useNotificationSocket = (
  userId: string | number | undefined,
) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(socket.connected);

  

  useEffect(() => {

    

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => setIsConnected(false);

    if (!socket.connected) {
      socket.connect();
    }

    // Cập nhật cache TanStack Query khi có người Hold / Unhold / Booked
  
    const onNotificationUpdated = (data: any) => {
      if(Number(data.userId) === Number(userId)){
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
      }
    }


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("user:notification", onNotificationUpdated);

    // 🧹 CLEANUP: Chuyển ngày hoặc unmount component thì leave room cũ
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user:notification", onNotificationUpdated);
    };
  }, [userId, queryClient]);

  return { isConnected, socket };
};