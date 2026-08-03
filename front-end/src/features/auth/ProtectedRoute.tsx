import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProtectedRoute() {
  const { loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        let token = useAuthStore.getState().accessToken;

        if (!token) {
          await refresh();
          token = useAuthStore.getState().accessToken;
        }

        if (token && !useAuthStore.getState().user) {
          await fetchMe();
        }
      } catch (error) {
        console.error("ProtectedRoute:", error);
      } finally {
        setStarting(false);
      }
    };

    init();
  }, [refresh, fetchMe]);

  if (loading || starting) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!useAuthStore.getState().accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}