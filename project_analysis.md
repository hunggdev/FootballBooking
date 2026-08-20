# 📊 Báo Cáo Phân Tích Dự Án: Football Booking System

> Phân tích toàn diện từ Backend đến Frontend — Chất lượng, Lỗi, Hiệu năng, Bảo mật, Tính linh hoạt.

---

## 🧱 Tổng Quan Kiến Trúc

**Stack:**
- **Backend:** Express 5 + Prisma ORM + PostgreSQL (Supabase) + Redis + Socket.IO
- **Frontend:** React 19 + Vite + TypeScript + TanStack Query + Zustand + Tailwind v4

**Mức độ hoàn thiện ước tính:** ~65–70% — Đủ demo nhưng chưa sẵn sàng Production.

---

## ✅ ĐIỂM MẠNH

### Backend
| Hạng mục | Đánh giá |
|---|---|
| **Schema thiết kế tốt** | Prisma schema có snapshot giá (`BookingSlot.price`), tách hợp lý `SlotHold`, `BlockedSlot`, `BookingSlot`. |
| **Hold Slot bằng Redis** | Dùng `SET NX EX` (atomic) + Lua Script để xóa an toàn. Tránh race condition rất tốt. |
| **Redis SCAN thay KEYS** | `getFieldHolds` dùng SCAN + Pipeline — tránh blocking Redis production. |
| **Prisma Transaction** | `createBooking` dùng `$transaction` đúng cách — đảm bảo consistency. |
| **Socket.IO Real-time** | Phòng `schedule:{fieldId}:{date}` broadcast update slot ngay lập tức. |
| **Refresh Token flow** | HttpOnly cookie + DB Session + auto-refresh interceptor ở FE. Thiết kế đúng. |
| **Auth middleware đa nguồn** | Hỗ trợ cả `Authorization: Bearer` header lẫn cookie — linh hoạt. |
| **Email verification + Reset Password** | Đầy đủ flow: INACTIVE → verify email → ACTIVE. |

### Frontend
| Hạng mục | Đánh giá |
|---|---|
| **TanStack Query** | Dùng đúng pattern: `useQuery` + `useMutation` + `invalidateQueries`. |
| **Zustand cho auth** | Store nhẹ, đúng chỗ — auth state tách biệt khỏi server state. |
| **Route splitting** | Admin/User/Public tách rõ ràng vào 3 file riêng. |
| **TypeScript** | Có type định nghĩa cho payload, store types. |
| **Auto token refresh** | Axios interceptor tự retry với token mới khi nhận 401. |

---

## 🚨 LỖI VÀ VẤN ĐỀ CẦN SỬA

### 🔴 CRITICAL — Bảo Mật & Logic Nghiêm Trọng

#### 1. Secrets bị lộ trong `.env` commit vào repo

```
ACCESS_TOKEN_SECRET=00660d68af657a7b68...
EMAIL_PASS=okxeqchwjhhzoicm
PAYOS_API_KEY=dd42220c-...
DATABASE_URL="postgresql://postgres.lutoclnarg..."
```

> **CỰC KỲ NGUY HIỂM** — Supabase, PayOS, Email, JWT secrets đều lộ. Nếu push GitHub public → toàn bộ bị compromise.
> **Fix:** Thêm `.env` vào `.gitignore`, rotate toàn bộ key ngay lập tức.

---

#### 2. Socket.IO không xác thực userId — Client tự khai báo

```javascript
// socketManager.js:10-14
const userId = socket.handshake.auth?.userId; // Client tự gửi lên!
socket.userId = userId; // Không verify JWT → ai cũng giả mạo userId được
```

> **Fix:** Verify JWT từ cookie trong middleware Socket.IO thay vì tin client.

---

#### 3. `io.emit()` broadcast đến toàn bộ server

```javascript
// bookingController.js:348, 426, 638
io.emit("user:cart_updated", {...}); // Gửi đến TẤT CẢ socket!
// Đúng phải là:
io.to(`user:${userId}`).emit("user:cart_updated", {...});
```

---

#### 4. `cancelBooking` không kiểm tra ownership

```javascript
// bookingController.js:739-780
// Không check booking.userId === req.user.userId!
// Bất kỳ user đăng nhập nào cũng hủy được booking của người khác
```

> **Fix:** `if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') return 403`

---

#### 5. Notification hardcode `recipientId: 1`

```javascript
// bookingController.js:649, matchController.js:116, 215
await createNotification({ recipientId: 1, ... }) // Admin luôn phải là userId = 1
```

> **Fix:** Query admin từ DB hoặc config `ADMIN_USER_ID` trong env.

---

#### 6. `joinMatch` đổi status `MATCHED` ngay khi có 1 người join

```javascript
// matchController.js:349-354
// 5v5, 7v7, 11v11 — cần đủ người mới MATCHED
// Nhưng hiện tại: 1 người join = MATCHED ngay
await prisma.match.update({ data: { status: "MATCHED" } });
```

---

