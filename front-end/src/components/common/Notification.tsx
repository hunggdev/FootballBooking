import { useState, useRef, useEffect } from "react";
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

interface NotificationDropdownProps {
  buttonClassName?: string;
}

const NotificationDropdown = ({
  buttonClassName,
}: NotificationDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  useNotificationSocket(user?.userId);

  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useGetNotification();
  const { data: unreadNotifications = 0 } = useGetUnreadNotification();

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const unreadCount = unreadNotifications;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (unreadCount <= 0) {
      document.title = "Sân Bóng Online";
      return;
    }

    const originalTitle = "Sân Bóng Online";
    let showNotification = true;

    const interval = setInterval(() => {
      document.title = showNotification
        ? `(${unreadCount}) Thông báo mới`
        : originalTitle;

      showNotification = !showNotification;
    }, 1000);

    return () => {
      clearInterval(interval);
      document.title = originalTitle;
    };
  }, [unreadCount]);

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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={
          buttonClassName ||
          "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-surface-hover/60 text-text-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary focus:outline-hidden"
        }
        title="Thông báo"
      >
        <Bell className="h-4.5 w-4.5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-status-danger px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Box */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-border bg-surface text-text-primary shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between border-b border-border/70 bg-deep/50 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs text-text-muted">
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
                className="flex items-center gap-1 text-xs font-medium text-brand-primary transition-colors hover:text-brand-primary-hover"
              >
                <CheckCheck size={14} />
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 custom-scrollbar">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-text-muted">
                Đang tải thông báo...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                Không có thông báo mới
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification.notificationId}
                  className={`group cursor-pointer px-4 py-3 transition-colors duration-150 ${
                    !notification.isRead
                      ? "bg-brand-primary/10 hover:bg-brand-primary/15"
                      : "bg-surface hover:bg-surface-hover"
                  }`}
                  onClick={() => handleMarkAsRead(notification.notificationId)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        !notification.isRead
                          ? "bg-brand-primary shadow-[0_0_8px_rgba(34,165,90,0.8)]"
                          : "bg-transparent"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-text-primary truncate">
                        {notification.title}
                      </h4>

                      <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-[10px] text-text-muted">
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
