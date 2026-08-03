# Module `admin`

Dashboard quản trị cho Admin, tách biệt với `auth`, `home`, `account`.

## Cấu trúc thư mục

```
src/
├── components/
│   ├── auth/
│   ├── home/
│   ├── account/
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx      # khung tổng: Sidebar + AdminTopHeader + content + footer
│   │   │   ├── Sidebar.tsx          # menu điều hướng, chia nhóm theo chức năng
│   │   │   ├── AdminTopHeader.tsx   # logo + live ticker + tìm kiếm + thông báo + hồ sơ admin
│   │   │   └── PageHeader.tsx       # tiêu đề + phụ đề + action button, dùng chung mọi trang
│   │   │
│   │   ├── dashboard/                # Tổng quan hệ thống
│   │   │   ├── DashboardOverview.tsx # compose toàn bộ trang tổng quan
│   │   │   ├── StatsGrid.tsx         # lưới 6 stat card
│   │   │   ├── StatCard.tsx
│   │   │   ├── RevenueChartCard.tsx     # biểu đồ cột doanh thu 7 ngày (khung sườn)
│   │   │   ├── BookingTimeDonutCard.tsx # biểu đồ tròn tỷ lệ đặt sân theo khung giờ
│   │   │   ├── RecentActivityFeed.tsx   # hoạt động gần đây
│   │   │   ├── RecentBookingsTable.tsx  # bảng đặt sân mới nhất
│   │   │   ├── FeaturedOddsList.tsx     # kèo đấu nổi bật
│   │   │   └── SystemAlertsList.tsx     # cảnh báo hệ thống
│   │   │
│   │   ├── customers/                # Khách hàng
│   │   │   ├── CustomersPage.tsx        # compose stats + filter + bảng
│   │   │   ├── CustomerStatsCards.tsx   # 4 stat card (tổng, mới, hoạt động, đã khóa)
│   │   │   ├── CustomerFilterBar.tsx    # tìm kiếm + lọc trạng thái + thêm khách hàng
│   │   │   ├── CustomersTable.tsx       # bảng danh sách khách hàng
│   │   │   └── CustomerDetailDialog.tsx # dialog chi tiết + lịch sử đặt sân + khóa/mở khóa
│   │   │
│   │   ├── accounts/                 # Tài khoản (trạng thái đăng nhập/bảo mật)
│   │   │   ├── AccountsPage.tsx
│   │   │   └── AccountsTable.tsx        # đăng nhập gần nhất, khóa/mở khóa, đặt lại mật khẩu
│   │   │
│   │   ├── feedback/                 # Phản hồi & đánh giá
│   │   │   ├── FeedbackPage.tsx
│   │   │   ├── FeedbackStatsCards.tsx   # tổng đánh giá, đánh giá TB, chưa phản hồi
│   │   │   ├── FeedbackList.tsx         # danh sách đánh giá dạng card
│   │   │   └── FeedbackReplyDialog.tsx  # dialog trả lời đánh giá
│   │   │
│   │   ├── fields/                   # Quản lý sân bóng (nhiều khung giờ)
│   │   ├── services/                 # Quản lý dịch vụ
│   │   ├── odds/                     # Quản lý kèo bóng
│   │   ├── revenue/                  # Thống kê doanh thu
│   │   │
│   │   ├── types.ts                  # interface + NavGroup/NavItem (icon từ lucide-react)
│   │   └── index.ts                  # barrel export
│   │
│   └── ui/                           # shadcn components (Table, Card, Badge, Select...)
│
└── pages/
    └── admin/
        ├── Dashboard.tsx    # /admin
        ├── Customers.tsx    # /admin/customers
        ├── Accounts.tsx     # /admin/accounts
        ├── Feedback.tsx     # /admin/feedback
        ├── Fields.tsx       # /admin/fields
        ├── Services.tsx     # /admin/services
        ├── Odds.tsx         # /admin/odds
        └── Revenue.tsx      # /admin/revenue
```

## Sidebar - cấu trúc nhóm menu

