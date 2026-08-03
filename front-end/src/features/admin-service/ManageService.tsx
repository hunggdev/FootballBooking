import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { PageHeader } from "@/layouts/admin/PageHeader";

import { ServiceFilterBar } from "./ServiceFilterBar";
import { ServiceTable } from "./ServiceTable";
import { ServiceFormDialog } from "./ServiceFormDialog";
import { ServiceDetailDialog } from "./ServiceDetailDialog";

import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/stores/useServiceStore";

import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/service";
import { FormPagination } from "@/components/common/Pagination";

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

export function ManageService() {
  const {
    data,
    isLoading,
    error,
  } = useServices();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const services: Service[] = data?.services ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [detailServiceId, setDetailServiceId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {

      const matchSearch =
        service.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchStatus =
        status === "all" ||
        service.status === status;

      return matchSearch && matchStatus;

    });
  }, [services, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));


  const handleAdd = () => {
    setEditingService(null);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleView = (service: Service) => {
    setDetailServiceId(service.serviceId);
    setDetailOpen(true);
  };

  const handleDelete = (service: Service) => {

    const ok = confirm(
      `Bạn có chắc muốn ngừng hoạt động dịch vụ "${service.name}"?`
    );

    if (!ok) return;

    setListError(null);

    deleteService.mutate(service.serviceId, {
      onError(error) {
        setListError(
          getErrorMessage(
            error,
            "Xóa dịch vụ thất bại."
          )
        );
      },
    });
  };

  const handleSubmit = (
    values:
      | CreateServicePayload
      | UpdateServicePayload
  ) => {

    setFormError(null);

    if (editingService) {

      updateService.mutate(
        {
          serviceId: editingService.serviceId,
          payload: values as UpdateServicePayload,
        },
        {
          onSuccess() {
            setDialogOpen(false);
            setEditingService(null);
          },

          onError(error) {
            setFormError(
              getErrorMessage(
                error,
                "Cập nhật dịch vụ thất bại."
              )
            );
          },
        }
      );

      return;
    }

    createService.mutate(
      values as CreateServicePayload,
      {
        onSuccess() {
          setDialogOpen(false);
        },

        onError(error) {
          setFormError(
            getErrorMessage(
              error,
              "Tạo dịch vụ thất bại."
            )
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-8">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Không thể tải danh sách dịch vụ.
      </div>
    );
  }

  return (
    <>

      <PageHeader
        title="Quản lý dịch vụ"
        subtitle="Quản lý các dịch vụ đi kèm sân bóng của hệ thống"
      />

      <ServiceFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onClick={handleAdd}
        onChagePage={setCurrentPage}
      />

      {listError && (
        <p className="mt-4 text-sm text-red-500">
          {listError}
        </p>
      )}

      <ServiceTable
        services={filteredServices}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />

      <FormPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    <ServiceFormDialog
  key={editingService?.serviceId ?? "create"}
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  initialData={editingService}
  onSubmit={handleSubmit}
  isSubmitting={createService.isPending || updateService.isPending}
  serverError={formError}
/>

      <ServiceDetailDialog
        serviceId={detailServiceId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

    </>
  );
}
