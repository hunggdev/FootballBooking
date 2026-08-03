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
      <div className="p-6">
        Đang tải chi tiết sân...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Không thể tải thông tin sân.
      </div>
    );
  }

  if (!fieldDetail) {
    return (
      <div className="p-6">
        Không tìm thấy sân.
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
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="rounded-lg border p-6">
        <h1 className="text-3xl font-bold">
          {fieldDetail.name}
        </h1>

        <div className="mt-4 space-y-2">
          <p>
            <strong>Loại sân:</strong>{" "}
            {fieldDetail.fieldType}
          </p>

          <p>
            <strong>Ngày tạo:</strong>{" "}
            {dayjs(fieldDetail.createdAt).format(
              "DD/MM/YYYY HH:mm"
            )}
          </p>

          <p>
            <strong>Mô tả:</strong>{" "}
            {fieldDetail.description || "Không có mô tả"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Danh sách khung giờ
        </h2>

        {fieldDetail.fieldSlots.length === 0 ? (
          <p>Chưa có khung giờ.</p>
        ) : (
          <div className="space-y-3">
            {fieldDetail.fieldSlots.map(
              (slot: FieldSlot) => (
                <div
                  key={slot.slotId}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {dayjs(slot.starttime).format(
                        "HH:mm"
                      )}{" "}
                      -{" "}
                      {dayjs(slot.endtime).format(
                        "HH:mm"
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      {Number(slot.price).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </p>

                    <p className="text-sm">
                      Trạng thái: {slot.status}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      bookSlot(slot.slotId)
                    }
                    disabled={
                      slot.status !== "AVAILABLE"
                    }
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Đặt ngay
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}