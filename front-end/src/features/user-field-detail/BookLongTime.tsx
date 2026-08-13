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
  slots: HoldSlot[]|undefined,
  onSelectSlot: (slot: HoldSlot) => void;

}

export function BookLongTime({fieldId, slots, onSelectSlot} : Props) {
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

    } catch (error) {}
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
    for(let i = 0; i < displayStatusRange.length; i++){
      if(displayStatusRange[i].status === "AVAILABLE"){
        onSelectSlot(displayStatusRange[i]); 
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl p-6 space-y-6 my-2">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Kiểm tra lịch trống theo khung giờ & dải ngày
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Chọn khung giờ và khoảng thời gian (Từ A đến B) để hệ thống quét các
          ngày còn trống.
        </p>
      </div>

      {/* BỘ LỌC ĐẦU VÀO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl p-6 space-y-6">
        {/* Chọn Khung giờ */}
        <div>
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
            Khung giờ
          </label>
          <select
            value={selectedSlot?.slotId}
            onChange={(e) => {
              const found = slots?.find((s) => String(s.slotId) === e.target.value);
              if (found) setSelectedSlot(found);
            }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 font-medium focus:border-blue-500 focus:outline-none bg-white"
          >
            {slots?.map((slot) => (
              <option key={slot.slotId} value={slot.slotId}>
                {formatTimeRange(slot.starttime, slot.endtime)}
              </option>
            ))}
          </select>
        </div>

        {/* Ngày A */}
        <div>
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
            Từ ngày (A)
          </label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Ngày B */}
        <div>
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
            Đến ngày (B)
          </label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* NÚT KIỂM TRA */}
      <button
        type="button"
        // disabled={!startDate || !endDate || isChecking}
        onClick={handleCheckAvailability}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 cursor-pointer"
      >
        <Search className="w-4 h-4" />
        {isChecking
          ? "Đang quét trạng thái lịch..."
          : "Kiểm tra tình trạng trống"}
      </button>

      {/* KẾT QUẢ HIỂN THỊ TRẠNG THÁI TỪNG NGÀY TRONG KHOẢNG A -> B */}
      {statusRange && (
        <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Kết quả kiểm tra ({statusRange.length} ngày)
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>{" "}
                Trống
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
                Đang giữ chỗ
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Đã
                kín
              </span>
              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 cursor-pointer"
                onClick={() => {
                  handleOnclick()
                }}
              >
                Chọn nhanh
              </button>
            </div>
          </div>

          {/* Danh sách các ngày dạng Grid / Thanh cuộn */}
          <div className="max-h-64 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
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
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    item.status === "AVAILABLE"
                      ? "bg-green-50/50 border-green-200 text-green-900"
                      : item.status === "HOLD"
                        ? "bg-amber-50/50 border-amber-200 text-amber-900"
                        : "bg-red-50/50 border-red-200 text-red-900 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.status === "AVAILABLE" && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                    {item.status === "HOLD" && (
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                    {item.status === "BOOKED" && (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}

                    <span className="font-bold">{formattedDate}</span>
                    <span className="text-gray-400">|</span>
                    <span className="font-mono text-gray-600">
                      {formatTimeRange(selectedSlot.starttime, selectedSlot.endtime)}
                    </span>
                  </div>

                  <div>
                    {item.status === "AVAILABLE" && (
                      <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        Còn trống
                      </span>
                    )}
                    {item.status === "HOLD" && (
                      <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Đang giữ ({item.ttl})
                      </span>
                    )}
                    {item.status === "BOOKED" && (
                      <span className="font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        Đã có lịch đặt
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* THANH TỔNG KẾT & TIẾP TỤC */}
          {/* <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-500 block">Số ngày trống hợp lệ:</span>
              <span className="text-lg font-bold text-green-600">
                {availableDates.length} / {availabilityResults.length} ngày
              </span>
            </div>

            <button
              type="button"
              disabled={availableDates.length === 0}
              onClick={() => onProceedBooking && onProceedBooking(availableDates, selectedSlot)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              Tiếp tục đặt các ngày trống <ArrowRight className="w-4 h-4" />
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}
