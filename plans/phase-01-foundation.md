# Phase 01: Foundation & Design System
Status: ✅ Complete
Dependencies: None

## Objective
Thiết lập nền tảng thiết kế (Design System), cấu trúc thư mục, mock data, và các utilities cần thiết cho toàn bộ Homepage.

## Requirements

### Functional
- [x] Có design tokens (CSS variables) cho toàn bộ app
- [x] Có mock data giả lập thông tin thành viên, quà tặng
- [x] Có TypeScript types cho các entity chính
- [x] Có Jotai store cơ bản

### Non-Functional
- [x] Code TypeScript strict
- [x] Responsive trên mobile (320px - 428px)
- [x] Dark mode support qua ZaUI theme

## Implementation Steps

### 1. Tạo Design Tokens (`src/css/variables.scss`)
- [ ] Định nghĩa CSS custom properties cho colors, spacing, typography, shadows
- [ ] Color palette: Caramel/Coffee theme (ấm, sang trọng, F&B)
- [ ] Typography scale: Title, Heading, Body, Caption
- [ ] Spacing: 4px grid system
- [ ] Border radius: Rounded corners (8px, 12px, 16px, 24px)
- [ ] Shadows: 3 levels (sm, md, lg)

### 2. Cập nhật Global Styles (`src/css/app.scss`)
- [ ] Import variables.scss
- [ ] Reset & base styles cho ZMA
- [ ] Utility classes bổ sung (gradient text, glass effect...)
- [ ] Keyframe animations (fadeIn, slideUp, scaleIn)

### 3. Tạo TypeScript Types (`src/types/member.ts`)
```typescript
interface Member {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  totalSpent: number;
  joinDate: string;
  qrCode: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
  category: 'drink' | 'food' | 'voucher' | 'gift';
  available: boolean;
  expiryDate: string;
}

interface MemberStats {
  totalVisits: number;
  monthlyVisits: number;
  pointsEarned: number;
  pointsUsed: number;
  nextTierPoints: number;
}
```

### 4. Tạo Mock Data (`src/mock/data.ts`)
- [ ] Mock member info (hạng Gold, 2,450 điểm)
- [ ] Mock rewards list (8-10 quà tặng đa dạng)
- [ ] Mock stats (visits, points history)

### 5. Tạo Jotai Store (`src/stores/member-store.ts`)
- [ ] `memberAtom` - thông tin thành viên
- [ ] `rewardsAtom` - danh sách quà
- [ ] `statsAtom` - thống kê
- [ ] `activeTabAtom` - tab đang active trên homepage

### 6. Tạo Custom Hook (`src/hooks/use-member.ts`)
- [ ] `useMember()` - trả về member info + loading state
- [ ] `useRewards()` - trả về rewards list
- [ ] `useMemberStats()` - trả về stats

### 7. Tạo folder structure
- [ ] Tạo các thư mục con: `components/dashboard/`, `components/intro/`, `components/rewards/`, `components/qr/`, `hooks/`, `stores/`, `types/`, `mock/`

### 8. Tạo Header Component (`src/components/header.tsx`)
- [ ] Logo "Zô Dứt Cạn" bên trái
- [ ] Avatar thành viên bên phải
- [ ] Background gradient (caramel theme)
- [ ] Hiệu ứng glassmorphism

## Files to Create/Modify
- `src/css/variables.scss` - **CREATE** - Design tokens
- `src/css/app.scss` - **MODIFY** - Global styles
- `src/types/member.ts` - **CREATE** - TypeScript types
- `src/mock/data.ts` - **CREATE** - Mock data
- `src/stores/member-store.ts` - **CREATE** - Jotai atoms
- `src/hooks/use-member.ts` - **CREATE** - Custom hooks
- `src/components/header.tsx` - **CREATE** - Header component

## Test Criteria
- [ ] App vẫn chạy được (`zmp start`)
- [ ] CSS variables hiển thị đúng color palette
- [ ] Mock data load thành công qua Jotai
- [ ] Header render đúng với logo và avatar
- [ ] Responsive trên viewport 375px

## Notes
- ZMP SDK sử dụng `zmp-ui` components (Page, Box, Text, Button, Icon...)
- ZaUI có sẵn dark mode, đổi qua `zaui-theme` attribute
- TailwindCSS 3 đã có sẵn, dùng kết hợp với custom SCSS
- Không install package mới trong phase này (trừ khi cần icon library)

---
Next Phase: [Phase 02 - Dashboard Section](./phase-02-dashboard.md)
