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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        {isPaidSuccess ? (
          /* UI THÀNH CÔNG */
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in">
            <CheckCircle2 className="h-20 w-20 text-status-success animate-bounce" />
            <h3 className="mt-4 text-2xl font-bold text-text-primary">Thanh toán thành công!</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Hệ thống đã xác nhận tiền cọc cho đơn hàng #{bookingId}.
            </p>
          </div>
        ) : (
          /* UI QUÉT MÃ VIETQR */
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-text-primary">Thanh toán cọc qua VietQR</h3>

            {/* Countdown Box */}
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-status-warning-bg px-3 py-1 text-xs font-semibold text-status-warning">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Mã QR hết hạn sau: <strong className="font-mono text-sm">{formatTime(timeLeft)}</strong>
              </span>
            </div>

            {/* Frame QR Code VietQR */}
            <div className="relative my-4 rounded-xl border-2 border-dashed border-status-info/30 bg-status-info-bg p-3">
              {timeLeft > 0 ? (
                <img
                  src={`https://img.vietqr.io/image/${paymentData.bin}-${paymentData.accountNumber}-compact2.png?amount=${paymentData.amount}&addInfo=${encodeURIComponent(paymentData.description)}&accountName=${encodeURIComponent(paymentData.accountName)}`}
                  alt="VietQR Payment"
                  className="h-64 w-64 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg bg-elevated text-text-muted">
                  <AlertCircle className="h-10 w-10 text-status-danger mb-2" />
                  <span className="text-sm font-medium">Mã QR đã hết hạn</span>
                </div>
              )}
            </div>

            {/* Thông tin chuyển khoản chi tiết */}
            <div className="w-full space-y-2.5 rounded-xl bg-surface p-4 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-text-muted">Ngân hàng:</span>
                <span className="font-bold text-text-primary">{paymentData.accountName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-text-muted">Số tài khoản:</span>
                <button
                  onClick={() => handleCopy(paymentData.accountNumber, "account")}
                  className="flex items-center gap-1 font-mono font-bold text-status-info hover:underline"
                >
                  {paymentData.accountNumber}
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "account" && <span className="text-[10px] text-status-success">Đã chép</span>}
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-text-muted">Số tiền cọc:</span>
                <span className="font-bold text-status-danger">
                  {Number(paymentData.amount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-muted">Nội dung chuyển:</span>
                <button
                  onClick={() => handleCopy(paymentData.description, "desc")}
                  className="flex items-center gap-1 font-mono font-bold text-status-info hover:underline"
                >
                  {paymentData.description}
                  <Copy className="h-3.5 w-3.5" />
                  {copiedField === "desc" && <span className="text-[10px] text-status-success">Đã chép</span>}
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-text-muted">
              Vui lòng giữ nguyên <strong>Nội dung chuyển khoản</strong> để hệ thống xác thực tự động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}