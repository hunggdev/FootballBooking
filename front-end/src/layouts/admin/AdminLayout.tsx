// src/components/admin/layout/AdminLayout.tsx

import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { AdminTopHeader } from "./AdminTopHeader";

interface AdminLayoutProps {
  activeNavId?: string;
}

export default function AdminLayout({
  activeNavId = "",
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen ">
      <Sidebar activeId={activeNavId} />

      <div className="flex flex-1 flex-col ml-64">
        <AdminTopHeader />

        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <Outlet />
          </div>
        </main>

        <footer className="border-t px-6 py-4 text-center text-xs opacity-60">
          © 2026 Sân Bóng S. Tất cả quyền được bảo lưu.
        </footer>
      </div>
    </div>
  );
}