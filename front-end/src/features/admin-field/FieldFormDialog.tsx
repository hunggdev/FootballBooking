// FieldFormDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import {
  AlertCircle,
  Clock,
  Coins,
  Layers,
  Plus,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { useCreateSlot, useDeleteSlot, useField } from "@/stores/useFieldStore";
import { isAxiosError } from "axios";
import { toast } from "sonner";

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

  const generateTimeGrid = (
    defaultPrice = 200000,
    defaultStatus = "AVAILABLE",
  ) => {
    const tG = [];
    for (let hour = 0; hour < 24; hour++) {
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

  const deleteSlotMutation = useDeleteSlot();
  const createSlotMutation = useCreateSlot();

  const getErrorMessage = (err: unknown, defaultMsg: string) => {
    if (isAxiosError(err) && err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return defaultMsg;
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!confirm("Bạn có chắc muốn xóa khung giờ này?")) return;

    try {
      await deleteSlotMutation.mutateAsync(slotId);
      toast.success("Xóa khung giờ thành công!");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Xóa khung giờ thất bại.");
      toast.error(msg);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!numericFieldId) return;

    if (!starttime || !endtime) {
      const msg = "Vui lòng nhập giờ bắt đầu và giờ kết thúc.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (Number(price) <= 0) {
      const msg = "Giá tiền phải lớn hơn 0.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    try {
      await createSlotMutation.mutateAsync({
        fieldId: numericFieldId,
        payload: {
          starttime,
          endtime,
          price: Number(price),
          status: "AVAILABLE",
        },
      });
      toast.success("Thêm khung giờ thành công!");
      setFormError(null);
      setShowAddForm(false);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Thêm khung giờ thất bại.");
      setFormError(msg);
      toast.error(msg);
    }
  };

  const tG = generateTimeGrid(200000, "AVAILABLE");
  const [timeGrid, setTimeGrid] = useState(tG);
  const [selectedFieldSlots, setSelectedFieldSlots] = useState<any[]>([]);

  const handleToggleSelect = (slot: any) => {
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

  const handlePriceChange = (slotId: number, newPrice: string | number) => {
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

  const [starttime, setStarttime] = useState("07:00");
  const [endtime, setEndtime] = useState("08:00");
  const [price, setPrice] = useState("200000");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) setError(null);
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
      <DialogContent className="max-w-2xl sm:max-w-4xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  {isEditing
                    ? `Sửa thông tin sân bóng #${initialData?.fieldId}`
                    : "Thêm sân bóng mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {isEditing
                    ? "Cập nhật thông tin mô tả, ảnh và quản lý các khung giờ hoạt động"
                    : "Tạo sân bóng mới và chọn các khung giờ hoạt động ban đầu"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
          {isLoading && isEditing && (
            <div className="flex items-center justify-center py-4 text-text-muted gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              <span className="text-xs">Đang tải dữ liệu sân...</span>
            </div>
          )}

          {(error || serverError) && (
            <div className="flex items-center gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg p-3.5 text-xs font-medium text-status-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error ?? serverError}</span>
            </div>
          )}

          {/* Form Fields */}
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldWrapper className="sm:col-span-2">
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Tên sân bóng <span className="text-status-danger">*</span>
                </FieldLabel>
                <Input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="VD: Sân bóng Mini 1"
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Loại quy mô sân <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={form.fieldType || undefined}
                  onValueChange={(value) =>
                    updateField("fieldType", (value ?? "") as "" | FieldType)
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {form.fieldType === "FIVE"
                        ? "Sân 5"
                        : form.fieldType === "SEVEN"
                        ? "Sân 7"
                        : "Sân 11"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="FIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 5 người
                    </SelectItem>
                    <SelectItem
                      value="SEVEN"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 7 người
                    </SelectItem>
                    <SelectItem
                      value="ELEVEN"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 11 người
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            </div>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                URL Hình ảnh sân bóng
              </FieldLabel>
              <Input
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://example.com/san-bong.jpg"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mô tả chi tiết
              </FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Mô tả bề mặt cỏ nhân tạo, hệ thống đèn, vị trí..."
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted min-h-[75px] focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>
          </FieldGroup>

          <Separator className="bg-border" />

          {/* Slot Selection or Management */}
          {!isEditing ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Chọn khung giờ & giá tiền mặc định (
                  {selectedFieldSlots.length} đã chọn)
                </p>
                <span className="text-xs text-text-muted">
                  Click vào ô để chọn / bỏ chọn
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {timeGrid.map((slot) => {
                  if (slot.status !== "AVAILABLE") return null;
                  const isSelected = selectedFieldSlots.some(
                    (item) => item.slotId === slot.slotId,
                  );

                  return (
                    <div
                      key={slot.slotId}
                      onClick={() => handleToggleSelect(slot)}
                      className={`relative flex flex-col justify-between rounded-xl border p-2.5 text-xs transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary/10 ring-1 ring-brand-primary/30"
                          : "border-border bg-elevated/40 hover:border-brand-primary/40 hover:bg-elevated"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-text-primary">
                          {formatTimeRange(slot.starttime, slot.endtime)}
                        </span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? "bg-brand-primary" : "bg-text-muted/30"
                          }`}
                        />
                      </div>

                      <div
                        className="flex items-center gap-1 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="number"
                          step={50000}
                          value={slot.price}
                          onChange={(e) =>
                            handlePriceChange(slot.slotId, e.target.value)
                          }
                          className="w-full rounded border border-border bg-surface px-1.5 py-0.5 text-xs font-bold text-brand-primary focus:outline-none focus:border-brand-primary"
                          placeholder="Giá"
                        />
                        <span className="text-text-muted text-[11px]">đ</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Danh sách khung giờ của sân ({field?.fieldSlots?.length || 0})
                </p>
                <Button
                  size="sm"
                  variant={showAddForm ? "secondary" : "default"}
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setFormError(null);
                  }}
                  className={`h-8 text-xs font-semibold gap-1.5 cursor-pointer ${
                    showAddForm
                      ? "border-border bg-elevated text-text-primary"
                      : "bg-brand-primary text-white hover:bg-brand-primary-hover"
                  }`}
                >
                  {showAddForm ? (
                    <>
                      <X className="h-3.5 w-3.5" />
                      Đóng form
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Thêm khung giờ
                    </>
                  )}
                </Button>
              </div>

              {/* Form Add New Slot */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateSlot}
                  className="rounded-xl border border-border bg-elevated/60 p-4 space-y-3.5"
                >
                  <p className="text-xs font-bold text-text-primary">
                    Tạo thêm khung giờ hoạt động mới:
                  </p>

                  {formError && (
                    <div className="flex items-center gap-2 rounded-lg bg-status-danger-bg border border-status-danger/30 p-2.5 text-xs text-status-danger font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-text-muted block mb-1">
                        Giờ bắt đầu
                      </label>
                      <Input
                        type="time"
                        value={starttime}
                        onChange={(e) => {
                          setStarttime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-9 text-xs border-border bg-surface text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-text-muted block mb-1">
                        Giờ kết thúc
                      </label>
                      <Input
                        type="time"
                        value={endtime}
                        onChange={(e) => {
                          setEndtime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-9 text-xs border-border bg-surface text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-text-muted block mb-1">
                        Giá tiền (VNĐ)
                      </label>
                      <Input
                        type="number"
                        step="10000"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          setFormError(null);
                        }}
                        className="h-9 text-xs border-border bg-surface text-text-primary"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createSlotMutation.isPending}
                    className="w-full h-9 text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white cursor-pointer"
                  >
                    {createSlotMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang lưu khung giờ...
                      </span>
                    ) : (
                      "Lưu khung giờ này →"
                    )}
                  </Button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {field?.fieldSlots
                  ?.filter((slot) => slot.status === "AVAILABLE")
                  .map((slot) => (
                    <div
                      key={slot.slotId}
                      className="flex items-center justify-between rounded-xl border border-border bg-elevated/40 p-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-text-primary block">
                          {formatTimeRange(slot.starttime, slot.endtime)}
                        </span>
                        <span className="text-brand-primary font-bold flex items-center gap-0.5">
                          <Coins className="h-3 w-3" />
                          {Number(slot.price).toLocaleString("vi-VN")}&nbsp;đ
                        </span>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDeleteSlot(slot.slotId)}
                        className="h-7 w-7 text-status-danger hover:bg-status-danger-bg hover:text-status-danger cursor-pointer"
                        title="Xóa khung giờ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end gap-3 p-4 bg-elevated/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={isSubmitting}
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-5"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo sân bóng"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
