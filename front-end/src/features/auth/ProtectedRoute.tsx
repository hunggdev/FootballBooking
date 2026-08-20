import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
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

  const token = useAuthStore.getState().accessToken;
  const user = useAuthStore.getState().user;

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && user && !allowedRoles.map((r) => r.toLowerCase()).includes(user.role?.toLowerCase() || "")) {
    const redirectPath = user.role?.toLowerCase() === "admin" ? "/admin" : "/user";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}