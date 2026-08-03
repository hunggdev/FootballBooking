import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import UserLayout from "@/layouts/user/UserLayout";
import HomePage from "@/pages/user/HomePage";
import ProfilePage from "@/pages/user/ProfilePage";
import FieldTypePage from "@/pages/user/FieldTypePage";
import FieldListPage from "@/pages/user/FieldListPage";
import FieldDetailPage from "@/pages/user/FieldDetailPage";
import UserHistoryPage from "@/pages/user/UserHistoryPage";
import ReviewPage from "@/pages/user/ReviewPage";

export const userRoutes: RouteObject = {
  path: "/user",
  element: <ProtectedRoute />,
  children: [
    {
      element: <UserLayout />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "account", element: <ProfilePage /> },
        { path: "history", element: <UserHistoryPage /> },
        { path: "reviews", element: <ReviewPage /> },
        { path: "booking", element: <FieldTypePage /> },
        { path: "booking/:typeSlug", element: <FieldListPage /> },
        { path: "booking/:typeSlug/:fieldId", element: <FieldDetailPage /> },
      ],
    },
  ],
};
