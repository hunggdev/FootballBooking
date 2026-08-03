# 📊 Báo Cáo Phân Tích Chất Lượng Hệ Thống — Football Booking

> **Thời điểm phân tích:** 2026-08-02  
> **Trạng thái dự án:** Đang phát triển (In Development)

---

## 🛠️ Tech Stack Tổng Quan

### Frontend

| Công cụ | Phiên bản | Vai trò |
|---|---|---|
| **React** | 19.2.7 | UI Framework |
| **Vite** | 8.1.1 | Build tool & Dev server |
| **TypeScript** | ~6.0.2 | Type safety |
| **React Router** | 7.18.1 | Client-side routing |
| **TanStack Query (React Query)** | 5.101.4 | Server state management, caching, mutations |
| **Zustand** | 5.0.14 | Client-side global state (auth, user session) |
| **Axios** | 1.18.1 | HTTP client |
| **React Hook Form** | 7.82.0 | Form management *(chỉ import, không dùng trong phần lớn form)* |
| **Zod** | 4.4.3 | Schema validation *(import nhưng chưa thấy dùng tập trung)* |
| **shadcn/ui** | 4.13.1 | UI component library (dựa trên Radix UI) |
| **@base-ui/react** | 1.6.0 | Base UI primitives (Field, FieldGroup...) |
| **Tailwind CSS** | 4.3.3 | Utility CSS framework |
| **Sonner** | 2.0.7 | Toast notifications |
| **Lucide React** | 1.25.0 | Icon library |
| **@tanstack/react-query-devtools** | 5.101.4 | Debug React Query |

### Backend

| Công cụ | Phiên bản | Vai trò |
|---|---|---|
| **Node.js + Express** | 5.2.1 | Web server framework |
| **Prisma** | 7.8.0 | ORM cho PostgreSQL |
| **@prisma/adapter-pg** | 7.8.0 | Prisma PostgreSQL adapter (connection pool) |
| **pg (node-postgres)** | 8.22.0 | PostgreSQL driver |
| **jsonwebtoken** | 9.0.3 | JWT auth (Access Token) |
| **bcrypt** | 6.0.0 | Password hashing |
| **cookie-parser** | 1.4.7 | Refresh token cookie |
| **cors** | 2.8.6 | Cross-origin request |
| **nodemailer** | 9.0.3 | Gửi email xác thực |
| **node-cron** | 4.6.0 | Cron job dọn dẹp user chưa kích hoạt |
| **dotenv** | 17.4.2 | Biến môi trường |

### RAG Chatbot (Python — service riêng)

| Công cụ | Vai trò |
|---|---|
| **FastAPI** | Python web framework |
| **LangChain** | RAG pipeline |
| **FAISS** | Vector similarity search |
| **BM25Retriever** | Keyword-based retrieval |
| **OpenAI GPT-4o-mini** | LLM generation |
| **OpenAI text-embedding-3-large** | Embedding model |

---

## ✅ Ưu Điểm

### Kiến trúc & Cấu trúc
- **Phân tách rõ ràng** front-end / back-end / RAG chatbot thành 3 service độc lập.
- **Feature-based folder structure** ở frontend (`features/admin-match`, `features/user-match`...) — dễ scale.
- **Prisma ORM** với schema rõ ràng, có index đầy đủ, relationship cascade hợp lý.
- **Connection Pool (pg.Pool)** với max=50 — đã chuẩn bị cho tải cao.
- **Soft-delete pattern** — xóa Field/Service/Customer/Match đều dùng cập nhật status, không mất dữ liệu thật.

### Auth System
- **Dual-token auth**: Access Token (JWT, ngắn hạn 1 ngày) + Refresh Token (random bytes, 14 ngày, lưu DB).
- **Session management** trong DB — có thể revoke, không chỉ dựa vào JWT expiry.
- **Email activation flow** hoàn chỉnh — user INACTIVE bị chặn đăng nhập.
- **Cron job** dọn dẹp user INACTIVE sau 30 phút — tránh rác DB.
- Zustand `clearState()` gọi trong `finally` của `signOut` — luôn xóa state dù API lỗi.

