# Module "Kèo đấu" – Cấu trúc thư mục FE

```
src/
├── pages/
│   └── KeoDauPage.tsx            # Page tổng hợp, ghép các component con
│
├── components/
│   └── keo-dau/
│       ├── PageIntro.tsx         # Tiêu đề trang + 3 thẻ tính năng nổi bật
│       ├── MatchToolbar.tsx      # Tabs trạng thái + ô tìm kiếm + sort
│       ├── MatchCard.tsx         # 1 thẻ kèo đấu (2 đội, giờ, giá, số người...)
│       ├── MatchList.tsx         # Danh sách MatchCard + empty state
│       ├── MatchPagination.tsx   # Phân trang
│       └── sidebar/
│           ├── Sidebar.tsx               # Ghép các block sidebar
│           ├── FilterPanel.tsx           # Bộ lọc tìm kiếm
│           ├── FeaturedTournaments.tsx   # Giải đấu nổi bật
│           ├── CreateMatchCTA.tsx        # CTA "Tạo kèo ngay"
│           └── GuideList.tsx             # Hướng dẫn
│
├── types/
│   └── match.ts                  # Match, Tournament, GuideItem, MatchTabValue
│
├── data/
│   └── mock-matches.ts           # Mock data (thay bằng API thực tế sau)
│
└── lib/
    └── (giữ chỗ cho utils riêng của module nếu cần)
```

## Nguyên tắc phân chia

- **pages/**: chỉ chứa 1 file page, nhiệm vụ duy nhất là quản lý state (tab, filter, page)
  và bố cục lưới `grid-cols-[1fr_320px]` (nội dung chính + sidebar).
- **components/keo-dau/**: các block thuộc riêng trang Kèo đấu, không dùng chung nơi khác.
  Nếu sau này có trang khác cũng cần MatchCard, chuyển ra `components/shared/`.
- **components/keo-dau/sidebar/**: tách riêng nhóm sidebar vì nó là 1 cụm độc lập, dễ
  tái sử dụng hoặc ẩn/hiện theo responsive.
- **types/**: định nghĩa dữ liệu dùng chung giữa các component, tránh lặp interface.
- **data/**: mock data tách khỏi UI để dễ thay thế bằng API call (react-query, SWR...) sau này.

## shadcn/ui components cần add

```bash
npx shadcn@latest add card tabs input select button badge avatar separator slider label pagination
```

## Lưu ý

- Đây là bản **sườn (skeleton)**: các khối chỉ dùng `border`, không set màu, không có
  hình ảnh thật (thay bằng `div` border rỗng ở vị trí ảnh/avatar).
- Đã bỏ qua Top bar (thông báo live), Header (logo, menu, user) và Footer theo yêu cầu –
  các phần này nên nằm trong `components/layout/` dùng chung cho toàn app, không thuộc
  page Kèo đấu.
- `KeoDauPage.tsx` hiện lọc dữ liệu mock theo `searchValue`; cần bổ sung logic lọc theo
  `activeTab`, `sortValue`, và các field trong `FilterPanel` khi nối API thật.
