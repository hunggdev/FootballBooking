// src/components/admin/customers/CustomersPage.tsx
import { PageHeader } from "@/layouts/admin/PageHeader";
import { CustomerStatsCards } from "./CustomerStatsCards";
import { CustomerFilterBar } from "./CustomerFilterBar";
import { CustomersTable } from "./CustomersTable";
import { useCustomers } from "@/stores/useCustomerStore";
export function ManageCustomer() {
  const {data, isLoading, error} = useCustomers();
  console.log(data);

  if (isLoading)
        return <div>Loading...</div>;

    if (error)
        return <div>Có lỗi xảy ra.</div>;

  return (
    <>
      <PageHeader
        title="Quản lý khách hàng"
        subtitle="Danh sách khách hàng đã đăng ký trên hệ thống"
      />
      <CustomerStatsCards totalCustomers={data?.totalCustomers ?? 0} newUsers={data?.newUserInThisMonth ?? 0}/>
      <CustomerFilterBar />
      <CustomersTable customers={data?.customers ?? []}/>
    </>
  );
}