### 🟠 HIGH — Hiệu Năng & Thiết Kế

#### 7. `getBookings` không có pagination

```javascript
// bookingController.js:669-690
const bookings = await prisma.booking.findMany({
  include: { user, bookingSlots: { include: { fieldSlot: { include: { field } } } }, invoice, review, bookingServices },
  // Không có take/skip → load toàn bộ DB vào memory
});
```

> **Fix:** Thêm `take`, `skip`, filter theo status/date.

---

#### 8. Auth middleware query DB mỗi request

```javascript
// authMiddleware.js:33
const user = await prisma.user.findUnique({ where: { userId: decodedUser.userId } });
// 1 DB query cho mỗi API call → overhead lớn ở traffic cao
```

> **Fix:** Trust JWT payload (đã signed), chỉ query DB khi role/status có thể thay đổi. Hoặc Redis cache 60s.

---

#### 9. `checkSlotTimeOverlap` load toàn bộ slot vào memory

```javascript
// fieldSlotController.js:23
const existingSlots = await prisma.fieldSlot.findMany({ where: { fieldId } });
// Nếu field có 50+ slot → load hết vào memory rồi filter JS
```

> **Fix:** Thêm điều kiện overlap trực tiếp vào Prisma WHERE clause.

---

#### 10. Cron chạy trước khi DB kết nối

```javascript
// server.js:86
cron.schedule("*/1 * * * *", () => {
  cleanExpiredUsers(); // Gọi DB dù chưa chắc kết nối thành công
});
// connectDB().then(...) ở trên — cron nên nằm trong .then()
```

---

### 🟡 MEDIUM — Code Quality

#### 11. `console.log` debug còn sót

```javascript
// authController.js:14, 372, 380
console.log(fullName);
console.log("Body:", req.body);
console.log(token); // Lộ sensitive data trong log production!

// bookingController.js:625
console.log("Xoa thanh cong"); // Tiếng Việt không dấu
```

---

#### 12. `matchController.js` import bcrypt và TTL constants không dùng

```javascript
import bcrypt from "bcrypt"; // Unused
const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000; // Copy từ authController, không dùng
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // Tương tự
```

---

#### 13. `verificationUrl` email trỏ về backend port thay vì frontend

