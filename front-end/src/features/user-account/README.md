# Module `account`

Module cho UC "Thông tin tài khoản" (actor: User), tách biệt với `auth` và `home`.

## Ánh xạ dữ liệu từ Prisma model `User`

| Field Prisma   | Hiển thị ở FE?              | Ghi chú                                   |
|----------------|------------------------------|--------------------------------------------|
| userId         | Không hiển thị               | Dùng nội bộ (key, API call)                |
| fullName       | ✅ Họ và tên                  | Có thể chỉnh sửa                           |
| email          | ✅ Email                      | Hiển thị, không cho sửa trực tiếp ở đây    |
| phone          | ✅ Số điện thoại              | Optional, có thể chỉnh sửa                 |
| passwordHash   | ❌ Không bao giờ hiển thị      | Chỉ có action "Đổi mật khẩu", không lộ hash |
| role           | ✅ Badge vai trò              | Read-only                                  |
| status         | ✅ Badge trạng thái            | Read-only                                  |
| createdAt      | ✅ Ngày tham gia               | Format dd/mm/yyyy, read-only               |

## Cấu trúc thư mục

```
src/
├── components/
│   ├── auth/
│   ├── home/
│   ├── account/                    # module mới cho UC thông tin tài khoản
│   │   ├── AccountPage.tsx         # compose toàn bộ trang
│   │   ├── AccountHeader.tsx       # avatar + tên + badge role/status
│   │   ├── AccountInfoList.tsx     # danh sách thông tin read-only
│   │   ├── EditAccountForm.tsx     # form chỉnh sửa fullName/phone
│   │   ├── ChangePasswordSection.tsx # block trigger đổi mật khẩu
│   │   ├── types.ts                # UserAccount interface (không có passwordHash)
│   │   └── index.ts
│   └── ui/
└── pages/
    └── Account.tsx                  # route wrapper, render <AccountPage />
```

## Bố cục UI (đơn giản nhất)

1. **AccountHeader** - avatar, họ tên, email, badge vai trò/trạng thái.
2. **AccountInfoList** - danh sách read-only: họ tên, email, SĐT, ngày tham gia.
3. **EditAccountForm** - form chỉnh sửa họ tên/SĐT (email disabled).
4. **ChangePasswordSection** - chỉ có nút hành động, không xử lý mật khẩu ở FE.

Toàn bộ vẫn theo phong cách sườn: border phân tách khối, không màu nền/hình ảnh.
