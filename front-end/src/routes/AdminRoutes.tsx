import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "@/features/auth/ProtectedRoute";

import AdminLayout from "@/layouts/admin/AdminLayout";

import DashboardPage from "@/pages/admin/DashboardPage";
import ManageCustomerPage from "@/pages/admin/ManageCustomerPage";
import ManageFieldPage from "@/pages/admin/ManageFieldPage";
import ManageServicePage from "@/pages/admin/ManageServicePage";
import ManageBookingPage from "@/pages/admin/ManageBookingPage";
import BookingHistoryPage from "@/pages/admin/BookingHistoryPage";
import ManageReviewPage from "@/pages/admin/ManageReviewPage";
import ManageInvoicePage from "@/pages/admin/ManageInvoicePage";
import StatsPage from "@/pages/admin/StatsPage";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <ProtectedRoute />,
  children: [
    {
      element: <AdminLayout activeNavId="dashboard" />,
      children: [
        { path: "", element: <DashboardPage /> },
        { path: "customers", element: <ManageCustomerPage /> },
        { path: "accounts", element: <ManageCustomerPage /> },
        { path: "fields", element: <ManageFieldPage /> },
        { path: "services", element: <ManageServicePage /> },
        { path: "bookings", element: <ManageBookingPage /> },
        { path: "bookings/history", element: <BookingHistoryPage /> },
        { path: "reviews", element: <ManageReviewPage /> },
        { path: "feedback", element: <ManageReviewPage /> },
        { path: "invoices", element: <ManageInvoicePage /> },
        { path: "payments", element: <ManageInvoicePage /> },
        { path: "stats", element: <StatsPage /> },
      ],
    },
  ],
};