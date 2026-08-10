// src/components/admin/customers/CustomersPage.tsx
import { PageHeader } from "@/layouts/admin/PageHeader";
import { CustomerStatsCards } from "./CustomerStatsCards";
import { CustomerFilterBar } from "./CustomerFilterBar";
import { CustomersTable } from "./CustomersTable";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useStatsCustomer } from "@/stores/useCustomerStore";
import type { AxiosError } from "axios";
import { useMemo, useState } from "react";


import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  Stats
} from "@/types/customer";
import { CustomerDetailDialog } from "./CustomerDetailDialog";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { Pagination } from "@/components/common/Pagination";

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const axiosError = error as AxiosError<ErrorResponse>;

  return axiosError.response?.data?.message ?? fallback;
}

const PAGE_SIZE = 10;

export function ManageCustomer() {
  const {data, isLoading, error} = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const {data:statsData} = useStatsCustomer();  
  
  const customers: Customer[] = data?.customers ?? [];
  const stats: Stats = statsData?? {};
  console.log(stats);
  
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [detailCustomerId, setDetailCustomerId] = useState<number | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [listError, setListError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
    
          const matchSearch =
            customer.fullName
              .toLowerCase()
              .includes(search.trim().toLowerCase());
    
          const matchStatus =
            status === "all" ||
            customer.status.toLowerCase() === status.toLowerCase();
    
          return matchSearch && matchStatus;
    
        });
      }, [customers, search, status]);

    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
    

  console.log(data);

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormError(null);
    setDialogOpen(true);
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleView = (customer: Customer) => {
    setDetailCustomerId(customer.userId);
    setDetailOpen(true);
  };

  const handleDelete = (customer: Customer) => {
     const ok = confirm(
       `Bạn có chắc muốn ngừng hoạt động tài khoản này "${customer.fullName}"?`
     );
     if (!ok) return;
     setListError(null);
     deleteCustomer.mutate(customer.userId, {
       onError(error) {
         setListError(
           getErrorMessage(
             error,
             "Xóa tài khoản thất bại."
           )
         );
       },
     });
   };

  const handleSubmit = (
    values:
      | CreateCustomerPayload
      | UpdateCustomerPayload
  ) => {

    setFormError(null);

    if (editingCustomer) {
      updateCustomer.mutate(
        {
          customerId: editingCustomer.userId,
          payload: values as UpdateCustomerPayload,
        },
        {
          onSuccess() {
            setDialogOpen(false);
            setEditingCustomer(null);
          },

          onError(error) {
            setFormError(
              getErrorMessage(
                error,
                "Cập nhật thông tin thất bại."
              )
            );
          },
        }
      );
      return;
    }
    createCustomer.mutate(
      values as CreateCustomerPayload,
      {
        onSuccess() {
          setDialogOpen(false);
        },
        onError(error) {
          setFormError(
            getErrorMessage(
              error,
              "Tạo khách hàng thất bại."
            )
          );
        },
      }
    );
  };

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
      <CustomerStatsCards 
        customers={stats?.customers ?? 0} 
        totalUserInThisMonth={stats?.totalUserInThisMonth ?? 0} 
        online={stats?.online ?? 0} 
        bannedCustomers={stats?.bannedCustomers ?? 0}
      />
      <CustomerFilterBar 
        search={search} 
        onSearchChange={setSearch} 
        status={status} 
        onStatusChange={setStatus} 
        onClick={handleAdd} 
        onChangePage={setCurrentPage}
      />
      {listError && (
        <p className="mt-4 text-sm text-red-500">
          {listError}
        </p>
      )}
      <CustomersTable 
        customers={filteredCustomers} 
        onView={handleView} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}  />
      
      <CustomerDetailDialog
        customerId={detailCustomerId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <CustomerFormDialog
        key={editingCustomer?.userId ?? "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingCustomer}
        onSubmit={handleSubmit}
        isSubmitting={createCustomer.isPending || updateCustomer.isPending}
        serverError={formError}
      />
    </>
  );
}