### Frontend Pattern
- **TanStack Query** dùng đúng cho server state — `useMatches`, `useCreateMatch`, mutations với `invalidateQueries`.
- **Zustand** dùng hợp lý cho auth state (access token, user profile).
- Axios interceptor gán Access Token vào header tự động.
- `ProtectedRoute` xử lý refresh token khi reload trang — UX mượt.
- `staleTime: 0` cho `useMatches` — data luôn fresh.
- Error handling có `getErrorMessage()` helper để lấy message từ Axios error.

### RAG Chatbot
- Hybrid retrieval (FAISS + BM25 Ensemble) — tăng chất lượng tìm kiếm.
- MultiQueryRetriever — rewrite câu hỏi thành nhiều variant để tìm đủ context.
- Index build một lần, load lên memory khi start — hiệu năng tốt.
- Dedup chunk trước khi đưa vào context.

---

## ❌ Lỗi Nghiêm Trọng (Bugs)

### 🔴 BUG 1 — `deleteMatch`: Destructuring sai, userId luôn là `undefined`
**File:** `matchController.js` — dòng 181

```js
// ❌ SAI: dùng object destructuring nhưng req.user.userId là số nguyên
const {userId} = req.user.userId;

// ✅ ĐÚNG:
const userId = req.user.userId;
```
**Hậu quả:** `userId = undefined` → `match.findFirst({ where: { matchId, userId: undefined } })` sẽ tìm đúng match nhưng không validate owner, hoặc lỗi tùy case. Bất kỳ user nào cũng có thể xóa match của người khác.

---

### 🔴 BUG 2 — `joinMatch`: Bất kỳ participant thứ nhất nào cũng set status MATCHED
**File:** `matchController.js` — dòng 320–325

```js
// Mọi lần join đều MATCHED, không kiểm tra đủ team hay slot
await prisma.match.update({ where: { matchId }, data: { status: "MATCHED" } });
```
**Hậu quả:** Match chỉ cần 1 người join là thành `MATCHED`. Logic business không đúng — thực tế match cần đủ số lượng người mới là "Đã ghép".

---

