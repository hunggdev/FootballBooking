// src/components/home/FooterSection.tsx
const columns = [
  {
    id: "links",
    title: "LIÊN KẾT NHANH",
    items: ["Trang chủ", "Đặt sân", "Kèo đấu", "Tin tức", "Liên hệ"],
  },
  {
    id: "support",
    title: "HỖ TRỢ",
    items: ["Hướng dẫn đặt sân", "Quy định sử dụng", "Chính sách bảo mật", "Điều khoản dịch vụ", "Câu hỏi thường gặp"],
  },
  {
    id: "contact",
    title: "LIÊN HỆ",
    items: ["090 123 4567", "Nguyễn Trãi, Thành phố Huế", "contact@sanbongs.vn", "07:00 - 22:00 (Tất cả các ngày)"],
  },
];

export function FooterSection() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="border p-4">
            <p className="mb-2 text-sm font-semibold">Logo / Tên thương hiệu</p>
            <p className="text-xs opacity-60">
              Mô tả ngắn về hệ thống và giá trị mang lại cho khách hàng.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.id} className="border p-4">
              <p className="mb-2 text-xs font-semibold opacity-70">{col.title}</p>
              <ul className="flex flex-col gap-1.5 text-xs opacity-80">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="border p-4">
            <p className="mb-2 text-xs font-semibold opacity-70">TẢI APP</p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="border p-2 text-center">App Store</div>
              <div className="border p-2 text-center">Google Play</div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-xs opacity-60">
          © 2026 Tên thương hiệu. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
