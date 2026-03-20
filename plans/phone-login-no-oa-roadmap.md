# 📋 Roadmap: Đăng nhập bằng SĐT (Không cần Zalo OA)

> **Mục tiêu:** Thay thế luồng login qua Zalo OA bằng luồng nhập SĐT trực tiếp + mã giới thiệu  
> **Ngày tạo:** 2026-03-14  
> **Lý do:** Chưa có tài khoản Zalo Official Account (OA), không thể dùng `getPhoneNumber()` và `verifyAccessToken()` từ Zalo API

---

## 🔄 Luồng hoạt động mới (Phone Login Flow)

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
│  2. Trang Login hiện form:                                          │
│     ├── Input: Số điện thoại (bắt buộc, validate 10 số VN)        │
│     └── Input: Mã giới thiệu (optional, format ZDC-XXXXXX)        │
│                                                                     │
│  3. User nhấn "Đăng nhập" → Đọc ?ref= từ URL (nếu có)            │
│     ├── Ưu tiên: refCode từ URL param > refCode từ input           │
│     └── Gửi POST /auth/phone-login                                 │
│         Body: { phone, refCode? }                                   │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NESTJS BACKEND                               │
│                                                                     │
│  4. AuthService.phoneLogin(dto):                                    │
│     ├── Normalize SĐT (bỏ khoảng trắng, +84 → 0xxx)              │
│     │                                                               │
│     ├── Tìm member theo phone                                      │
│     │   ├── CÓ (user cũ) → Cập nhật lastActiveAt                  │
│     │   └── KHÔNG CÓ (user mới):                                  │
│     │       ├── Tạo member: status='verified'                      │
│     │       ├── Auto-gen: qr_code (QR-XXXXXXXX)                   │
│     │       ├── Auto-gen: referral_code (ZDC-XXXXXX)               │
│     │       └── Xử lý refCode nếu có:                             │
│     │           ├── Tìm referrer sở hữu mã đó                     │
│     │           ├── Tạo referral (referrer_id, referee_id)         │
│     │           │   status = 'pending' (chờ bill CUKCUK)           │
│     │           ├── Set member.referred_by = referrer.id            │
│     │           └── referrer.total_referrals += 1                   │
│     │                                                               │
│     └── JwtService.sign({ sub: member.id, phone })                 │
│         → Trả về { accessToken (JWT), member, isNewUser }          │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     QUAY LẠI FRONTEND                               │
│                                                                     │
│  5. Nhận response:                                                  │
│     ├── Lưu JWT vào storage (jotai atom + localStorage)            │
│     ├── Lưu member info vào state                                  │
│     └── Redirect → /dashboard                                      │
│                                                                     │
│  6. Các trang khác:                                                 │
│     └── Gửi header: Authorization: Bearer <JWT> cho mọi request   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Phases

### Phase 1: Backend — Comment code Zalo OA & tạo endpoint mới
> **Ưu tiên:** Cao — Backend phải sẵn sàng trước Frontend

#### 1A. Comment code phụ thuộc Zalo OA

> Giữ code cũ nhưng comment lại, để khi có OA có thể bật lên nhanh

| File | Hành động |
|------|-----------|
| `src/zalo/zalo.service.ts` | Comment toàn bộ body 2 method `verifyAccessToken()` và `decryptPhoneNumber()`. Thay bằng `throw new Error('ZALO_OA_NOT_CONFIGURED')` |
| `src/auth/auth.service.ts` | Comment method `zaloLogin()` (giữ nguyên, thêm `@deprecated`). Viết method mới `phoneLogin()` |
| `src/auth/auth.controller.ts` | Comment route `POST /auth/zalo-login`. Thêm route mới `POST /auth/phone-login` |
| `src/auth/strategies/jwt.strategy.ts` | Sửa `validate()`: trả `{ id, phone }` thay vì `{ id, zaloId }` |
| `.env` | Comment các biến `ZALO_APP_SECRET`, `ZALO_MOCK_MODE` |

#### 1B. Tạo DTO mới cho Phone Login

**File mới:** `src/auth/dto/phone-login.dto.ts`

```typescript
export class PhoneLoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0[3-9]\d{8}$/, { message: 'SĐT không hợp lệ (VD: 0987654321)' })
  phone: string;

  @IsOptional()
  @IsString()
  @Matches(/^ZDC-[a-zA-Z0-9]+$/, { message: 'Mã giới thiệu không đúng format' })
  refCode?: string;
}
```

#### 1C. Viết method `phoneLogin()` trong AuthService

