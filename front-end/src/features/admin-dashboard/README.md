# Dashboard "Tổng quan hệ thống" – Cấu trúc thư mục FE

```
src/
├── pages/
│   └── DashboardOverviewPage.tsx     # Tiêu đề trang + nút "Tùy chỉnh" + ghép 3 component
│
├── components/dashboard/             # Đúng 3 component chính
│   ├── StatsSummary.tsx              # Hàng 6 thẻ KPI (doanh thu, lượt đặt, sân, kèo, khách, đánh giá)
│   ├── AnalyticsOverview.tsx         # Doanh thu 7 ngày (cột) + Tỷ lệ khung giờ (donut) + Hoạt động gần đây
│   └── BookingsAndHighlights.tsx     # Bảng đặt sân mới nhất + Kèo đấu nổi bật + Cảnh báo hệ thống
│
├── types/
│   └── dashboard.ts                  # StatCard, RevenuePoint, TimeSlotShare, Booking, HighlightMatch, SystemAlert...
│
└── data/
    └── mock-dashboard.ts             # Mock data cho cả 3 component, thay bằng API sau
```

## Vì sao chia đúng 3 component

Bám theo 3 khối bố cục lớn của thiết kế (mỗi khối là 1 hàng ngang trong trang):

1. **StatsSummary** – hàng thẻ số liệu tổng quan trên cùng.
2. **AnalyticsOverview** – hàng giữa gồm 3 cột: biểu đồ doanh thu, biểu đồ tròn tỷ lệ
   khung giờ, danh sách hoạt động gần đây (gộp chung 1 component vì luôn hiển thị
   cùng nhau, cùng 1 khối "phân tích nhanh").
3. **BookingsAndHighlights** – hàng dưới gồm bảng đặt sân (trái) + cột phải (kèo đấu
   nổi bật + cảnh báo hệ thống), cũng gộp vì đi cùng nhau trong 1 hàng.

`DashboardOverviewPage.tsx` chỉ giữ vai trò khung trang + truyền mock data xuống,
không tự vẽ UI phức tạp.

## shadcn/ui components cần add

```bash
npx shadcn@latest add card button badge select table
```

## Lưu ý

- Vẫn là bản **sườn (skeleton)**: chỉ dùng `border`, không set màu, không icon thật
  (thay bằng `div` bo tròn/bo vuông viền rỗng ở vị trí icon/avatar).
- Biểu đồ cột và biểu đồ tròn dựng bằng `div` thuần (chiều cao cột tính theo tỉ lệ
  dữ liệu) để giữ đúng tinh thần "chỉ có sườn" — khi cần biểu đồ thật, có thể thay
  phần render bên trong `AnalyticsOverview.tsx` bằng thư viện chart (`recharts` chẳng
  hạn) mà không đổi props/API của component.
- Bảng dùng component `Table` của shadcn để có sẵn cấu trúc `TableHeader/TableRow/TableCell`
  chuẩn, dễ thêm sort/pagination sau này.
- Đã bỏ Top bar, Header, Footer theo yêu cầu — các phần này nằm ở layout chung
  (`components/layout/`), không thuộc 3 component của trang này.
