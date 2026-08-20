# admin-stats

Cấu trúc **phẳng** — mọi file nằm cùng cấp với `ManageStats.tsx`:

```
admin-stats/
├── ManageStats.tsx            # Component chính, ghép tất cả lại
├── StatCard.tsx                # Thẻ KPI đơn (tái sử dụng cho hàng tổng quan)
├── BookingStatusBreakdown.tsx  # Phân bổ số lượng theo BookingStatus
├── MatchStatusBreakdown.tsx    # Phân bổ số lượng theo MatchStatus
├── RevenueSummaryCard.tsx      # Tổng hợp doanh thu từ model Invoice
├── types.ts                    # Toàn bộ type, bám theo enum trong schema.prisma
└── mockAdminStats.ts           # Mock data, có ghi chú COUNT/SUM tương ứng model nào
```

## Dùng ở đâu

```tsx
import { ManageStats } from "@/components/admin-stats/ManageStats";

// dùng mock có sẵn
<ManageStats />

// hoặc truyền dữ liệu thật từ API
<ManageStats data={adminStatsFromApi} />
```

## Số liệu lấy từ model nào trong schema.prisma

| Khối UI | Nguồn dữ liệu | Gợi ý truy vấn |
|---|---|---|
| Tổng người dùng | `User` | `COUNT(*) FROM users` |
| Tổng đặt sân | `Booking` | `COUNT(*) FROM bookings` |
| Tổng số sân | `Field` | `COUNT(*) FROM field` |
| Kèo đấu đang mở | `Match` (status = OPEN) | `COUNT(*) FROM match WHERE status='OPEN'` |
| Tổng đánh giá / TB | `Review` | `COUNT(*)`, `AVG(rating) FROM reviews` |
| Thông báo chưa đọc | `Notification` (isRead=false) | `COUNT(*) FROM notifications WHERE is_read=false` |
| Trạng thái đặt sân | `Booking.status` | `GROUP BY status FROM bookings` (enum `BookingStatus`) |
| Trạng thái kèo đấu | `Match.status` | `GROUP BY status FROM match` (enum `MatchStatus`) |
| Tổng hợp doanh thu | `Invoice` | `SUM(total_amount)`, `SUM(remain_amount)`, `SUM(deposit)`, lọc `status='PAID'` cho phần đã thanh toán |

`types.ts` định nghĩa sẵn `BookingStatus`, `MatchStatus` là union type khớp enum
Prisma (`HOLD | CONFIRMED | CANCELLED | COMPLETED`, `OPEN | MATCHED | FINISHED | CANCELLED`)
để khi map dữ liệu từ backend không bị lệch giá trị.

## shadcn/ui components cần add

```bash
npx shadcn@latest add card badge separator
```

## Lưu ý

- Vẫn giữ phong cách **sườn**: chỉ `border`, không set màu. Thanh tỉ lệ trong
  `BookingStatusBreakdown` / `MatchStatusBreakdown` dùng `border` để biểu diễn %
  thay vì tô nền màu — khi cần trực quan hơn, có thể thêm màu theo từng status sau.
- `ManageStats` nhận `data` optional, mặc định dùng `mockAdminStats` để xem trước
  UI ngay khi chưa có API — khi nối API thật chỉ cần bỏ prop mặc định và truyền
  dữ liệu tổng hợp (COUNT/SUM) từ backend vào đúng shape `AdminStatsData`.
