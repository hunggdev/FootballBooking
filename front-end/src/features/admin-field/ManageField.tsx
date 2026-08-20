import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { PageHeader } from "@/layouts/admin/PageHeader";

import { FieldFilterBar } from "./FieldFilterBar";
import { FieldsTable } from "./FieldTable";
import { FieldFormDialog } from "./FieldFormDialog";
import { FieldDetailDialog } from "./FieldDetailDialog";
import { Pagination } from "@/components/common/Pagination";

import {
  useFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/stores/useFieldStore";

import type {
  Field,
  CreateFieldPayload,
  UpdateFieldPayload,
} from "@/types/field";

interface ErrorResponse {
  message?: string;
}

const PAGE_SIZE = 10;

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export function ManageField() {
  const { data: fields = [], isLoading, error } = useFields();

  const createField = useCreateField();
  const updateField = useUpdateField();
  const deleteField = useDeleteField();

  const [search, setSearch] = useState("");
  const [fieldType, setFieldType] = useState<"all" | "FIVE" | "SEVEN" | "ELEVEN" >("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [detailFieldId, setDetailFieldId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFields = useMemo(() => {
    return fields.filter((field: Field) => {
      const matchSearch = field.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchFieldType =
        fieldType === "all" || field.fieldType === fieldType;

      return matchSearch && matchFieldType;
    });
  }, [fields, search, fieldType]);

  const totalPages = Math.max(1, Math.ceil(filteredFields.length / PAGE_SIZE));


  const handleAdd = () => {
    setEditingField(null);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleView = (field: Field) => {
    setDetailFieldId(field.fieldId);
    setDetailOpen(true);
  };

  const handleDelete = (field: Field) => {
    const ok = confirm(`Bạn có chắc muốn xóa sân "${field.name}"?`);
    if (!ok) return;

    setListError(null);

    deleteField.mutate(field.fieldId, {
      onError(error) {
        setListError(getErrorMessage(error, "Xóa sân thất bại."));
      },
    });
  };

  const handleSubmit = (values: CreateFieldPayload | UpdateFieldPayload) => {
    setFormError(null);

    if (editingField) {
      updateField.mutate(
        {
          fieldId: editingField.fieldId,
          payload: values as UpdateFieldPayload,
        },
        {
          onSuccess() {
            setDialogOpen(false);
            setEditingField(null);
          },
          onError(error) {
            setFormError(getErrorMessage(error, "Cập nhật sân thất bại."));
          },
        }
      );
      return;
    }

    createField.mutate(values as CreateFieldPayload, {
      onSuccess() {
        setDialogOpen(false);
      },
      onError(error) {
        setFormError(getErrorMessage(error, "Tạo sân thất bại."));
      },
    });
  };

  if (isLoading) {
    return <div className="p-8 text-text-secondary">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">Không thể tải danh sách sân.</div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý sân bóng"
        subtitle="Quản lý thông tin sân bóng của hệ thống"
      />

      <FieldFilterBar
        search={search}
        onSearchChange={setSearch}
        fieldType={fieldType}
        onFieldTypeChange={setFieldType}
        onClick={handleAdd}
      />

      {listError && (
        <p className="mt-4 text-sm text-status-danger">{listError}</p>
      )}

      <FieldsTable
        fields={filteredFields}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}  />
      

      <FieldFormDialog
        fieldId={detailFieldId}
        key={editingField?.fieldId ?? "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingField}
        onSubmit={handleSubmit}
        isSubmitting={createField.isPending || updateField.isPending}
        serverError={formError}
      />

      <FieldDetailDialog
        fieldId={detailFieldId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
