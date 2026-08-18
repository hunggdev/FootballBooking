import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Plus, Trash2, Clock, DollarSign, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useField, useCreateSlot, useDeleteSlot } from "@/stores/useFieldStore";
import type { FieldType, FieldSlot } from "@/types/field";
import { formatDateTime, formatTimeRange } from "@/lib/utils";

interface FieldDetailDialogProps {
  fieldId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fieldTypeLabel: Record<FieldType, string> = {
  FIVE: "Sân 5 người",
  SEVEN: "Sân 7 người",
  ELEVEN: "Sân 11 người",
};

export function FieldDetailDialog({
  fieldId,
  open,
  onOpenChange,
}: FieldDetailDialogProps) {
  const numericFieldId = fieldId ?? 0;
  const { data: field, isLoading, error } = useField(numericFieldId);
  const createSlotMutation = useCreateSlot();
  const deleteSlotMutation = useDeleteSlot();

  const [starttime, setStarttime] = useState("07:00");
  const [endtime, setEndtime] = useState("08:30");
  const [price, setPrice] = useState("200000");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown, defaultMsg: string) => {
    if (isAxiosError(err) && err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return defaultMsg;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">Chi tiết & Quản lý khung giờ sân</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="py-4 text-center text-sm text-text-muted">Đang tải dữ liệu...</p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-status-danger">Không thể tải thông tin sân.</p>
        )}

        {field && (
          <div className="space-y-5 pt-2">
            {field.image && (
              <img
                src={field.image}
                alt={field.name}
                className="h-48 w-full rounded-lg border border-border object-cover"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{field.name}</h2>
                <p className="text-sm font-medium text-brand-primary">
                  {fieldTypeLabel[field.fieldType as FieldType] || field.fieldType}
                </p>
              </div>
              <span className="text-xs text-text-muted">
                Tạo ngày: {formatDateTime(field.createdAt)}
              </span>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mô tả sân
              </p>
              <p className="text-sm text-text-secondary">{field.description || "Chưa có mô tả."}</p>
            </div>

            <Separator className="bg-border" />

            {/* Manage Time Slots Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-base font-bold text-text-primary">
                  <Clock className="h-4 w-4 text-brand-primary" />
                  Danh sách khung giờ của sân
                </h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setFormError(null);
                  }}
                  className={
                    showAddForm
                      ? "h-8 gap-1 border-border bg-surface text-xs font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      : "h-8 gap-1 border-transparent bg-brand-accent text-xs font-bold text-accent-foreground hover:bg-brand-accent-hover"
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showAddForm ? "Đóng form" : "Thêm khung giờ"}
                </Button>
              </div>

              {/* Form Add New Slot */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateSlot}
                  className="space-y-3 rounded-lg border border-border bg-surface p-4"
                >
                  <p className="text-xs font-bold text-text-primary">Tạo khung giờ mới cho sân này:</p>

                  {formError && (
                    <div className="flex items-center gap-2 rounded-md border border-status-danger/30 bg-status-danger-bg p-2.5 text-xs font-medium text-status-danger">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-text-muted">
                        Bắt đầu
                      </label>
                      <Input
                        type="time"
                        value={starttime}
                        onChange={(e) => {
                          setStarttime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-8 border-border bg-elevated text-xs text-text-primary focus-visible:border-brand-accent focus-visible:ring-brand-accent/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-text-muted">
                        Kết thúc
                      </label>
                      <Input
                        type="time"
                        value={endtime}
                        onChange={(e) => {
                          setEndtime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-8 border-border bg-elevated text-xs text-text-primary focus-visible:border-brand-accent focus-visible:ring-brand-accent/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-text-muted">
                        Giá (VNĐ)
                      </label>
                      <Input
                        type="number"
                        step="10000"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          setFormError(null);
                        }}
                        className="h-8 border-border bg-elevated text-xs text-text-primary focus-visible:border-brand-accent focus-visible:ring-brand-accent/30"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createSlotMutation.isPending}
                    className="h-8 w-full cursor-pointer border-transparent bg-brand-primary text-xs font-bold text-white hover:bg-brand-primary-hover"
                  >
                    {createSlotMutation.isPending ? "Đang lưu..." : "Lưu khung giờ này →"}
                  </Button>
                </form>
              )}

              {/* List of slots */}
              {!field.fieldSlots || field.fieldSlots.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border py-4 text-center text-xs text-text-muted">
                  Sân này chưa có khung giờ nào. Vui lòng bấm "Thêm khung giờ" để tạo.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {field.fieldSlots.map((slot: FieldSlot) => (
                    <div
                      key={slot.slotId}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="block font-semibold text-text-primary">
                          {formatTimeRange(slot.starttime, slot.endtime)}
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-brand-primary">
                          <DollarSign className="h-3 w-3" />
                          {Number(slot.price).toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDeleteSlot(slot.slotId)}
                        disabled={deleteSlotMutation.isPending}
                        className="h-7 w-7 cursor-pointer text-status-danger hover:bg-status-danger-bg hover:text-status-danger"
                        title="Xóa khung giờ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
