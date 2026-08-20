import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useGetNotification,
  useGetUnreadNotification,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/stores/useNotificationStore";
import { formatDateTime } from "@/lib/utils";
import { useNotificationSocket } from "@/sockets/useNotificationSocket";
import { useAuthStore } from "@/stores/useAuthStore";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  useNotificationSocket(user?.userId);
  
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
  } = useGetNotification();

  const {
    data: unreadNotifications = 0,
  } = useGetUnreadNotification();

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const unreadCount = unreadNotifications;

  const handleMarkAsRead = async (notificationId: number) => {
    try {
        await markAsReadMutation.mutateAsync(notificationId);

        queryClient.invalidateQueries({
        queryKey: ["notifications"],
        });

        queryClient.invalidateQueries({
        queryKey: ["notifications-unread"],
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);
    }
    };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[380px] overflow-hidden rounded-lg border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="font-semibold">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500">
                  {unreadCount} thông báo chưa đọc
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  await markAllAsReadMutation.mutateAsync();

                  queryClient.invalidateQueries({
                    queryKey: ["notifications"],
                  });

                  queryClient.invalidateQueries({
                    queryKey: ["notifications-unread"],
                  });
                }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <CheckCheck size={16} />
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[450px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                Đang tải thông báo...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có thông báo
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification.notificationId}
                  className={`cursor-pointer border-b px-4 py-3 transition hover:bg-gray-50 ${
                    !notification.isRead
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    handleMarkAsRead(notification.notificationId)
                  }
                >
                  <div className="flex gap-3">
                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}

                    <div className="flex-1">
                      <h4 className="font-medium">
                        {notification.title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;