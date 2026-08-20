import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function PublicRoute() {
  const { accessToken, refresh, fetchMe } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
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
        console.error("PublicRoute auth check:", error);
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    if (!accessToken) {
      checkAuth();
    } else {
      setChecking(false);
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, refresh, fetchMe]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentUser = useAuthStore.getState().user;
  const currentToken = useAuthStore.getState().accessToken;

  if (currentToken && currentUser) {
    const role = currentUser.role?.toLowerCase();
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  return <Outlet />;
}
