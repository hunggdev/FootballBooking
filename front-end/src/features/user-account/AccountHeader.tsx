// src/components/account/AccountHeader.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/user";

const roleLabel: Record<User["role"], string> = {
  admin: "Quản trị viên",
  customer: "Khách hàng",
};

const statusLabel: Record<User["status"], string> = {
  active: "Đang hoạt động",
  inactive: "Ngưng hoạt động",
  banned: "Đã khóa",
};

export function AccountHeader({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4 border p-4">
      <Avatar className="h-14 w-14 border">
        <AvatarFallback className="text-lg">
          {user.fullName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-base font-semibold">{user.fullName}</p>
        <p className="text-sm opacity-60">{user.email}</p>
        <div className="mt-1 flex gap-2">
          <Badge variant="outline">{roleLabel[user.role.toLowerCase()]}</Badge>
          <Badge variant="outline">{statusLabel[user.status.toLowerCase()]}</Badge>
        </div>
      </div>
    </div>
  );
}
