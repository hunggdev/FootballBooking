// src/components/account/AccountHeader.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User, UserRole, UserStatus } from "@/types/user";

const roleLabel: Record<UserRole, string> = {
  admin: "Quản trị viên",
  customer: "Khách hàng",
};

const statusLabel: Record<UserStatus, string> = {
  active: "Đang hoạt động",
  inactive: "Ngưng hoạt động",
  banned: "Đã khóa",
};

export function AccountHeader({ user }: { user: User }) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <Avatar className="h-8 w-8 border border-border/60">
        <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
          {getInitials(user?.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-base font-semibold text-text-primary">
          {user.fullName}
        </p>
        <p className="text-sm text-text-muted">{user.email}</p>
        <div className="mt-1 flex gap-2">
          <Badge
            variant="outline"
            className="border-border text-text-secondary"
          >
            {user.role ? roleLabel[user.role] : "Khách hàng"}
          </Badge>
          <Badge
            variant="outline"
            className="border-border text-text-secondary"
          >
            {statusLabel[user.status]}
          </Badge>
        </div>
      </div>
    </div>
  );
}
