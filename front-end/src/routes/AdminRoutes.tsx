import { Routes, Route } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import ManageCustomerPage from "@/pages/admin/ManageCustomerPage";
import ProtectedRoute from "@/features/auth/ProtectedRoute";

function AdminRoutes() {

  return <>
        <Routes>
            <Route element={<ProtectedRoute/>}>
                <Route element={<AdminLayout activeNavId="dashboard" />}>
                    <Route path="" element={<DashboardPage/>} />
                    <Route path="customers" element={<ManageCustomerPage/>} />
                    {/* <Route path=""  /> */}
                </Route>
            </Route>
        </Routes>
    </>
}

export default AdminRoutes;