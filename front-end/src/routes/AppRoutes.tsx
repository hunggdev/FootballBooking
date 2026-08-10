import { useRoutes } from "react-router-dom";
import SignInPage from "@/pages/common/SignInPage";
import SignUpPage from "@/pages/common/SignUpPage";
import ForgotPasswordPage from "@/pages/common/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/common/ResetPasswordPage";
import { Toaster } from "sonner";
import { adminRoutes } from "./AdminRoutes";
import { userRoutes } from "./UserRoutes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export default function AppRoutes() {
  const routes = useRoutes([
    { path: "/", element: <SignInPage /> },
    { path: "/signin", element: <SignInPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    adminRoutes,
    userRoutes,
  ]);

  
  return (
    <>
      <Toaster richColors />
      {routes}

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