```javascript
// authController.js:49
const verificationUrl = `http://localhost:${process.env.PORT || 5001}/api/auth/verify?token=...`;
// User click link → trỏ thẳng vào BE API, không có UI để hiển thị kết quả
```

> **Fix:** `${process.env.CLIENT_URL}/verify-email?token=...` — FE nhận token rồi gọi API verify.

---

#### 14. `forgotPassword` lộ thông tin user tồn tại hay không

```javascript
// authController.js:309-311
if (!user) {
  return res.status(404).json({ message: "Email không chính xác" }); // User enumeration attack
}
```

> **Fix:** Luôn trả 200: `"Nếu email tồn tại, chúng tôi đã gửi hướng dẫn."`

---

#### 15. `updateBooking` thực hiện thêm query thừa

```javascript
// bookingController.js:794-797
const invoiceId = await prisma.booking.findFirst({ where: { bookingId }, select: { invoiceId: true } });
// Đã có `booking` ở line 788 — chỉ cần booking.invoiceId
```

---

#### 16. `deleteFieldSlot` không thực sự xóa nhưng message nói "xóa thành công"

```javascript
// fieldSlotController.js:259-262
await prisma.fieldSlot.update({ data: { status: "MAINTENANCE" } }); // Chỉ đổi status
return res.status(200).json({ message: "Xóa khung giờ thành công" }); // Message misleading
```

---

#### 17. `invoiceController.generateInvoice` — dead code với bug schema

```javascript
// invoiceController.js:44
const invoice = await prisma.invoice.create({
  data: { bookingId: booking.bookingId, ... } // Invoice không có field bookingId trong schema!
});
// Function này bị bypass bởi createBooking, nhưng route vẫn còn → confusing
```

---

#### 18. `ReactQueryDevtools` không có guard môi trường

```tsx
// AppRoutes.tsx:36
<ReactQueryDevtools initialIsOpen={false} />
// Hiển thị cả trong production build
```

---

#### 19. `dashboardController` chứa 120+ dòng code comment cũ

> File rất khó đọc. Nên xóa code comment, dùng git history để trace lại nếu cần.

---

### 🟢 LOW — Cải Tiến Tối Ưu

#### 20. Thiếu rate limiting trên Auth routes

> Brute force `/api/auth/signin` và `/api/auth/forgot-password` không bị giới hạn.
> **Fix:** `npm i express-rate-limit` và áp dụng cho auth routes.

---

#### 21. Không có global error handler

```javascript
// Nếu bất kỳ controller nào quên try/catch → unhandled rejection → crash
// Fix: app.use((err, req, res, next) => { res.status(500).json({...}) })
```

---

#### 22. `datasource db` trong schema.prisma thiếu `url`

```prisma
datasource db {
  provider = "postgresql"
  // Thiếu: url = env("DATABASE_URL") — chỉ có trong prisma.config.ts
}
```

---

#### 23. Không có body size limit

> Express default 100kb. Base64 image upload trong JSON body sẽ bị reject hoặc gây vấn đề.

---

#### 24. FE: Folder `admin-stats` và `admin-stats1` trùng lặp

> Cần xác định folder nào là current, xóa folder cũ.

---

#### 25. `BookingType.RECURRING` trong schema nhưng chưa implement logic

> Nếu chưa implement, nên remove khỏi enum để tránh confusion.

---

## 📈 ĐÁNH GIÁ HIỆU NĂNG

| Điểm | Trạng thái | Chi tiết |
|---|---|---|
| Redis Hold (Atomic SET NX) | ✅ Tốt | Đúng cách, tránh race condition |
| Redis SCAN + Pipeline | ✅ Tốt | Không block, giảm RTT |
| DB Transaction | ✅ Tốt | `createBooking` atomic |
| Pagination | ❌ Thiếu | `getBookings`, `getCustomers` load all |
| Auth DB hit mỗi request | ⚠️ Overhead | Cân nhắc cache hoặc trust JWT |
| N+1 query | ⚠️ Có | `checkSlotTimeOverlap` load all rồi filter |
| Read caching | ❌ Thiếu | Không có HTTP cache header, không Redis cache read |
| Socket namespaces | ⚠️ Trung bình | Thiếu phân tách admin/user namespace |

---

## 🔐 ĐÁNH GIÁ BẢO MẬT

| Điểm | Trạng thái |
|---|---|
| JWT HttpOnly Cookie | ✅ Đúng |
| CSRF Protection | ❌ Thiếu (sameSite=lax chỉ partial protection) |
| Rate Limiting | ❌ Thiếu |
| Input Validation | ⚠️ Không nhất quán (authController có, đa số không) |
| SQL Injection | ✅ Prisma ORM bảo vệ |
| Socket.IO Auth | ❌ Trust client-provided userId |
| Secrets Management | 🚨 Critical — lộ trong .env |
| User Enumeration | ⚠️ forgotPassword lộ email tồn tại hay không |
| CORS | ✅ Configured đúng với CLIENT_URL |
| Ownership Check | ❌ Thiếu ở cancelBooking, updateMatch |

---

## 🏗️ TÍNH LINH HOẠT & MỞ RỘNG

### Điểm mạnh:
- Tách `libs/`, `utils/`, `controllers/`, `routes/`, `middlewares/` hợp lý
- FE có `services/` layer tách biệt API call
- Zustand + TanStack Query phân tách rõ client vs server state
- Prisma schema với nhiều enum — dễ extend

### Điểm yếu:
- **Không có Service Layer** — business logic trong controller → khó unit test
- **Không có Validation Layer** (Joi/Zod ở BE) — validate rải rác, không nhất quán
- **0% Test Coverage** — không có unit/integration/e2e test
- **Hardcode Admin userId = 1** — không scale khi có nhiều admin

---

## 🔧 DANH SÁCH ƯU TIÊN SỬA LỖI

### Ngay lập tức (P0):
1. 🔑 Rotate toàn bộ secrets (DB, PayOS, Email, JWT)
2. 🔒 Fix Socket.IO — verify JWT, không trust client userId
3. 📢 Fix `io.emit` → `io.to('user:{id}').emit`
4. 🛡️ Fix `cancelBooking` thêm ownership check

### Tuần này (P1):
5. 🔔 Fix hardcode `recipientId: 1`
6. 📄 Thêm pagination `getBookings`, `getCustomers`
7. 🚦 Thêm rate limiting auth routes
8. 🌐 Fix `verificationUrl` trỏ về FE

### Sprint tiếp theo (P2):
9. 🧹 Xóa `console.log` debug, unused imports
10. ⚡ Cache user auth middleware (Redis 60s TTL)
11. 📦 Thêm global error handler
12. 🧪 Thêm Zod validation middleware cho BE routes
13. 🗄️ Chuẩn hóa `datasource db` trong Prisma schema

---

## 📊 ĐIỂM TỔNG HỢP

| Hạng mục | Điểm (10) | Ghi chú |
|---|---|---|
| Kiến trúc tổng thể | 7/10 | Tốt về concept, thiếu service layer |
| Bảo mật | 4/10 | Nhiều lỗ hổng nghiêm trọng |
| Hiệu năng | 6/10 | Redis tốt, thiếu pagination & cache |
| Code Quality | 6/10 | Debug log, dead code, hardcode |
| TypeScript / Type Safety | 7/10 | FE có types, BE pure JS |
| Tính linh hoạt | 6/10 | Cấu trúc tốt, thiếu test & validation layer |
| Độ hoàn thiện | 6.5/10 | Đủ demo, chưa production-ready |
| **Tổng** | **6.1/10** | **Tiềm năng cao, cần refactor bảo mật** |