```typescript
async phoneLogin(dto: PhoneLoginDto) {
  // 1. Normalize SĐT
  const phone = this.normalizePhone(dto.phone);

  // 2. Tìm member theo phone
  let member = await this.membersService.findByPhone(phone);
  let isNewUser = false;

  if (!member) {
    // 3. Tạo member mới (status=verified, auto-gen qr_code + referral_code)
    member = await this.membersService.createMemberByPhone({ phone });
    isNewUser = true;

    // 4. Xử lý referral nếu có
    if (dto.refCode) {
      await this.referralsService.processReferral(dto.refCode, member.id);
    }
  } else {
    // User cũ: cập nhật lastActiveAt
    member = await this.membersService.updateMemberInfo(member.id, {
      lastActiveAt: new Date(),
    });
  }

  // 5. Tạo JWT
  const accessToken = this.generateTokenByPhone(member);

  return { accessToken, member, isNewUser };
}
```

#### 1D. Cập nhật MembersService — thêm `createMemberByPhone()`

```typescript
async createMemberByPhone(data: { phone: string }) {
  const qrCode = `QR-${nanoid(8).toUpperCase()}`;
  const referralCode = `ZDC-${nanoid(6).toUpperCase()}`;

  return this.prisma.member.create({
    data: {
      zaloId: `phone_${data.phone}`,  // placeholder vì schema yêu cầu unique
      phone: data.phone,
      qrCode,
      referralCode,
      status: 'verified',
      pointsBalance: 0,
      pointsEarned: 0,
      pointsSpent: 0,
    },
  });
}
```

> **Lưu ý Schema:** Field `zaloId` hiện là `@unique` và bắt buộc.  
> Vì chưa có OA để lấy zaloId thật → dùng giá trị placeholder `phone_{sdt}` để tránh lỗi.  
> Khi có OA sau này, sẽ cập nhật zaloId thật qua flow verify.

#### 1E. Cập nhật `auth.module.ts`

- Kiểm tra: `ZaloModule` vẫn import nhưng không gây lỗi (service chỉ throw khi gọi).
- Đảm bảo `MembersModule`, `ReferralsModule` đã được import.

---

### Phase 2: Frontend — Form Login SĐT

> **Files thay đổi:** `src/pages/login.tsx`, `src/stores/auth.ts`

#### 2A. Cập nhật `src/stores/auth.ts`

- [ ] Comment atom `loginActionAtom` cũ (gọi `/auth/zalo-login`)
- [ ] Tạo atom mới `phoneLoginActionAtom`:
  - Gọi `POST /auth/phone-login` với `{ phone, refCode? }`
  - Lưu JWT vào `localStorage` + cập nhật `tokenAtom`, `memberAtom`
- [ ] Cập nhật `MemberInfo` interface: bỏ bắt buộc `zaloId`, `zaloName`

```typescript
export const phoneLoginActionAtom = atom(
  null,
  async (get, set, { phone, refCode }: { phone: string; refCode?: string }) => {
    const response = await api.post('/auth/phone-login', { phone, refCode });
    const data = response.data;
    localStorage.setItem('accessToken', data.accessToken);
    set(tokenAtom, data.accessToken);
    set(memberAtom, data.member);
    return data;
  }
);
```

#### 2B. Cập nhật `src/pages/login.tsx`

- [ ] Comment toàn bộ code gọi ZMP SDK (`login()`, `getPhoneNumber()`)
- [ ] Thay bằng form nhập liệu:
  - Input SĐT (required, pattern 10 số VN)
  - Input Mã giới thiệu (optional)
  - Button "Đăng nhập"
- [ ] Logic mới:
  1. Đọc `?ref=` từ URL → nếu có, tự fill vào ô mã giới thiệu
  2. Validate SĐT (format 0xxx, 10 chữ số)
  3. Gọi `phoneLoginActionAtom({ phone, refCode })`
  4. Thành công → navigate `/dashboard`
  5. Lỗi → hiện snackbar

```tsx
// Đọc ref từ URL params khi component mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const urlRef = params.get('ref');
  if (urlRef) setRefCode(urlRef);
}, []);
```

#### 2C. Giữ nguyên `auth-guard.tsx`

- AuthGuard hoạt động dựa trên `tokenAtom` và `memberAtom` → không cần thay đổi
- Flow check auth qua `GET /auth/me` vẫn giữ nguyên

---

### Phase 3: Test End-to-End

