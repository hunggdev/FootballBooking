import ProtectedRoute from "@/features/auth/ProtectedRoute";
import UserLayout from "@/layouts/user/UserLayout";
import HomePage from "@/pages/user/HomePage";
import ProfilePage from "@/pages/user/ProfilePage";
import { Routes, Route } from "react-router";

function UserRoutes() {

  return <>
    <Routes>
        <Route element={<ProtectedRoute/>}>
            <Route element={<UserLayout/>}>
                <Route path="" element={<HomePage/>} />
                <Route path="account" element={<ProfilePage/>} />
            </Route>
        </Route> 
    </Routes>
  </>
}

export default UserRoutes;