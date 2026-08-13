import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { CheckCircle2, Copy, Clock, AlertCircle, X } from "lucide-react";

// 1. Định nghĩa Interfaces cho Data & Props
import type { PaymentData, PaymentSuccessPayload, PaymentModalProps } from "@/types/booking";

export default function PaymentModal({
  paymentData,
  bookingId,
  onClose,
  // onSuccess,
  socket,
}: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 phút = 300 giây
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);

  // 1. Quản lý Đếm ngược 5 phút
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Lắng nghe Socket Event "payment:success" từ Backend
  // useEffect(() => {
  //   if (!bookingId) return;

  //   // Lắng nghe Room của Booking này
  //   socket.emit("join:booking_room", bookingId);

  //   const handlePaymentSuccess = (data: PaymentSuccessPayload) => {
  //     setIsPaidSuccess(true);
  //     setTimeout(() => {
  //       if (onSuccess) onSuccess(data);
  //     }, 2000);
  //   };

  //   socket.on("payment:success", handlePaymentSuccess);

  //   return () => {
  //     socket.off("payment:success", handlePaymentSuccess);
  //   };
  // }, [bookingId, onSuccess]);

  // Helper copy text
  const handleCopy = (text: string, fieldName: string): void => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format giây -> MM:SS
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!paymentData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {isPaidSuccess ? (
          /* UI THÀNH CÔNG */
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in">
            <CheckCircle2 className="h-20 w-20 text-green-500 animate-bounce" />
            <h3 className="mt-4 text-2xl font-bold text-gray-800">Thanh toán thành công!</h3>
            <p className="mt-2 text-sm text-gray-600">
              Hệ thống đã xác nhận tiền cọc cho đơn hàng #{bookingId}.
            </p>
          </div>
        ) : (
          /* UI QUÉT MÃ VIETQR */
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-900">Thanh toán cọc qua VietQR</h3>

            {/* Countdown Box */}
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Mã QR hết hạn sau: <strong className="font-mono text-sm">{formatTime(timeLeft)}</strong>
              </span>
            </div>

            {/* Frame QR Code VietQR */}
            <div className="relative my-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-3">
              {timeLeft > 0 ? (
                <img
                  src={`https://img.vietqr.io/image/${paymentData.bin}-${paymentData.accountNumber}-compact2.png?amount=${paymentData.amount}&addInfo=${encodeURIComponent(paymentData.description)}&accountName=${encodeURIComponent(paymentData.accountName)}`}
                  alt="VietQR Payment"
                  className="h-64 w-64 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                  <span className="text-sm font-medium">Mã QR đã hết hạn</span>
                </div>
              )}
            </div>

            {/* Thông tin chuyển khoản chi tiết */}
            <div className="w-full space-y-2.5 rounded-xl bg-gray-50 p-4 text-sm">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-bold text-gray-800">{paymentData.accountName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Số tài khoản:</span>
                <button
                  onClick={() => handleCopy(paymentData.accountNumber, "account")}
                  className="flex items-center gap-1 font-mono font-bold text-blue-600 hover:underline"
                >
                  {paymentData.accountNumber}
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "account" && <span className="text-[10px] text-green-600">Đã chép</span>}
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Số tiền cọc:</span>
                <span className="font-bold text-red-600">
                  {Number(paymentData.amount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nội dung chuyển:</span>
                <button
                  onClick={() => handleCopy(paymentData.description, "desc")}
                  className="flex items-center gap-1 font-mono font-bold text-blue-600 hover:underline"
                >
                  {paymentData.description}
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "desc" && <span className="text-[10px] text-green-600">Đã chép</span>}
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Vui lòng giữ nguyên <strong>Nội dung chuyển khoản</strong> để hệ thống xác thực tự động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}