import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { AdminTopHeader } from "./AdminTopHeader";

interface AdminLayoutProps {
  activeNavId?: string;
}

export default function AdminLayout({
  activeNavId = "dashboard",
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-base text-text-primary">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar activeId={activeNavId} />

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Header */}
          <AdminTopHeader />

          {/* Page content */}
          <main className="flex-1 bg-base p-6">
            <div className="flex flex-col gap-6">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-deep px-6 py-4 text-center text-xs text-text-muted">
            © 2026 Sân Bóng S. Tất cả quyền được bảo lưu.
          </footer>
        </div>
      </div>
    </div>
  );
}