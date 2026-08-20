import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (!token || isCalledRef.current) return;

    isCalledRef.current = true;

    let timer = 0;

    axios
      .get(`http://localhost:5001/api/auth/verify?token=${token}`)
      .then(() => {
        setStatus("success");

        timer = setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 3000);
      })
      .catch((error) => {
        console.error("Lỗi xác thực:", error);
        setStatus("error");
      });

    // 💡 3. Cleanup function: Xóa timer nếu user rời trang trước 3s
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token, navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* UI TRẠNG THÁI 1: ĐANG XÁC THỰC */}
      {status === "loading" && (
        <div className="text-center">
          <p className="text-lg font-semibold animate-pulse">
            ⏳ Đang xác thực tài khoản của bạn...
          </p>
        </div>
      )}

      {/* UI TRẠNG THÁI 2: XÁC THỰC THÀNH CÔNG */}
      {status === "success" && (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Kích hoạt tài khoản thành công!
          </h2>
          <p className="text-gray-600 mb-4">
            Hệ thống sẽ tự động chuyển sang trang Đăng nhập sau 3 giây...
          </p>

          {/* 💡 DÙNG NAVIGATE KHI BẤM NÚT */}
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}

      {/* UI TRẠNG THÁI 3: THẤT BẠI / HẾT HẠN */}
      {status === "error" && (
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            ❌ Kích hoạt thất bại
          </h2>
          <p className="text-gray-600 mb-4">
            Mã xác thực không hợp lệ hoặc đã hết hạn (quá 15 phút).
          </p>

          <button
            onClick={() => navigate("/resend-email")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Gửi lại email kích hoạt
          </button>
        </div>
      )}
    </div>
  );
}
