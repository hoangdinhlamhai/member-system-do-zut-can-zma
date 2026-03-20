# Phase 03: Dashboard Page
Status: ⬜

## UI Layout (scroll vertical)

```
┌─ Header: "Zô Dứt Cạn" + Avatar ─────────────┐
│                                                │
│ ┌─ THÔNG TIN HẠNG ──────────────────────────┐ │
│ │ [GOLD] ★★★★  ×1.5 multiplier              │ │
│ │ ████████████░░░  75%                       │ │
│ │ Chi tiêu trọn đời: 12,500,000đ            │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ ĐIỂM HIỆN CÓ ────────────────────────────┐ │
│ │       ⭐ 2,450 điểm                        │ │
│ │    Đổi ngay: Giảm 10% bill →               │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ DOANH SỐ THÁNG NÀY ─────────────────────┐ │
│ │ 🧾 Tự tạo:     1,200,000đ  (3 bill)       │ │
│ │ 👥 Giới thiệu:   800,000đ  (5 bill F1)    │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ CHI TIẾT F1 ─────────────────────────────┐ │
│ │ 👤 Trần B — 3 bill — 400K — bạn: 20K     │ │
│ │ 👤 Lê C   — 2 bill — 400K — bạn: 20K     │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ TIMELINE GIAO DỊCH ──────────────────────┐ │
│ │ 12/03 🧾 Bill #123 — 320K — +32 điểm      │ │
│ │ 11/03 👥 Trần B bill — 200K — +10 điểm    │ │
│ │ 10/03 🧾 Bill #122 — 180K — +18 điểm      │ │
│ └────────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

## Overview
Dựa trên specs file v2, Dashboard không còn dùng để scroll xuống các section mà chỉ tập trung hiển thị tóm tắt thông tin hạng, điểm số, và transaction log.

## Tasks
1. [x] Update `src/types/member.ts`: Thêm `Transaction`, `ReferralEarning`, sửa `stats` properties
2. [x] Thêm Mock Data cho F1 List, Referral Earnings, Transactions vào `src/mock/data.ts`
3. [x] `TierInfoCard.tsx` — hiển thị hạng, multiplier `x1.5`, thanh progress bar
4. [x] `PointsCard.tsx` — nổi bật số điểm lớn, button bấm qua trang đổi quà
5. [x] `MonthlySalesCard.tsx` — thống kê hóa đơn tự gọi món và hóa đơn F1
6. [x] `F1DetailsList.tsx` — danh sách tốp 3 F1
7. [x] `TransactionTimeline.tsx` — trộn giao dịch mua và giao dịch hoa hồng

## Files
- `+ src/components/dashboard/tier-info-card.tsx`
- `+ src/components/dashboard/points-card.tsx`
- `+ src/components/dashboard/monthly-sales.tsx`
- `+ src/components/dashboard/f1-details.tsx`
- `+ src/components/dashboard/transaction-timeline.tsx`
- `~ src/types/member.ts` — thêm Transaction, ReferralEarning types
- `~ src/mock/data.ts` — thêm mock transactions, referral earnings
- `~ src/pages/dashboard.tsx`

## Notes
- Tier dựa trên `lifetimeSpending` (from Prisma Member model), KHÔNG phải points
- Multiplier từ `Tier.pointsMultiplier`
- Doanh số tự tạo = SUM(transactions WHERE memberId=me AND month=current)
- Doanh số giới thiệu = SUM(referralEarnings WHERE referrerId=me AND month=current)
- F1 = Member referred by me (referrals WHERE referrerId=me)
