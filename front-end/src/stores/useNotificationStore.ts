import { queryClient } from "@/lib/queryClient"
import { notificationService } from "@/services/notificationService"
import { useMutation, useQuery } from "@tanstack/react-query"


export const useGetNotification = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationService.getNotifications(),
    })
}

export const useGetUnreadNotification = () => {
    return useQuery({
        queryKey: ["notifications-unread"],
        queryFn: () => notificationService.getUnreadNotifications(),
    })
}

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
    
