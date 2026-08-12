import { payOS } from "../config/payOs.js";


// 1. API Tạo Link Thanh Toán / QR Code
export const createPaymentLink = async (req, res) => {
  try {
    const { bookingId, amount, description } = req.body;

    // orderCode của PayOS bắt buộc là SỐ NGUYÊN DUY NHẤT (dưới 9007199254740991)
    const orderCode = Number(bookingId);

    const paymentBody = {
      orderCode: orderCode,
      amount: Number(amount),
      description: description || `COC DON ${orderCode}`, // Tối đa 25 ký tự không dấu
      cancelUrl: `${process.env.CLIENT_URL}/booking?status=cancelled`,
      returnUrl: `${process.env.CLIENT_URL}/booking?status=success`,
    };

    const paymentLinkRes = await payOS.createPaymentLink(paymentBody);

    /* Dữ liệu trả về bao gồm:
      - checkoutUrl: Link thanh toán PayOS
      - qrCode: Chuỗi VietQR EMVCo
      - accountNumber, accountName, amount, description...
    */
    return res.status(200).json({
      success: true,
      data: paymentLinkRes,
    });
  } catch (error) {
    console.error("Lỗi tạo payment link:", error);
    return res.status(500).json({ message: "Không thể tạo mã VietQR." });
  }
};

// 2. Webhook Tiếp nhận phản hồi từ PayOS khi ngân hàng nhận tiền
export const handleWebhook = async (req, res) => {
  try {
    // Verified chữ ký từ PayOS gửi sang để tránh giả mạo
    const webhookData = payOS.verifyPaymentWebhookData(req.body);

    const orderCode = webhookData.orderCode; // Chính là bookingId
    const amountPaid = webhookData.amount;

    console.log(`✅ Webhook nhận tiền thành công! Đơn #${orderCode} - Số tiền: ${amountPaid}`);

    // TODO: Cập nhật trạng thái Booking trong Database
    // await prisma.booking.update({ where: { bookingId: orderCode }, data: { status: 'CONFIRMED' } });

    // Bắn thông báo Realtime qua Socket.IO tới Client
    const io = req.app.get("io");
    io.to(`booking:${orderCode}`).emit("payment:success", {
      bookingId: orderCode,
      amountPaid,
      paidAt: new Date(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lỗi Webhook Signature:", error.message);
    return res.status(400).json({ message: "Webhook Signature Invalid" });
  }
};