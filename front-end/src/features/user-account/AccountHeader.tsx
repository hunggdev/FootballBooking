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
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <Avatar className="h-14 w-14 border border-brand-primary/30">
        <AvatarFallback className="bg-brand-primary/10 text-lg font-bold text-brand-primary">
          {user.fullName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-base font-semibold text-text-primary">{user.fullName}</p>
        <p className="text-sm text-text-muted">{user.email}</p>
        <div className="mt-1 flex gap-2">
          <Badge variant="outline" className="border-border text-text-secondary">
            {user.role ? roleLabel[user.role] : "Khách hàng"}
          </Badge>
          <Badge variant="outline" className="border-border text-text-secondary">
            {statusLabel[user.status]}
          </Badge>
        </div>
      </div>
    </div>
  );
}