### 🔴 BUG 3 — `authController.js` dòng 50: Hardcode localhost trong verification URL
```js
// ❌ URL luôn trỏ về localhost dù deploy lên production
const verificationUrl = `http://localhost:${process.env.PORT || 5001}/api/auth/verify?token=...`;
```
**Hậu quả:** Trên production, link email sẽ trỏ sai, user **không thể kích hoạt tài khoản**.

---

### 🔴 BUG 4 — `userController.js` dòng 14: Dead code sau `return`
```js
return res.status(200).json({ user });    // ← return rồi
return res.status(200).json({message: "Success"});  // ← không bao giờ chạy
```

---

### 🔴 BUG 5 — `userController.js`: Gọi `validatePassword` nhưng chưa import
```js
// dòng 78
const errorPassword = validatePassword(newPassword);
// nhưng chỉ import validateEmail, validatePhone, validateUser — không có validatePassword
```
**Hậu quả:** `changePassword` sẽ **crash với ReferenceError** khi gọi. Tính năng đổi mật khẩu **không hoạt động**.

---

### 🔴 BUG 6 — `requireMatchOwner` middleware: so sánh field không tồn tại
**File:** `authMiddleware.js` — dòng 89
```js
if (match.creatorId !== userId) { ... }
// nhưng trong schema, field là `userId`, không phải `creatorId`
```
**Hậu quả:** `match.creatorId` luôn là `undefined` → middleware luôn fail hoặc pass tùy logic. Middleware này **chưa được dùng** (route không gọi nó), nhưng là bug tiềm ẩn khi tích hợp.

---

### 🔴 BUG 7 — `requireMatchOwner` middleware: `matchId` từ `req.params` là string, không parse số
```js
const { matchId } = req.params;  // string "5"
const match = await prisma.match.findUnique({ where: { matchId } }); // cần number
```
**Hậu quả:** Prisma sẽ type error hoặc không tìm được match.

---

### 🔴 BUG 8 — `ManageMatch.tsx` dòng 217: Backtick thừa gây syntax error
```ts
``  // ← dòng 217: 2 backtick thừa, không biết ý định là gì
```
**Hậu quả:** File vẫn compile được (template literal rỗng), nhưng là code lỗi về mặt tư duy.

---

### 🔴 BUG 9 — `resetPassword`: Query `findMany` thừa, không cần thiết
```js
// Dòng 335-340: query thừa hoàn toàn
const all = await prisma.passwordResetToken.findMany({ where: { token } });
console.log(all);
```
Đây là debug code bị bỏ quên trong production code.

---

### 🔴 BUG 10 — `MatchFormDialog`: `validate()` luôn trả về `null`
```ts
const validate = () => {
  return null;  // không validate gì cả!
};
```
**Hậu quả:** Có thể submit form với `fieldType = ""`, `costRule = ""`, `minAge = 0` — data không hợp lệ gửi lên server.

---

### 🔴 BUG 11 — `fieldController.js`: Role check sai (lowercase vs uppercase)
```js
const isAdmin = req.user?.role === "admin";  // ❌ lowercase "admin"
// nhưng trong DB và middleware, role là "ADMIN" (uppercase)
```
**Hậu quả:** Admin không bao giờ thấy được danh sách đầy đủ field (bao gồm INACTIVE/MAINTENANCE).

---

### 🔴 BUG 12 — `MatchFormDialog`: Form state không reset khi mở lại (create mode)
```ts
// key prop đã dùng để force re-render nhưng form `emptyForm` vẫn khởi tạo tĩnh
// Nếu user edit match A rồi click Add, defaultForm có thể giữ giá trị cũ
```

---

### 🔴 BUG 13 — `ProtectedRoute`: `loading` state có thể gây flash khi `starting = false`
Khi `refresh()` thành công và `fetchMe()` chạy, `loading` trở về `false` trước khi `starting` được set. Nếu có race condition giữa `loading` và `starting`, màn hình "Đang tải trang..." có thể tắt quá sớm.

---

## ⚠️ Vấn Đề Bảo Mật

### 🟠 SEC-1: Email forgotPassword tiết lộ thông tin user
```js
if (!user) {
  return res.status(404).json({ message: "Email không chính xác" });
}
```
**Vấn đề:** Attacker có thể dùng forgot-password để brute-force kiểm tra email nào đã đăng ký. Nên trả về HTTP 200 với message chung cho cả 2 trường hợp.

### 🟠 SEC-2: Access Token TTL quá dài (1 ngày)
```js
const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000; // 1 ngày!
```
Access token thường nên là 15–60 phút. 1 ngày quá dài, nếu token bị lộ, attacker có nhiều thời gian để tấn công.

### 🟠 SEC-3: RAG chatbot `allow_dangerous_deserialization=True`
FAISS index được load với tùy chọn này. Nếu file index bị tamper, có thể dẫn đến RCE. Cần đảm bảo file index không expose ra ngoài.

### 🟠 SEC-4: Chatbot proxy không validate input
```js
// userController.js
const { question } = req.body;
const response = await axios.post("http://localhost:8000/chat", { question });
```
Không validate `question` trước khi gửi đến Python service. Prompt injection có thể xảy ra.

### 🟠 SEC-5: `console.log(fullName)` trong `signUp` — data leak
```js
// authController.js dòng 15
console.log(fullName)  // PII data logged ra console
```
Trong production, log PII (tên người dùng) là vi phạm privacy.

### 🟠 SEC-6: `console.log({fullName, email, phone, password})` trong `createCustomer`
```js
// customerController.js dòng 92 — log cả password!
console.log({fullName, email, phone, password})
```
**Cực kỳ nguy hiểm**: Log plaintext password ra console/log server.

### 🟠 SEC-7: `resetPassword` không xóa session kũ sau khi đặt lại mật khẩu
Sau khi đặt lại mật khẩu, các session cũ (refresh token) vẫn còn hiệu lực. Điều này có nghĩa nếu tài khoản bị hack, đặt lại mật khẩu không thực sự bảo vệ.

---

## 🐛 Vấn Đề Về Logic Business

### ❌ LOGIC-1: `cancelJoinMatch` luôn set status = OPEN
```js
// Nếu có 3 người đã join và 1 người rút, status lại về OPEN
await prisma.match.update({ data: { status: "OPEN" } });
```
Cần kiểm tra số participant còn lại sau khi hủy.

### ❌ LOGIC-2: Match không có giới hạn số người
Không có field `maxParticipants` trong Match model. Bất kỳ số người nào cũng có thể tham gia.

### ❌ LOGIC-3: `getCustomers` — `bookingCount` và `totalSpent` luôn = 0
```js
const customers = users.map((user) => ({
  bookingCount: 0,  // hardcode!
  totalSpent: 0,    // hardcode!
}));
```
Dashboard admin hiển thị data giả.

### ❌ LOGIC-4: `getCustomerById` trả về `passwordHash`
```js
const customer = await prisma.user.findUnique({ where: { userId } });
// không có `select` hoặc `omit` → trả về toàn bộ user kể cả passwordHash
```

### ❌ LOGIC-5: `createCustomer` (admin tạo) bypass email verification
Admin tạo account với `status: "ACTIVE"` trực tiếp. Không có cơ chế thông báo mật khẩu cho user. User mới không biết mật khẩu của mình là gì.

### ❌ LOGIC-6: `updateCustomer` nhận status "BANNED" nhưng schema User không có BANNED
Schema User chỉ có `ACTIVE`/`INACTIVE`, không có enum rõ ràng cho `status` (dùng String). Đang mix với `deleteCustomer` cũng set `BANNED`. Cần chuẩn hóa.

### ❌ LOGIC-7: `MatchFormDialog` — `fullName` trong `emptyForm` là field thừa
```ts
const emptyForm = {
  userId: 0,
  fullName: "",  // ← không cần, userId không phải input của user
```

---

## 📉 Vấn Đề Hiệu Năng

### ⚡ PERF-1: `authMiddleware` query DB mỗi request
```js
const user = await prisma.user.findUnique({ where: { userId: decodedUser.userId } });
```
Mỗi API call đều query DB 1 lần để lấy user. Với 50 concurrent users mỗi request tốn 1 DB hit thừa. Nên cache user info trong JWT payload (thêm role, status vào token).

### ⚡ PERF-2: RAG chatbot `load_rag_chain()` mỗi request
```python
def ask(question: str): 
    global rag_chain
    rag_chain = load_rag_chain()  # ← Load lại FAISS index MỖI LẦN gọi!
    return rag_chain.invoke(question)
```
**Nghiêm trọng**: FAISS index được load lại mỗi request. Điều này rất tốn bộ nhớ và CPU. Đây là anti-pattern, mâu thuẫn với comment trong file (`"chỉ chạy 1 LẦN lúc server khởi động"`).

### ⚡ PERF-3: `getMatches` — load toàn bộ match, không phân trang server-side
```js
const matches = await prisma.match.findMany({ ... });  // không có take/skip
```
Frontend tự phân trang client-side. Với nhiều match, transfer data sẽ rất lớn.

### ⚡ PERF-4: `getCustomers` — Fetch sessions cho từng customer
```js
sessions: { select: { sessionId: true } }
```
N+1 query pattern nhẹ (đã JOIN nhưng có thể tối ưu bằng aggregation).

### ⚡ PERF-5: `Session` model có 2 index trùng lặp trên `userId`
```prisma
@@index([userId])
@@index([userId], map: "idx_session_user")  // trùng!
```
Tương tự, `PasswordResetToken` cũng có 2 index trùng lặp.

---

## 🎨 Vấn Đề UX

### 🖥️ UX-1: Loading state thô sơ
```tsx
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Có lỗi xảy ra.</div>;
```
Không có skeleton, không có spinner, không có retry mechanism. Trải nghiệm người dùng kém.

### 🖥️ UX-2: Xác nhận xóa dùng `window.confirm()` native
```tsx
const ok = confirm(`Bạn có chắc muốn ngừng hoạt động tài khoản này "${match.matchId}"?`);
```
- Message lỗi: "ngừng hoạt động tài khoản" (đang nói về **match**, không phải **tài khoản**).
- Nên dùng Dialog/Modal của shadcn thay vì native confirm.

### 🖥️ UX-3: `timeNote` là text field tự do, không có datetime picker
```tsx
<Input value={form.timeNote} placeholder="Ex: 14h 22/7/2026" />
```
User phải gõ tay format ngày giờ, dễ nhập sai. Cần DateTimePicker.

### 🖥️ UX-4: `ProtectedRoute` không phân biệt Admin vs Customer
```tsx
// AdminRoutes dùng cùng 1 ProtectedRoute với UserRoutes
// Không check role — Customer có thể access /admin/* nếu có access token
```
**Nghiêm trọng về bảo mật và UX**: Cần thêm `requireAdmin` middleware hoặc role check trong `ProtectedRoute`.

### 🖥️ UX-5: Không có trang 404
Không tìm thấy fallback route `*` cho page không tồn tại.

### 🖥️ UX-6: `CustomerStatsCards` — "Đang hoạt động" hiển thị số session, không phải số user online
```tsx
// Backend: đếm số session chưa hết hạn
// Thực tế là "số phiên đang mở" chứ không phải "số người đang online"
```
Một user có thể có nhiều session → số liệu bị phồng.

### 🖥️ UX-7: Chatbot bị broken nếu Python service offline
Frontend/Backend không có fallback nếu `http://localhost:8000/chat` không phản hồi.

### 🖥️ UX-8: Booking module hoàn toàn trống
`features/booking/` là thư mục rỗng. Tính năng core của ứng dụng chưa được xây dựng.

---

## 🏗️ Vấn Đề Kiến Trúc & Code Quality

### 🟡 ARCH-1: Trùng lặp biến hằng số giữa các file
```js
// Được định nghĩa ở authController.js VÀ matchController.js VÀ customerController.js
const ACCESS_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
```
Cần extract ra `constants.js`.

### 🟡 ARCH-2: `useMatchStore.ts` đặt nhầm tên — đây là React Query hooks, không phải Zustand store
File `useMatchStore.ts` export React Query hooks (`useQuery`, `useMutation`), không phải Zustand store. Nên đặt là `useMatchQueries.ts` hoặc tổ chức vào folder `queries/`.

### 🟡 ARCH-3: Mix lẫn Zustand và TanStack Query
- Auth, User: dùng Zustand
- Match, Customer, Field, Service: dùng TanStack Query
- Chưa có convention rõ ràng khi nào dùng cái nào. Nên document lại.

### 🟡 ARCH-4: `authService.ts` có try-catch thừa (chỉ rethrow)
```ts
try {
  const res = await api.post(...);
  return res.data;
} catch (error) {
  throw error;  // ← không làm gì, chỉ rethrow
}
```
Remove try-catch hoặc thêm logic xử lý thực sự.

### 🟡 ARCH-5: Axios interceptor thiếu refresh token flow
`axios.ts` chỉ có request interceptor để gán AT. Không có response interceptor để tự động refresh khi nhận 401/403. User sẽ bị logout khi AT hết hạn thay vì tự refresh.

### 🟡 ARCH-6: Types phân tán, không nhất quán
- `admin-match/types.ts` chứa cả NavItem, Customer, SportsField... (không liên quan đến match)
- `user-match/types.ts` và `types/match.ts` là 2 file types khác nhau cho cùng domain
- Cần chuẩn hóa vào `types/` folder.

### 🟡 ARCH-7: RAG chatbot là service Python tách biệt nhưng không có health check
Backend Node.js gọi thẳng `http://localhost:8000/chat` mà không check xem Python service có đang chạy không.

### 🟡 ARCH-8: `prisma.config.ts` tồn tại nhưng datasource trong schema không có `url`
```prisma
datasource db {
  provider = "postgresql"
  // thiếu url = env("DATABASE_URL")
}
```
Cần kiểm tra lại — có thể Prisma 7 dùng cấu hình khác hoặc file này đang bị bỏ qua.

---

## 📋 Tính Năng Còn Thiếu / Chưa Hoàn Thiện

| Tính năng | Trạng thái |
|---|---|
| **Booking** (đặt sân) | ❌ Chưa có |
| **Payment / Invoice** | ❌ Schema có nhưng không có controller/route |
| **Review / Rating** | ❌ Schema có nhưng không có controller/route |
| **Admin Revenue Dashboard** | ❌ Feature folder tồn tại, nội dung rỗng |
| **Admin Feedback** | ❌ Feature folder tồn tại, nội dung rỗng |
| **Admin Odds** | ❌ Feature folder tồn tại, nội dung rỗng |
| **SlotHold** (giữ slot khi booking) | ❌ Schema có, không có controller |
| **Notification** | ❌ Được comment trong server.js, chưa có |
| **Trang người dùng (user-account)** | ⚠️ Có nhưng chưa kiểm tra đầy đủ |
| **Role-based route guard** | ⚠️ Thiếu cho Admin routes |
| **Match participant limit** | ❌ Chưa có |
| **Resend activation email** | ❌ Chưa có |
| **Pagination server-side** | ❌ Chưa có |

---

## 💡 Đề Xuất Cải Thiện Ưu Tiên

### 🚨 Ngay lập tức (Critical)

1. **Fix bug `deleteMatch`**: `const userId = req.user.userId` (bỏ destructuring).
2. **Fix bug `validatePassword` không import** trong `userController.js`.
3. **Fix URL hardcode localhost** trong `authController.js` → dùng `process.env.BACKEND_URL`.
4. **Xóa `console.log(password)`** trong `customerController.js`.
5. **Fix RAG chatbot**: load chain 1 lần duy nhất (lifespan pattern), không load lại mỗi request.
6. **Thêm role guard** cho Admin routes: check `req.user.role === "ADMIN"` trong ProtectedRoute.

### 📌 Ngắn hạn

7. **Thêm Axios response interceptor** để auto-refresh AT khi nhận 401.
8. **Fix `isOnline` logic** — dùng heartbeat/timestamp thay vì đếm session.
9. **Server-side pagination** cho `getMatches`, `getCustomers`.
10. **Validate form MatchFormDialog** (fieldType, costRule required).
11. **Thêm `maxParticipants`** vào Match model và validate khi join.
12. **Extract constants** (`ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`) ra file chung.

### 📌 Trung hạn

13. **Xây dựng Booking module** (feature core).
14. **Chuẩn hóa type files** — gộp types phân tán.
15. **Thêm skeleton loading** thay thế `<div>Loading...</div>`.
16. **Dùng shadcn Dialog** cho confirmation thay vì `window.confirm()`.
17. **Thêm DateTimePicker** cho `timeNote` trong match form.
18. **Implement Payment/Invoice** controller từ schema đã có.
19. **Xóa duplicate index** trong `Session` và `PasswordResetToken` schema.
20. **Cache user info** trong JWT payload để giảm DB hit ở middleware.

---

*Báo cáo được tạo bởi Antigravity — phân tích dựa trên đọc toàn bộ source code dự án.*
