import ProtectedRoute from "@/features/auth/ProtectedRoute";
import UserLayout from "@/layouts/user/UserLayout";
import HomePage from "@/pages/user/HomePage";
import MatchPage from "@/pages/user/MatchPage";
import ProfilePage from "@/pages/user/ProfilePage";
import { Routes, Route } from "react-router";
// import {ChatWidget} from "@/features/user-chatbot/ChatWidget";

function UserRoutes() {

  return <>
    {/* <ChatWidget /> */}
    <Routes>
        <Route element={<ProtectedRoute/>}>
            <Route element={<UserLayout/>}>
                <Route path="" element={<HomePage/>} />
                <Route path="account" element={<ProfilePage/>} />
                <Route path="match" element={<MatchPage/>} />
            </Route>
        </Route> 
    </Routes>
  </>
}

export default UserRoutes;