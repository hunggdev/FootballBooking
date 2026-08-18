import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound, History } from "lucide-react";

const navItems = [
  {
    id: "home",
    label: "Trang chủ",
    path: "/user",
    exact: true,
  },
  {
    id: "booking",
    label: "Đặt sân",
    path: "/user/booking",
    exact: false,
  },
  {
    id: "reviews",
    label: "Đánh giá",
    path: "/user/reviews",
    exact: false,
  },
  {
    id: "odds",
    label: "Kèo đấu",
    path: "/user/match",
    exact: false,
  },
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

  const userInitial = user?.fullName?.charAt(0).toUpperCase() ?? "U";

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-border
        bg-deep/95
        text-text-primary
        backdrop-blur
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          gap-4
          px-4
        "
      >
        {/* ================= LOGO ================= */}
        <button
          type="button"
          onClick={() => navigate("/user")}
          className="
                  flex  
                  shrink-0
                  items-center  
                  gap-2.5
                  text-left
                  transition-opacity
                  hover:opacity-90
                "
        >
          <div
            className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-brand-primary
                      to-brand-accent
                      text-lg
                      font-extrabold
                      text-white
                      shadow-sm
                    "
          >
            S
          </div>

          {/* Brand */}
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold leading-4 text-text-primary">
              SÂN BÓNG <span className="text-brand-accent">S</span>
            </p>

            <p
              className="
        mt-0.5
        text-[9px]
        font-medium
        uppercase
        tracking-[0.18em]
        text-text-muted
      "
            >
              FOOTBALL BOOKING
            </p>
          </div>
        </button>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                transition-all
                duration-200

                ${isActive
                  ? `
                      bg-brand-primary
                      text-white
                      shadow-sm
                    `
                  : `
                      text-text-secondary
                      hover:bg-surface-hover
                      hover:text-text-primary
                    `
                }

                sm:px-4
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ================= USER ================= */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-border
              bg-surface
              px-2
              py-1.5
              text-sm
              outline-none
              transition-all
              hover:border-brand-primary/40
              hover:bg-surface-hover
              focus-visible:ring-2
              focus-visible:ring-brand-primary/30
            "
          >
            <Avatar className="h-8 w-8 border border-brand-primary/30">
              <AvatarFallback
                className="
                  bg-brand-primary/10
                  font-bold
                  text-brand-primary
                "
              >
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <span className="hidden max-w-[120px] truncate font-medium text-text-primary sm:block">
              {user?.fullName ?? "Người dùng"}
            </span>

            <ChevronDown className="hidden h-3.5 w-3.5 text-text-muted sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="
              w-56
              rounded-xl
              border-border
              bg-elevated
              p-1.5
              text-text-primary
              shadow-lg
            "
          >
            {/* User info */}
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-text-primary">
                {user?.fullName ?? "Người dùng"}
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Tài khoản người dùng
              </p>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            {/* Account */}
            <DropdownMenuItem
              onClick={() => navigate("/user/account")}
              className="
                cursor-pointer
                gap-2.5
                rounded-lg
                py-2.5
                text-text-secondary
            
                focus:text-text-primary
              "
            >
              <UserRound className="h-4 w-4 text-brand-primary" />
              Thông tin tài khoản
            </DropdownMenuItem>

            {/* History */}
            <DropdownMenuItem
              onClick={() => navigate("/user/history")}
              className="
                cursor-pointer
                gap-2.5
                rounded-lg
                py-2.5
                text-text-secondary
              
                focus:text-text-primary
              "
            >
              <History className="h-4 w-4 text-brand-primary" />
              Lịch sử đặt sân
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="
                cursor-pointer
                gap-2.5
                rounded-lg
                py-2.5
                text-status-danger
                focus:bg-status-danger-bg
                focus:text-status-danger
              "
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