#### Checklist

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Mở app lần đầu (chưa đăng nhập) | Hiện form Login SĐT |
| 2 | Nhập SĐT mới + không có ref → Đăng nhập | Tạo member mới, status=verified, có qr_code + referral_code. Vào Dashboard |
| 3 | Nhập SĐT mới + có ref (nhập tay) | Tạo member + tạo referral (pending). Vào Dashboard |
| 4 | Mở app qua link `?ref=ZDC-XXXXXX` + SĐT mới | Auto-fill ref, tạo member + referral (pending) |
| 5 | Nhập SĐT đã tồn tại (user cũ) | Đăng nhập thành công, cập nhật lastActiveAt. KHÔNG tạo referral mới |
| 6 | Nhập SĐT sai format | Hiện lỗi validate |
| 7 | Nhập mã ref không tồn tại | Đăng nhập OK nhưng referral bị skip (warn log) |
| 8 | Đóng app, mở lại (JWT còn hạn) | Tự động vào Dashboard (không qua Login) |
| 9 | JWT hết hạn | Quay về trang Login |

---

## 📁 Tóm tắt files thay đổi

### Backend (`member-system-zo-dut-can-be`)

| Action | File | Mô tả |
|--------|------|-------|
| **COMMENT** | `src/zalo/zalo.service.ts` | Comment body `verifyAccessToken()` & `decryptPhoneNumber()` |
| **COMMENT** | `src/auth/auth.service.ts` | Comment `zaloLogin()`, thêm `phoneLogin()` |
| **COMMENT** | `src/auth/auth.controller.ts` | Comment route `zalo-login`, thêm `phone-login` |
| **EDIT** | `src/auth/strategies/jwt.strategy.ts` | `validate()` trả `{ id, phone }` |
| **NEW** | `src/auth/dto/phone-login.dto.ts` | DTO validate SĐT + refCode |
| **EDIT** | `src/members/members.service.ts` | Thêm `createMemberByPhone()` |
| **COMMENT** | `.env` | Comment `ZALO_APP_SECRET`, `ZALO_MOCK_MODE` |

### Frontend (`member-system-zo-dut-can-zma`)

| Action | File | Mô tả |
|--------|------|-------|
| **COMMENT** | `src/pages/login.tsx` | Comment code ZMP SDK, thay bằng form SĐT |
| **COMMENT** | `src/stores/auth.ts` | Comment `loginActionAtom`, thêm `phoneLoginActionAtom` |
| **GIỮ** | `src/components/auth-guard.tsx` | Không đổi |
| **GIỮ** | `src/services/api.ts` | Không đổi |
| **GIỮ** | `src/components/layout.tsx` | Không đổi |

### Plan files (GIỮ NGUYÊN)

| File | Status |
|------|--------|
| `plans/zalo-login-ui-roadmap.md` | ✅ Giữ nguyên (tham khảo khi có OA) |
| `plans/phase-01 → 07` | ✅ Giữ nguyên |
| `plans/plan.md` | ✅ Giữ nguyên |

---

## ⚠️ Lưu ý quan trọng

### Schema constraint — `zaloId` là required & unique
- Hiện tại field `zaloId` trong bảng `members` là `@unique` và bắt buộc
- **Giải pháp tạm:** Dùng `phone_{sdt}` làm placeholder cho `zaloId`
- **Giải pháp tối ưu (tương lai):** Migration đổi `zaloId` thành optional khi có OA

### Bảo mật
- Luồng SĐT này **không xác minh OTP** → phù hợp cho giai đoạn phát triển/demo
- Khi production, nên bật xác minh OTP hoặc bật lại luồng Zalo OA

### Referral logic
- `processReferral()` đã có đầy đủ logic: kiểm tra self-referral, kiểm tra duplicate, tạo record pending → **KHÔNG cần sửa**
- Referral chỉ được tạo khi user MỚI đăng ký. User cũ đăng nhập lại sẽ KHÔNG tạo thêm referral

---

## 🗓️ Thứ tự triển khai

```
Phase 1A (Comment code Zalo OA)        ─── 15 phút
Phase 1B (DTO mới)                     ─── 5 phút
Phase 1C (phoneLogin trong AuthService)─── 15 phút
Phase 1D (createMemberByPhone)         ─── 10 phút
Phase 1E (Module check)                ─── 5 phút
Phase 2A (Auth store update)           ─── 10 phút
Phase 2B (Login page UI)               ─── 20 phút
Phase 2C (AuthGuard — giữ nguyên)      ─── 0 phút
Phase 3  (Test E2E)                    ─── 20 phút
                                       ─────────────
                                       ~100 phút tổng
```
