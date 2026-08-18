import { useParams } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";

import { useField } from "@/stores/useFieldStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { FieldSlot } from "@/types/field";

export default function FieldDetail() {
  const { fieldId } = useParams<{ fieldId: string }>();

  const {
    data: fieldDetail,
    isLoading,
    error,
  } = useField(Number(fieldId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 text-text-primary">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-text-secondary">
            Đang tải chi tiết sân...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 text-text-primary">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-status-danger/30 bg-status-danger/10 p-6">
            <p className="font-medium text-status-danger">
              Không thể tải thông tin sân.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!fieldDetail) {
    return (
      <div className="min-h-screen bg-background p-6 text-text-primary">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-text-secondary">
            Không tìm thấy sân.
          </p>
        </div>
      </div>
    );
  }

  const bookSlot = async (slotId: number) => {
    try {
      const token = useAuthStore.getState().accessToken;

      const response = await fetch(
        "http://localhost:5001/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slotId,
            bookingDate: dayjs().format("YYYY-MM-DD"),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Đặt sân thành công.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Đặt sân thất bại.";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Thông tin sân */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            {fieldDetail.name}
          </h1>

          <div className="mt-5 space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-text-secondary">
                Loại sân:
              </span>

              <span className="text-sm font-medium text-text-primary">
                {fieldDetail.fieldType}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-text-secondary">
                Ngày tạo:
              </span>

              <span className="text-sm text-text-primary">
                {dayjs(fieldDetail.createdAt).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-secondary">
                Mô tả:
              </span>

              <p className="text-sm leading-relaxed text-text-primary">
                {fieldDetail.description || "Không có mô tả"}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách khung giờ */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-text-primary">
            Danh sách khung giờ
          </h2>

          {fieldDetail.fieldSlots.length === 0 ? (
            <div className="rounded-lg border border-border-subtle bg-surface-hover/30 p-6 text-center">
              <p className="text-sm text-text-secondary">
                Chưa có khung giờ.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fieldDetail.fieldSlots.map(
                (slot: FieldSlot) => {
                  const isAvailable = slot.status === "AVAILABLE";

                  return (
                    <div
                      key={slot.slotId}
                      className="flex flex-col gap-4 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-surface-hover/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1.5">
                        <p className="font-semibold text-text-primary">
                          {dayjs(slot.starttime).format("HH:mm")}{" "}
                          -{" "}
                          {dayjs(slot.endtime).format("HH:mm")}
                        </p>

                        <p className="text-sm font-medium text-brand-primary">
                          {Number(slot.price).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </p>

                        <p className="text-sm text-text-secondary">
                          Trạng thái:{" "}
                          <span
                            className={
                              isAvailable
                                ? "font-semibold text-status-success"
                                : "font-semibold text-text-muted"
                            }
                          >
                            {slot.status}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => bookSlot(slot.slotId)}
                        disabled={!isAvailable}
                        className="
                          rounded-lg
                          bg-brand-primary
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition-colors
                          hover:bg-brand-primary-hover
                          disabled:cursor-not-allowed
                          disabled:bg-surface-hover
                          disabled:text-text-muted
                        "
                      >
                        {isAvailable ? "Đặt ngay" : "Không khả dụng"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}