import api from "@/lib/axios";


export const notificationService = {
    getNotifications: async () => {
        const response = await api.get("/notifications");
        return response.data.notifications;
    },

    getUnreadNotifications: async () => {
        const response = await api.get("/notifications/unread");
        return response.data.unreadCount;
    },
    
    markAsRead: async (notificationId: number) => {
        const response = await api.patch(`/notifications/read/${notificationId}`);
        return response.data.notification;
    },

    markAllAsRead: async () => {
        const response = await api.patch("/notifications/read");
        return response.data.updatedCount;
    }
}