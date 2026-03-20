# 📋 Roadmap: Trang Login Zalo qua UI

> **Mục tiêu:** Tạo trang Login trên ZMA để test luồng đăng nhập bằng SĐT Zalo → Backend → JWT  
> **Ngày tạo:** 2026-03-14

---

## 🔄 Luồng hoạt động (Authentication Flow)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ZALO MINI APP (Frontend)                     │
│                                                                     │
│  1. User mở app → Kiểm tra có JWT trong storage không              │
│     ├── CÓ → Gọi GET /auth/me để verify                           │
│     │   ├── OK → Chuyển đến /dashboard                             │
│     │   └── 401 → Xóa token, hiện trang Login                     │
│     └── KHÔNG → Hiện trang Login                                   │
│                                                                     │
│  2. Trang Login hiện nút "Đăng nhập bằng Zalo"                    │
│     │                                                               │
│  3. User nhấn nút → Gọi ZMP SDK:                                  │
│     ├── authorize() → lấy accessToken                              │
│     └── getPhoneNumber() → lấy phoneToken                          │
│                                                                     │
│  4. Gửi POST /auth/zalo-login:                                     │
│     Body: { accessToken, phoneToken, refCode? }                    │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NESTJS BACKEND                               │
│                                                                     │
│  5. AuthService.zaloLogin(dto):                                     │
│     ├── ZaloService.verifyAccessToken(accessToken)                 │
│     │   → Gọi Zalo Graph API → nhận { zaloId, name, avatar }      │
│     │                                                               │
│     ├── ZaloService.decryptPhoneNumber(phoneToken, accessToken)    │
│     │   → Gọi Zalo API GET /phone → nhận { phone: "0xxx..." }     │
│     │                                                               │
│     ├── MembersService: Tìm member theo zaloId                     │
│     │   ├── KHÔNG CÓ → Tạo member mới + xử lý referral           │
│     │   └── CÓ → Update info mới nhất                             │
│     │                                                               │
│     └── JwtService.sign({ sub: member.id, zaloId })                │
│         → Trả về { accessToken (JWT), member, isNewUser }          │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     QUAY LẠI FRONTEND                               │
│                                                                     │
│  6. Nhận response:                                                  │
│     ├── Lưu JWT vào storage (jotai atom + localStorage)            │
│     ├── Lưu member info vào state                                  │
│     └── Redirect → /dashboard                                      │
│                                                                     │
│  7. Các trang khác:                                                 │
│     └── Gửi header: Authorization: Bearer <JWT> cho mọi request   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Phases

### Phase 1: Auth Store & API Service
> **Files tạo mới:** `src/stores/auth.ts`, `src/services/api.ts`

- [x] Tạo `api.ts`: axios instance + interceptor gắn JWT header
- [x] Tạo `auth.ts`: jotai atoms cho `token`, `member`, `isLoggedIn`
- [x] Hàm `login(accessToken, phoneToken, refCode?)` → gọi `POST /auth/zalo-login`
- [x] Hàm `checkAuth()` → gọi `GET /auth/me` verify token
- [x] Hàm `logout()` → xóa token, reset state

### Phase 2: Trang Login UI
> **Files tạo mới:** `src/pages/login.tsx`

- [x] Giao diện: Logo + Nút "Đăng nhập bằng Zalo" (dùng zmp-ui Button/Icon)
- [x] Gọi ZMP SDK: `authorize()` + `getPhoneNumber()`
- [x] Kết nối với auth store Phase 1
- [x] Loading state + Error handling (hiện snackbar)
- [x] Đăng nhập thành công → redirect `/dashboard`

### Phase 3: Auth Guard & Route Protection
> **Files sửa:** `src/components/layout.tsx`

- [x] Thêm route `/login` vào Layout
- [x] Tạo component `AuthGuard` wrap các protected routes
- [x] Logic: chưa login → redirect `/login`, đã login → render children
- [x] Áp dụng AuthGuard cho `/dashboard`, `/referral`, `/rewards`, `/qr`

### Phase 4: Kết nối & Test End-to-End
> **Kiểm tra toàn luồng**

- [x] Backend đang chạy (mock mode OK)
- [x] Cấu hình `API_URL` trong `.env` frontend
- [ ] Test flow: Mở app → Login → Nhận JWT → Vào dashboard
- [ ] Test flow: Mở app khi đã login → Tự động vào dashboard
- [ ] Test flow: Token hết hạn → Quay về login

---

## 📁 Tóm tắt files thay đổi

| Action | File | Mô tả |
|--------|------|-------|
| **NEW** | `src/services/api.ts` | Axios instance, interceptor |
| **NEW** | `src/stores/auth.ts` | Auth state (jotai atoms) |
| **NEW** | `src/pages/login.tsx` | Trang Login UI |
| **EDIT** | `src/components/layout.tsx` | Thêm route `/login` + AuthGuard |
| **EDIT** | `.env` | Thêm `VITE_API_URL` |

---

## ⚠️ Lưu ý khi test
- **Mock mode:** Backend đang chạy mock → `ZaloService` trả dữ liệu giả, không cần Zalo app thật
- **ZMP SDK:** `authorize()` và `getPhoneNumber()` chỉ hoạt động trong môi trường Zalo Mini App (simulator hoặc trên điện thoại). Nếu test ngoài browser thường, cần mock thêm phía frontend
- **CORS:** Backend cần cho phép origin từ ZMA dev server
