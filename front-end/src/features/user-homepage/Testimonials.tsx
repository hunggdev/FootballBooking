// src/components/home/Testimonials.tsx
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./TestimonialCard";
import type { TestimonialItem } from "@/types/home.ts";

const testimonials: TestimonialItem[] = [
  {
    id: "1",  
    name: "Trần Văn Bình",
    date: "10/07/2026",
    rating: 4,
    comment: "Sân chất lượng tốt, cỏ mượt, có đèn chiếu sáng đầy đủ. Giá cả hợp lý. Sẽ quay lại!",
  },
  {
    id: "2",
    name: "Lê Thị Mai",
    date: "08/07/2026",
    rating: 5,
    comment: "Sân rộng, vệ sinh sạch sẽ. Nhân viên nhiệt tình hỗ trợ. Chi tiết bãi gửi xe hợp lý.",
  },
  {
    id: "3",
    name: "Nguyễn Hoàng Nam",
    date: "05/07/2026",
    rating: 5,
    comment: "Đặt sân nhanh chóng, thanh toán tiện lợi. Ứng dụng dễ sử dụng!",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Khách hàng nói gì về chúng tôi</h2>
        <Button variant="link" className="text-sm">
          Xem tất cả đánh giá →
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    </section>
  );
}
