import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  ArrowRight,
} from "lucide-react";

import { useStatusRange } from "@/stores/useBookingStore";
import type { StatusRange } from "@/types/booking";
import type { HoldSlot } from "@/types/field";
import { formatTimeRange } from "@/lib/utils";
import { formatCountdown } from "@/lib/booking-format";


interface Props {
  fieldId: number;
  slots: HoldSlot[] | undefined,
  onSelectSlot: (slot: HoldSlot) => void;

}

export function BookLongTime({ fieldId, slots, onSelectSlot }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<HoldSlot>(slots[0]);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const [now, setNow] = useState(Date.now());
  const {
    data: statusRange,
    refetch: checkAvailability,
  } = useStatusRange(fieldId, selectedSlot?.slotId, startDate, endDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayStatusRange = statusRange?.map((s) => ({
    ...s,
    ttl: Math.max(
      0,
      Math.floor(
        (new Date(s.expiresAt).getTime() - now) / 1000
      )
    ),
  }));



  // State chứa kết quả kiểm tra lịch trống từ A đến B

  // Giả lập hàm kiểm tra lịch trống trong dải ngày A -> B
  const handleCheckAvailability = async () => {
    try {
      const result = await checkAvailability();
      console.log("result: ", result);

    } catch (error) { }
    if (!startDate || !endDate) return;
  };

  // Lọc ra các ngày TRỐNG để người dùng có thể chọn đặt
  const availableDates = useMemo(() => {
    if (!statusRange) return [];
    return statusRange
      .filter((item) => item.status === "AVAILABLE")
      .map((i) => i.bookingDate);
  }, [statusRange]);

  const handleOnclick = () => {
    for (let i = 0; i < displayStatusRange.length; i++) {
      if (displayStatusRange[i].status === "AVAILABLE") {
        onSelectSlot(displayStatusRange[i]);
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface rounded-2xl border border-border shadow-xl p-6 space-y-6 my-2">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          Kiểm tra lịch trống theo khung giờ & dải ngày
        </h2>

        <p className="text-xs text-text-secondary mt-1">
          Chọn khung giờ và khoảng thời gian (Từ A đến B) để hệ thống quét các
          ngày còn trống.
        </p>
      </div>

      {/* BỘ LỌC ĐẦU VÀO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto bg-surface rounded-2xl border border-border p-6">
        {/* Chọn Khung giờ */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
            Khung giờ
          </label>

          <select
            value={selectedSlot?.slotId}
            onChange={(e) => {
              const found = slots?.find(
                (s) => String(s.slotId) === e.target.value
              );
              if (found) setSelectedSlot(found);
            }}
            className="
            w-full
            rounded-xl
            border
            border-border
            bg-surface
            px-3
            py-2.5
            text-sm
            font-medium
            text-text-primary
            outline-none
            transition-all
            focus:border-brand-primary
            focus:ring-2
            focus:ring-brand-primary/20
          "
          >
            {slots?.map((slot) => (
              <option
                key={slot.slotId}
                value={slot.slotId}
                className="bg-elevated text-text-primary"
              >
                {formatTimeRange(slot.starttime, slot.endtime)}
              </option>
            ))}
          </select>
        </div>

        {/* Ngày A */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
            Từ ngày (A)
          </label>

          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            className="
            w-full
            rounded-xl
            border
            border-border
            bg-surface
            px-3
            py-2.5
            text-sm
            font-medium
            text-text-primary
            outline-none
            transition-all
            focus:border-brand-primary
            focus:ring-2
            focus:ring-brand-primary/20
          "
          />
        </div>

        {/* Ngày B */}
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
            Đến ngày (B)
          </label>

          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className="
            w-full
            rounded-xl
            border
            border-border
            bg-surface
            px-3
            py-2.5
            text-sm
            font-medium
            text-text-primary
            outline-none
            transition-all
            focus:border-brand-primary
            focus:ring-2
            focus:ring-brand-primary/20
          "
          />
        </div>
      </div>

      {/* NÚT KIỂM TRA */}
      <button
        type="button"
        onClick={handleCheckAvailability}
        className="
        w-full
        rounded-xl
        bg-brand-primary
        py-3
        text-xs
        font-bold
        text-white
        shadow-md
        shadow-brand-primary/20
        transition-all
        hover:bg-brand-primary-hover
        hover:shadow-lg
        disabled:bg-surface-hover
        disabled:text-text-muted
        cursor-pointer
        flex
        items-center
        justify-center
        gap-2
      "
      >
        <Search className="w-4 h-4" />

        {isChecking
          ? "Đang quét trạng thái lịch..."
          : "Kiểm tra tình trạng trống"}
      </button>

      {/* KẾT QUẢ */}
      {statusRange && (
        <div className="space-y-4 pt-2 border-t border-border animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Kết quả kiểm tra ({statusRange.length} ngày)
            </span>

            {/* LEGEND */}
            <div className="flex items-center gap-3 text-[11px] text-text-secondary">
              {/* Trống - Xanh */}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                Trống
              </span>

              {/* Đang giữ - Vàng */}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                Đang giữ chỗ
              </span>

              {/* Đã đặt - Đỏ */}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-status-danger" />
                Đã đặt
              </span>

              {/* Đóng - Xám */}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted" />
                Đóng
              </span>

              <button
                className="
                flex
                items-center
                gap-1
                font-semibold
                text-brand-primary
                hover:text-brand-primary-hover
                disabled:text-text-muted
                cursor-pointer
                transition-colors
              "
                onClick={() => {
                  handleOnclick();
                }}
              >
                Chọn nhanh
              </button>
            </div>
          </div>

          {/* DANH SÁCH CÁC NGÀY */}
          <div className="max-h-64 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-text-muted">
            {displayStatusRange.map((item) => {
              const dateObj = new Date(item.bookingDate);

              const formattedDate = dateObj.toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <div
                  key={item.bookingDate}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${item.status === "AVAILABLE"
                    ? "bg-status-success-bg border-status-success/30 text-status-success"
                    : item.status === "HOLD"
                      ? "bg-status-warning-bg border-status-warning/30 text-status-warning"
                      : item.status === "BOOKED"
                        ? "bg-status-danger-bg border-status-danger/30 text-status-danger"
                        : "bg-surface-hover border-border text-text-muted"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* TRỐNG - XANH */}
                    {item.status === "AVAILABLE" && (
                      <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                    )}

                    {/* ĐANG GIỮ - VÀNG */}
                    {item.status === "HOLD" && (
                      <AlertCircle className="w-4 h-4 text-status-warning flex-shrink-0" />
                    )}

                    {/* ĐÃ ĐẶT - ĐỎ */}
                    {item.status === "BOOKED" && (
                      <XCircle className="w-4 h-4 text-status-danger flex-shrink-0" />
                    )}

                    {/* ĐÓNG - XÁM */}
                    {item.status === "CLOSED" && (
                      <XCircle className="w-4 h-4 text-text-muted flex-shrink-0" />
                    )}

                    <span className="font-bold">
                      {formattedDate}
                    </span>

                    <span className="text-text-muted">|</span>

                    <span className="font-mono text-text-secondary">
                      {formatTimeRange(
                        selectedSlot.starttime,
                        selectedSlot.endtime
                      )}
                    </span>
                  </div>

                  <div>
                    {/* TRỐNG */}
                    {item.status === "AVAILABLE" && (
                      <span className="font-semibold text-status-success bg-status-success-bg px-2 py-0.5 rounded-full">
                        Còn trống
                      </span>
                    )}

                    {/* ĐANG GIỮ */}
                    {item.status === "HOLD" && (
                      <span className="font-semibold text-status-warning bg-status-warning-bg px-2 py-0.5 rounded-full">
                        Đang giữ ({item.ttl})
                      </span>
                    )}

                    {/* ĐÃ ĐẶT */}
                    {item.status === "BOOKED" && (
                      <span className="font-semibold text-status-danger bg-status-danger-bg px-2 py-0.5 rounded-full">
                        Đã đặt
                      </span>
                    )}

                    {/* ĐÓNG */}
                    {item.status === "CLOSED" && (
                      <span className="font-semibold text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">
                        Đóng
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}