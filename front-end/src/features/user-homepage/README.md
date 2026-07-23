# Module `home`

Module này chứa toàn bộ component cho trang chủ (landing/homepage) của hệ thống
đặt sân bóng, tách biệt với module `auth` hiện có (`components/auth/signin.tsx`,
`signup.tsx`, `signout.tsx`).

## Cấu trúc thư mục

```
src/
├── components/
│   ├── auth/                  # module hiện có - không đổi
│   │   ├── signin.tsx
│   │   ├── signup.tsx
│   │   └── signout.tsx
│   │
│   ├── home/                   # module mới cho trang chủ
│   │   ├── HomePage.tsx        # compose toàn bộ section thành 1 trang
│   │   ├── TopBar.tsx          # thanh thông báo live phía trên cùng
│   │   ├── Header.tsx          # logo + nav menu + user dropdown
│   │   ├── HeroSection.tsx     # khối hero (headline + form tìm sân)
│   │   ├── HeroSearchForm.tsx  # form filter (chọn sân, ngày, giờ, loại sân)
│   │   ├── QuickFeatures.tsx   # 5 ô tính năng nhanh
│   │   ├── FeaturedFields.tsx  # section "Sân nổi bật"
│   │   ├── FieldCard.tsx       # 1 card sân bóng
│   │   ├── PromotionSection.tsx# section ưu đãi + sự kiện
│   │   ├── PromotionBanner.tsx # banner giảm giá
│   │   ├── UpcomingEvents.tsx  # danh sách sự kiện/giải đấu
│   │   ├── EventListItem.tsx   # 1 dòng sự kiện
│   │   ├── Testimonials.tsx    # section đánh giá khách hàng
│   │   ├── TestimonialCard.tsx # 1 card đánh giá
│   │   ├── StatsBar.tsx        # thanh số liệu (500+, 10K+, ...)
│   │   ├── FooterSection.tsx   # footer
│   │   ├── types.ts            # interface dùng chung trong module
│   │   └── index.ts            # barrel export
│   │
│   └── ui/                     # shadcn components (generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       ├── navigation-menu.tsx
│       └── ...
│
└── pages/
    └── Home.tsx                 # page cấp route, chỉ render <HomePage />
```

## Quy ước đặt tên

- Mỗi block lớn trong UI (TopBar, Header, HeroSection, FeaturedFields,
  PromotionSection, Testimonials, StatsBar, FooterSection) là 1 component
  riêng, đặt tên theo PascalCase, tương ứng 1 file.
- Các phần tử lặp lại trong danh sách (FieldCard, EventListItem,
  TestimonialCard) tách thành component con riêng để tái sử dụng và test độc lập.
- `types.ts` gom các interface dữ liệu (FieldItem, EventItem, TestimonialItem,
  StatItem, QuickFeatureItem) để các component con dùng chung, tránh định nghĩa
  trùng lặp.
- `index.ts` export tất cả để nơi khác chỉ cần `import { HomePage } from
  "@/components/home"`.
- `HomePage.tsx` chỉ làm nhiệm vụ compose (ghép) các section lại theo đúng thứ
  tự, không chứa logic hiển thị chi tiết.
- File tại `pages/Home.tsx` là nơi gắn route (react-router / TanStack Router...),
  chỉ import và render module `home`, giữ page-level file mỏng.

## Ghi chú

- Toàn bộ UI hiện tại chỉ dựng phần sườn: dùng border để phân tách khối, không
  dùng màu nền hay hình ảnh thật - dữ liệu ảnh thay bằng khối `border-dashed`
  có chữ placeholder.
- Các component `ui/*` là component gốc của shadcn (Button, Card, Badge,
  Avatar, Select, DropdownMenu, NavigationMenu, Separator, Label). Nếu chưa có,
  chạy: `npx shadcn@latest add button card badge avatar select dropdown-menu
  navigation-menu separator label`.
