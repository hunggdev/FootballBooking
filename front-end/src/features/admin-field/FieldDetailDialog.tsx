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
  const [endtime, setEndtime] = useState("08:00");
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
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết & Quản lý khung giờ sân
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-red-500">
            Không thể tải thông tin sân.
          </p>
        )}

        {field && (
          <div className="space-y-5 pt-2">
            {field.image && (
              <img
                src={field.image}
                alt={field.name}
                className="h-48 w-full rounded-lg object-cover border"
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{field.name}</h2>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {fieldTypeLabel[field.fieldType as FieldType] ||
                    field.fieldType}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Tạo ngày: {formatDateTime(field.createdAt)}
              </span>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Mô tả sân
              </p>
              <p className="text-sm">{field.description || "Chưa có mô tả."}</p>
            </div>

            <Separator />

            {/* Manage Time Slots Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Danh sách khung giờ của sân
                </h3>
                <Button
                  size="sm"
                  variant={showAddForm ? "secondary" : "default"}
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setFormError(null);
                  }}
                  className="h-8 text-xs font-bold gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showAddForm ? "Đóng form" : "Thêm khung giờ"}
                </Button>
              </div>

              {/* Form Add New Slot */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateSlot}
                  className="rounded-lg border bg-muted/30 p-4 space-y-3"
                >
                  <p className="text-xs font-bold text-foreground">
                    Tạo khung giờ mới cho sân này:
                  </p>

                  {formError && (
                    <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Bắt đầu
                      </label>
                      <Input
                        type="time"
                        value={starttime}
                        onChange={(e) => {
                          setStarttime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Kết thúc
                      </label>
                      <Input
                        type="time"
                        value={endtime}
                        onChange={(e) => {
                          setEndtime(e.target.value);
                          setFormError(null);
                        }}
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
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
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createSlotMutation.isPending}
                    className="w-full h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    {createSlotMutation.isPending
                      ? "Đang lưu..."
                      : "Lưu khung giờ này →"}
                  </Button>
                </form>
              )}

              {/* List of slots */}
              {!field.fieldSlots || field.fieldSlots.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                  Sân này chưa có khung giờ nào. Vui lòng bấm "Thêm khung giờ"
                  để tạo.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {field?.fieldSlots
                    ?.filter((slot) => slot.status === "AVAILABLE")
                    .map((slot: FieldSlot) =>
                      slot.status === "AVAILABLE" ? (
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
                            onClick={() => handleDeleteSlot(slot.slotId)}
                            disabled={deleteSlotMutation.isPending}
                            className="h-7 w-7 text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                            title="Xóa khung giờ"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          key={slot.slotId}
                          className="flex items-center justify-between rounded-lg border p-2.5 bg-card text-xs shadow-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground block">
                              {formatTimeRange(slot.starttime, slot.endtime)}
                            </span>
                            <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-0.5">
                              <DollarSign className="h-3 w-3" />
                              {Number(slot.price).toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
