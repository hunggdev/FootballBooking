// FieldFormDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import type {
  Field,
  CreateFieldPayload,
  UpdateFieldPayload,
  FieldType,
} from "@/types/field";

interface FieldFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Field | null;
  onSubmit: (data: CreateFieldPayload | UpdateFieldPayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const emptyForm = {
  name: "",
  description: "",
  image: "",
  fieldType: "" as "" | FieldType,
};

export function FieldFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: FieldFormDialogProps) {
  const isEditing = !!initialData;
  const defaultForm = initialData
    ? {
        name: initialData.name,
        description: initialData.description ?? "",
        image: initialData.image ?? "",
        fieldType: initialData.fieldType,
      }
    : emptyForm;

  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      return "Tên sân không được để trống";
    }
    if (form.name.length > 255) {
      return "Tên sân tối đa 255 ký tự";
    }
    if (!form.fieldType) {
      return "Vui lòng chọn loại sân";
    }
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    const payload: CreateFieldPayload | UpdateFieldPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      image: form.image.trim() || undefined,
      fieldType: form.fieldType as FieldType,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa sân bóng" : "Thêm sân bóng"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          <FieldWrapper>
            <FieldLabel>Tên sân</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Loại sân</FieldLabel>
            <Select
              value={form.fieldType || undefined}
              onValueChange={(value) =>
                updateField("fieldType", (value ?? "") as "" | FieldType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại sân" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIVE">Sân 5 người</SelectItem>
                <SelectItem value="SEVEN">Sân 7 người</SelectItem>
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Ảnh (URL)</FieldLabel>
            <Input
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Mô tả</FieldLabel>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </FieldWrapper>

          {(error || serverError) && (
            <p className="text-sm text-red-500">{error ?? serverError}</p>
          )}
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
              ? "Lưu thay đổi"
              : "Tạo sân"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
