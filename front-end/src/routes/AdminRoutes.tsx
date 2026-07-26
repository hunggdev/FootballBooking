import { Routes, Route } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import ManageCustomerPage from "@/pages/admin/ManageCustomerPage";
import ManageFieldPage from "@/pages/admin/ManageFieldPage";
import ManageServicePage from "@/pages/admin/ManageServicePage";
import ProtectedRoute from "@/features/auth/ProtectedRoute";

function AdminRoutes() {

  return <>
        <Routes>
            <Route element={<ProtectedRoute/>}>
                <Route element={<AdminLayout activeNavId="dashboard" />}>
                    <Route path="" element={<DashboardPage/>} />
                    <Route path="customers" element={<ManageCustomerPage/>} />
                    <Route path="fields" element={<ManageFieldPage/>} />
                     <Route path="services" element={<ManageServicePage/>} />
                    {/* <Route path=""  /> */}
                </Route>
            </Route>
        </Routes>
    </>
}

export default AdminRoutes;