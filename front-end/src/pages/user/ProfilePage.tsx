// src/components/account/AccountPage.tsx
import { AccountHeader } from "../../features/user-account/AccountHeader";
import { AccountInfoList } from "../../features/user-account/AccountInfoList";
import { EditAccountForm } from "../../features/user-account/EditAccountForm";
import { ChangePasswordSection } from "../../features/user-account/ChangePasswordSection";
import type { User } from "@/types/user";
import { useAuthStore } from "@/stores/useAuthStore";

// Dữ liệu mẫu - thực tế sẽ lấy từ API/context người dùng đang đăng nhập



const ProfilePage = () => {
  const user = useAuthStore((s)=>s.user);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <p className="text-sm text-text-muted">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  const mockUser: User = {
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <h1 className="text-lg font-semibold">Thông tin tài khoản</h1>
        <AccountHeader user={mockUser} />
        <AccountInfoList user={mockUser} />
        <EditAccountForm user={mockUser} />
        <ChangePasswordSection />
      </div>
      
    </div>
  );
}

export default ProfilePage;
