import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import UserLayout from "@/layouts/user/UserLayout";
import HomePage from "@/pages/user/HomePage";
import ProfilePage from "@/pages/user/ProfilePage";
import FieldTypePage from "@/pages/user/FieldTypePage";
import FieldListPage from "@/pages/user/FieldListPage";
import UserHistoryPage from "@/pages/user/UserHistoryPage";
import ReviewPage from "@/pages/user/ReviewPage";
import MatchPage from "@/pages/user/MatchPage";
import FieldDetailPage from "@/pages/user/FieldDetailPage";

export const userRoutes: RouteObject = {
  path: "/user",
  element: <UserLayout />, // Đưa Layout ra ngoài làm khung chung
  children: [
    // ==========================================
    // 1. PUBLIC ROUTES (Khách vãng lai chưa login vẫn xem được) 
    // ==========================================
    { path: "", element: <HomePage /> },
    { path: "booking", element: <FieldTypePage /> },
    { path: "booking/:typeSlug", element: <FieldListPage /> },
    { path: "booking/:typeSlug/:fieldId", element: <FieldDetailPage /> },
    { path: "match", element: <MatchPage /> },
    { path: "reviews", element: <ReviewPage /> },


    // ==========================================
    // 2. PROTECTED ROUTES (Bắt buộc đăng nhập mới truy cập được)
    // ==========================================
    {
      element: <ProtectedRoute allowedRoles={["admin", "customer"]} />,
      children: [
        { path: "account", element: <ProfilePage /> },
        { path: "history", element: <UserHistoryPage /> },
        { path: "reviews", element: <ReviewPage /> },
      ],
    },
  ],
};