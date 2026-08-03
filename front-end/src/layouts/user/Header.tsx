// src/components/home/Header.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import LogOut from "@/features/auth/SignOutButton";

const navItems = [
  { id: "home", label: "Trang chủ", url: "/" },
  { id: "booking", label: "Đặt sân", url: "/" },
  { id: "match", label: "Kèo đấu", url: "/match" },
];

export function Header() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLS = async () => {
    try {
      navigate("/history")
    } catch (error) {
      console.log(error); 
    }
  }

  const handleDX = async() => {
    try {
      await useAuthStore.getState().signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);   
    }
  }

  const handleTT = async () => {
    try {
      navigate("/account")
    } catch (error) {
        console.error(error);
    }
  }
  
  const handleClick = async () => {
    try {
      navigate("/")
    } catch (error) {
      console.log(error); 
    }
  }
  
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo placeholder */}
        <div className="flex items-center gap-2 border px-3 py-1.5 text-sm font-medium">
          Logo / Tên thương hiệu
        </div>

        {/* Nav menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink className="border px-3 py-1.5 text-sm" href={item.url}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Avatar className="h-6 w-6 border">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <span>{user?.fullName}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleTT}>
              Thông tin tài khoản
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLS}>
              Lịch sử đặt sân
            </DropdownMenuItem>

            <DropdownMenuItem >
              <LogOut/>            
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
