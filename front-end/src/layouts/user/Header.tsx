import NotificationDropdown from "@/components/common/Notification";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavLink, useNavigate } from "react-router-dom";

// 1. Cấu hình thêm thuộc tính `exact` để kiểm soát route nào cần Active khớp tuyệt đối
const navItems = [
  { id: "home", label: "Trang chủ", path: "/user", exact: true },
  { id: "booking", label: "Đặt sân", path: "/user/booking", exact: false },
  { id: "reviews", label: "Đánh giá", path: "/user/reviews", exact: false },
  { id: "odds", label: "Kèo đấu", path: "/user/match", exact: false },
];

export function Header() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div
          className="cursor-pointer text-xl font-bold"
          onClick={() => navigate("/user")}
        >
          Football Booking
        </div>

        {/* Menu */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.id}
                to={item.path}
                // 2. Truyền exact vào prop end. Chỉ trang chủ mới dùng `end={true}`
                end={item.exact}
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.id}
                className="cursor-not-allowed rounded-md px-4 py-2 text-sm text-muted-foreground opacity-60"
                title="Sắp ra mắt"
              >
                {item.label}
              </span>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationDropdown />

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <span>{user?.fullName ?? "Người dùng"}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/user/account")}>
                Thông tin tài khoản
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/user/history")}>
                Lịch sử đặt sân
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
