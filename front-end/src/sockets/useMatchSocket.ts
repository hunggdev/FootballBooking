// import { useEffect, useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { socket } from "./socketClient";

// export const useMatchSocket = (matchId: string | number | undefined) => {
//     const queryClient = useQueryClient();

//     useEffect(() => {
//         if (!matchId) return;

//         if (!socket.connected) socket.connect();

//         const onMatchUpdated = (data: any) => {
//             queryClient.invalidateQueries({ queryKey: ["matches"] });
//         };

//         socket.on("match:created", onMatchUpdated);

//         return () => {
//             socket.off("match:created", onMatchUpdated);
//         };
//     }, [matchId, queryClient]);
// }