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
import { formatTimeRange } from "@/lib/utils";
import { DollarSign, Trash2 } from "lucide-react";
import { useField } from "@/stores/useFieldStore";

interface FieldFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Field | null;
  onSubmit: (data: CreateFieldPayload | UpdateFieldPayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
  fieldId: number | null;
}

const emptyForm = {
  name: "",
  description: "",
  image: "",
  fieldType: "" as "" | FieldType,
};

export function FieldFormDialog({
  fieldId,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: FieldFormDialogProps) {
  const numericFieldId = fieldId ?? 0;
  const { data: field, isLoading } = useField(numericFieldId);

  const generateTimeGrid = (defaultPrice = 0, defaultStatus = "AVAILABLE") => {
    const tG = [];
    for (let hour = 0; hour < 24; hour++) {
      // Định dạng hh:mm (thêm số 0 phía trước nếu < 10)
      const slotId = hour + 1;
      const startHour = String(hour).padStart(2, "0");
      const endHour = String(hour + 1).padStart(2, "0");
      const starttime = `${startHour}:00`;
      const endtime = `${endHour}:00`;

      tG.push({
        slotId,
        starttime,
        endtime,
        price: defaultPrice,
        status: defaultStatus,
      });
    }

    return tG;
  };

  const tG = generateTimeGrid(200000, "AVAILABLE");

  const [timeGrid, setTimeGrid] = useState(tG);
  const [selectedFieldSlots, setSelectedFieldSlots] = useState([]);

  const handleToggleSelect = (slot) => {
    setSelectedFieldSlots((prev) => {
      const isExist = prev.some((item) => item.slotId === slot.slotId);
      if (isExist) {
        return prev.filter((item) => item.slotId !== slot.slotId);
      } else {
        return [
          ...prev,
          {
            slotId: slot.slotId,
            starttime: slot.starttime,
            endtime: slot.endtime,
            price: slot.price,
            status: slot.status,
          },
        ];
      }
    });
  };

  const handlePriceChange = (slotId, newPrice) => {
    const val = Number(newPrice) || 0;

    setTimeGrid((prev) =>
      prev.map((item) =>
        item.slotId === slotId ? { ...item, price: val } : item,
      ),
    );

    setSelectedFieldSlots((prev) =>
      prev.map((item) =>
        item.slotId === slotId ? { ...item, price: val } : item,
      ),
    );
  };

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
    value: (typeof form)[K],
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
      selectedFieldSlots: selectedFieldSlots || [],
    };

    onSubmit(payload);
    resetForm();
  };

  const resetForm = () => {
    setForm(initialData ? defaultForm : emptyForm);
    setError(null);
    setSelectedFieldSlots([]);
    setTimeGrid(generateTimeGrid(200000, "AVAILABLE"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa sân bóng" : "Thêm sân bóng"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        <FieldGroup className="space-y-4">
          <div className="flex gap-2">
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
                  <SelectItem value="ELEVEN">Sân 11 người</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

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

        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {timeGrid.map((slot) => {
              if (slot.status !== "AVAILABLE") return null;

              // Kiểm tra xem ô hiện tại đã được chọn chưa
              const isSelected = selectedFieldSlots.some(
                (item) => item.slotId === slot.slotId,
              );

              return (
                <div
                  key={slot.slotId}
                  onClick={() => handleToggleSelect(slot)}
                  className={`relative flex flex-col justify-between rounded-lg border p-2.5 text-xs transition-all cursor-pointer select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  {/* Giờ + Indicator đã chọn */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">
                      {formatTimeRange(slot.starttime, slot.endtime)}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  </div>

                  {/* Ô nhập chỉnh sửa Giá */}
                  <div
                    className="flex items-center gap-1 mt-1"
                    onClick={(e) => e.stopPropagation()} // 💡 Ngăn sự kiện click vào Input bị ăn theo sự kiện chọn ô
                  >
                    <input
                      type="number"
                      step={50000}
                      value={slot.price}
                      onChange={(e) =>
                        handlePriceChange(slot.slotId, e.target.value)
                      }
                      className="w-full rounded border border-input bg-background px-1.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Nhập giá"
                    />
                    <span className="text-muted-foreground font-medium">đ</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
            {field?.fieldSlots
              ?.filter((slot) => slot.status === "AVAILABLE")
              .map((slot) => (
                <div
                  key={slot.slotId}
                  className="flex items-center justify-between rounded-lg border p-2.5 bg-card text-xs shadow-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground block">
                      {formatTimeRange(slot.starttime, slot.endtime)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <DollarSign className="h-3 w-3" />
                      {Number(slot.price).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    // onClick={() => handleDeleteSlot(slot.slotId)}
                    // disabled={deleteSlotMutation.isPending}
                    className="h-7 w-7 text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                    title="Xóa khung giờ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
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
