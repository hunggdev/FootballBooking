import { BrowserRouter, Routes, Route } from "react-router";
import SignInPage from "../pages/common/SignInPage";
import SignUpPage from "../pages/common/SignUpPage";
import {Toaster} from "sonner"
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ForgotPasswordPage from "@/pages/common/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/common/ResetPasswordPage";




function AppRoutes() {

  return <>
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>

        {/* public routes*/}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default AppRoutes;
