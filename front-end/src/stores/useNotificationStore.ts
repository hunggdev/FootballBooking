import { queryClient } from "@/lib/queryClient";
import { notificationService } from "@/services/notificationService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";

export const useGetNotification = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    enabled: Boolean(user),
  });
};

export const useGetUnreadNotification = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => notificationService.getUnreadNotifications(),
    enabled: Boolean(user),
  });
};

export const useMarkAsRead = () => {
    return useMutation({
        mutationFn: (notificationId: number) =>
            notificationService.markAsRead(notificationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            queryClient.invalidateQueries({
                queryKey: ["notifications-unread"],
            });
    },
    })
}

export const useMarkAllAsRead = () => {
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            queryClient.invalidateQueries({
                queryKey: ["notifications-unread"],
            });
        },
    })
}
    
