import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "./socketClient";


// export const useBookingSocket  = (userId) => {
//     const queryClient = useQueryClient();
//     const [isConnected, setIsConnected] = useState(socket.connected);

//     useEffect(() => {
//         const onConnect = () => {
//             setIsConnected(true);
//             console.log("🟢 [Socket] Đã kết nối thành công! ID:", socket.id);
//         };

//         const onConnectError = (err) => {
//             console.error("🔴 Lỗi kết nối:", err.message);
//         };

//         const onDisconnect = () => {
//             setIsConnected(false);
//             console.log("🔴 Đã ngắt kết nối");
//         };
        
//         if (!socket.connected) {
//             socket.connect();
//         }

//         const onSlotUpdated = (data) => {
//             console.log(data.bookingDate); 
//             queryClient.setQueryData(
//                 ["slots", data.fieldId, data.bookingDate?.split("T")[0]],
//                 (old) => {
//                     if (!old) return old;
                    
//                     return old.map((slot)=>
//                         slot.slotId===data.slotId
//                         ? {
//                             ...slot,
//                             status:data.status,
//                             isMyHold:data.userId === userId,
//                             expiresAt:data.expiresAt,
//                             ttl:data.ttl,
//                         }
//                         :slot
//                     );
//                 }
//             );
//         };
        
//         socket.on("connect", onConnect);
//         socket.on("slot_updated", onSlotUpdated);
//         socket.on("disconnect", onDisconnect);
//         socket.on("connect_error", onConnectError);

//         return ()=>{
//             socket.off("slot_updated", onSlotUpdated);
//             socket.off("connect", onConnect);
//             socket.off("connect_error", onConnectError);
//             socket.off("disconnect", onDisconnect)   
//         }
//     },[]);

//     return {isConnected};
// }

export const useBookingSocket = (
  userId: string | number | undefined,
  fieldId: string | number | null,
  bookingDate: string | null
) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(socket.connected);

  const formattedDate = bookingDate ? bookingDate.split("T")[0] : null;

  useEffect(() => {
    if (!fieldId || !formattedDate) return;

    const joinRoom = () => {
      socket.emit("join:schedule", { fieldId, bookingDate: formattedDate });
    };

    const onConnect = () => {
      setIsConnected(true);
      joinRoom(); // Tự động join lại nếu bị rớt mạng reconnect
    };

    const onDisconnect = () => setIsConnected(false);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    // Cập nhật cache TanStack Query khi có người Hold / Unhold
    const onScheduleUpdated = (data: any) => {
      const eventDate = data.bookingDate?.split("T")[0];
      queryClient.setQueryData(
        ["slots", data.fieldId, eventDate],
        (oldData: any[]) => {
          if (!oldData) return oldData;
          return oldData.map((slot) =>
            slot.holdId === data.holdId
              ? {
                  ...slot,
                  status: data.status,
                  isMyHold: Number(data.userId) === Number(userId), 
                  expiresAt: data.expiresAt,
                  ttl: Number(data.ttl),
                }
              : slot
          );
        }
      );

      if (Number(data.userId) === Number(userId)) {
        queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("schedule:updated", onScheduleUpdated);

    // 🧹 CLEANUP: Chuyển ngày hoặc unmount component thì leave room cũ
    return () => {
      socket.emit("leave:schedule", { fieldId, bookingDate: formattedDate });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("schedule:updated", onScheduleUpdated);
    };
  }, [userId, fieldId, formattedDate, queryClient]);

  return { isConnected };
};