import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { PageHeader } from "@/layouts/admin/PageHeader";
import { Button } from "@/components/ui/button";

import { ServiceTable } from "./ServiceTable";
import { ServiceFormDialog } from "./ServiceFormDialog";
import { ServiceDetailDialog } from "./ServiceDetailDialog";
import { Pagination } from "@/components/common/Pagination";


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

const PAGE_SIZE = 10;

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export function ManageService() {
  const { data: services = [], isLoading, error } = useServices();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [detailServiceId, setDetailServiceId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  const filteredServices = useMemo(() => {
    return services.filter((service: Service) =>
      service.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [services, search]);

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
    const ok = confirm(`Bạn có chắc muốn xóa dịch vụ "${service.name}"?`);
    if (!ok) return;

    setListError(null);

    deleteService.mutate(service.serviceId, {
      onError(error) {
        setListError(getErrorMessage(error, "Xóa dịch vụ thất bại."));
      },
    });
  };

  const handleSubmit = (values: CreateServicePayload | UpdateServicePayload) => {
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
            setFormError(getErrorMessage(error, "Cập nhật dịch vụ thất bại."));
          },
        }
      );
      return;
    }

    createService.mutate(values as CreateServicePayload, {
      onSuccess() {
        setDialogOpen(false);
      },
      onError(error) {
        setFormError(getErrorMessage(error, "Tạo dịch vụ thất bại."));
      },
    });
  };

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">Không thể tải danh sách dịch vụ.</div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý dịch vụ"
        subtitle="Quản lý thông tin dịch vụ của hệ thống"
      />

      <div className="flex items-center justify-between mt-4">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <Button
          variant="outline"
          onClick={handleAdd}
          className="border"
        >
          Thêm dịch vụ
        </Button>
      </div>

      {listError && (
        <p className="mt-4 text-sm text-red-500">{listError}</p>
      )}

      <ServiceTable
        services={filteredServices}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}  />

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
