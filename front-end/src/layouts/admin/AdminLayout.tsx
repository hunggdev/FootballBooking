import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { AdminTopHeader } from "./AdminTopHeader";

interface AdminLayoutProps {
  activeNavId?: string;
}

export default function AdminLayout({
  activeNavId = "",
}: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-base overflow-x-hidden">
      <Sidebar
        activeId={activeNavId}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content — offset sidebar width */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 overflow-x-hidden ${
          collapsed
            ? "ml-[72px] w-[calc(100vw-72px)] max-w-[calc(100vw-72px)]"
            : "ml-64 w-[calc(100vw-16rem)] max-w-[calc(100vw-16rem)]"
        }`}
      >
        <AdminTopHeader />

        <main className="flex-1 p-6 min-w-0">
          <div className="flex flex-col gap-6 min-w-0">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-border/40 px-6 py-3 text-center text-[11px] text-text-muted">
          © 2026 Sân Bóng S.&nbsp;
          <span className="bg-[image:var(--token-gradient-brand)] bg-clip-text text-transparent font-medium">
            Tất cả quyền được bảo lưu.
          </span>
        </footer>
      </div>
    </div>
  );
}