`Sidebar.tsx` định nghĩa mảng `navGroups: NavGroup[]`, mỗi nhóm có `title` (tiêu đề nhóm viết hoa) và danh sách `items`. Nhóm đầu tiên (Tổng quan) không có `title` vì đứng riêng lẻ, giống bản gốc.

- Tổng quan
- **Quản lý hệ thống**: Sân bóng, Dịch vụ, Kèo đấu, Yêu cầu kèo, Đặt sân, Lịch sử đặt sân
- **Quản lý khách hàng**: Khách hàng, Tài khoản, Phản hồi & đánh giá
- **Quản lý tài chính**: Thanh toán, Hóa đơn, Hoàn tiền cọc
- **Thống kê & báo cáo**: Thống kê, Báo cáo
- **Cài đặt hệ thống**: Nhân viên, Vai trò & phân quyền, Cài đặt, Nhật ký hoạt động
- Nút "Thu gọn" cố định ở cuối sidebar

Mỗi item dùng icon từ `lucide-react` (không phải màu/hình ảnh - icon outline đơn sắc, kế thừa `currentColor`, phù hợp phong cách sườn). Item thuộc các nhóm con có `hasChevron: true` để hiện mũi tên phải, giống bản thiết kế gốc.

## AdminTopHeader

Gộp 3 phần trong 1 thanh ngang duy nhất (đúng như thiết kế gốc): logo, live ticker (cuộn ngang khi nhiều thông báo), và cụm hành động bên phải (tìm kiếm, chuông thông báo có badge số lượng, menu hồ sơ admin).

## PageHeader

Component dùng chung cho mọi trang quản lý: tiêu đề, phụ đề, và 1 action button tuỳ chọn (vd: "Tùy chỉnh", "Thêm khách hàng", "Thêm sân bóng"...). `AdminLayout` không còn nhận `title` prop - mỗi `*Page.tsx` tự khai báo `PageHeader` riêng, giúp linh hoạt hơn khi 1 trang cần nhiều hơn 1 action hoặc không cần title cố định.

## Trang Tổng quan (Dashboard)

`DashboardOverview.tsx` ghép theo đúng bố cục ảnh:

1. `PageHeader` + nút "Tùy chỉnh"
2. `StatsGrid` - 6 stat card (doanh thu, lượt đặt sân, sân hoạt động, kèo đang mở, khách hàng, đánh giá trung bình)
3. Hàng 3 cột: `RevenueChartCard` (biểu đồ cột, có filter khoảng thời gian) - `BookingTimeDonutCard` (biểu đồ tròn + legend) - `RecentActivityFeed` (danh sách hoạt động)
4. Hàng 2 cột (tỉ lệ 2:1): `RecentBookingsTable` (bảng đặt sân mới nhất, 8 cột) - cột phải xếp dọc `FeaturedOddsList` + `SystemAlertsList`

Biểu đồ (cột và tròn) chỉ dựng khung sườn bằng `border`/chiều cao tỷ lệ - không dùng thư viện chart, không màu, sẵn sàng thay bằng `recharts`/`chart.js` thật khi cần.

## Quy ước

- Mỗi module con vẫn theo mẫu: `*Page.tsx` (compose + PageHeader) + `*Table.tsx` (bảng dữ liệu `shadcn Table`).
- Toàn bộ giữ phong cách sườn: border phân tách khối, không màu nền/hình ảnh; icon dùng `lucide-react` (đơn sắc, không tính là "màu sắc/hình ảnh" trang trí).
- Dữ liệu là mock tĩnh - khi nối API chỉ cần thay mảng mẫu trong từng component bằng dữ liệu fetch được.

## Component shadcn cần thêm cho nhóm "Quản lý khách hàng"

Nhóm này bắt đầu dùng `Dialog` (chi tiết khách hàng, trả lời đánh giá) và `Textarea`
(nội dung phản hồi) - nếu project chưa có, chạy thêm:

```bash
npx shadcn@latest add dialog textarea
```
