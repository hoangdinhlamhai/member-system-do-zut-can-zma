# Phase 04: Giới Thiệu Bạn Bè (Referral Page)
Status: ✅ Complete

## UI Layout

```
┌─ Header ─────────────────────────────────────┐
│                                               │
│ ┌─ MÃ GIỚI THIỆU ─────────────────────────┐ │
│ │ Mã: ZDC-REF-001         [📋 Copy]       │ │
│ │ Chia sẻ ngay →                            │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ CÁCH HOẠT ĐỘNG ─────────────────────────┐ │
│ │ 1. Chia sẻ mã cho bạn bè                 │ │
│ │ 2. Bạn bè đăng ký + ăn uống              │ │
│ │ 3. Mỗi bill bạn nhận 5%                  │ │
│ │                                           │ │
│ │ VD: Bạn ăn 500.000đ → Bạn nhận 25.000đ   │ │
│ │     (= 25 điểm). Không giới hạn!          │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ THỐNG KÊ ────────────────────────────────┐ │
│ │ 👥 Đã giới thiệu: 5 người                │ │
│ │ ⏳ Chờ bill đầu tiên: 2 người             │ │
│ │ 💰 Tổng thu nhập referral: 125.000đ       │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ DANH SÁCH BẠN BÈ ───────────────────────┐ │
│ │ ✅ Trần B — 3 bills — 20K earned         │ │
│ │ ✅ Lê C   — 2 bills — 20K earned         │ │
│ │ ⏳ Phạm D — chưa có bill                 │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

## Tasks
1. [x] `ReferralCodeCard` — hiện mã, nút copy, nút share (Zalo API)
2. [x] `HowItWorks` — 3 bước + ví dụ tính tiền
3. [x] `ReferralStats` — số bạn đã giới thiệu, chờ bill, tổng kiếm được
4. [x] `ReferralFriendList` — danh sách bạn với status (active/pending)
5. [x] Assemble `pages/referral.tsx`

## Files
- `+ src/components/referral/referral-code-card.tsx`
- `+ src/components/referral/how-it-works.tsx`
- `+ src/components/referral/referral-stats.tsx`
- `+ src/components/referral/referral-friend-list.tsx`
- `~ src/pages/referral.tsx`

## Notes
- Referral code từ `Member.referralCode`
- Status: pending (chưa bill) vs active (đã có ≥1 bill)
- 5% earning = `Tier.referralBonusPercent` (default 5%, có thể khác theo tier)
