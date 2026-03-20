# Phase 05: Đổi Quà Page
Status: ✅ Complete

## UI Layout (2 tabs bên trong page)

```
┌─ Header ─────────────────────────────────────┐
│ Điểm hiện có: ⭐ 2,450                       │
│                                               │
│ [Giảm giá bill]  [Đổi quà]  [Voucher của tôi]│
│                                               │
│ === TAB: Giảm giá bill ===                    │
│ ┌───────────────────────────────────────────┐ │
│ │ 💰 100 điểm → Giảm 5% (tối đa 100K)     │ │
│ │                              [Đổi ngay]  │ │
│ ├───────────────────────────────────────────┤ │
│ │ 💰 200 điểm → Giảm 10% (tối đa 200K)    │ │
│ │                              [Đổi ngay]  │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ === TAB: Đổi quà ===                          │
│ ┌───────────────────────────────────────────┐ │
│ │ ☕ Trà đào cam sả     350 điểm  [Đổi]    │ │
│ │ 🍦 Kem tươi           200 điểm  [Đổi]    │ │
│ │ 🎫 Voucher 50K       1000 điểm  [Đổi]    │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ === TAB: Voucher của tôi ===                  │
│ ┌───────────────────────────────────────────┐ │
│ │ 🎫 Giảm 5% — Code: ZDC-V-001            │ │
│ │    Hết hạn: 19/03/2026   [Xem QR]        │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

## Flow đổi
1. User chọn "Đổi ngay" → Confirm modal
2. Trừ điểm → Tạo Redemption record (mock) với `voucherCode`
3. Voucher có QR code → hiện ở tab "Voucher của tôi"
4. Voucher hết hạn 7 ngày (rewards) hoặc theo config (discount)

## Tasks
1. [x] `DiscountBillTab` — 2 discount tiers (5%, 10%) + nút đổi
2. [x] `RewardListTab` — danh sách quà tặng từ `RewardCatalog` + nút đổi
3. [x] `MyVouchersTab` — danh sách voucher đã đổi + QR code + expiry
4. [x] `RedeemModal` — confirm dialog khi đổi
5. [x] Update Jotai store: thêm `myVouchersAtom`, redeem logic tạo voucher
6. [x] Assemble `pages/rewards.tsx` — 3 tabs

## Files
- `+ src/components/rewards/discount-bill-tab.tsx`
- `+ src/components/rewards/reward-list-tab.tsx`
- `+ src/components/rewards/my-vouchers-tab.tsx`
- `+ src/components/rewards/redeem-modal.tsx`
- `~ src/stores/member-store.ts` — thêm voucher atoms + redeem actions
- `~ src/types/member.ts` — thêm Voucher, DiscountTier types
- `~ src/mock/data.ts` — thêm mock discountTiers, vouchers
- `~ src/pages/rewards.tsx`

## Notes
- `DiscountTier` model: pointsRequired, discountPercent, maxDiscountAmount
- `Redemption` model: type (reward/discount), voucherCode, expiresAt
- QR data: `ZDC:VOUCHER:{voucherCode}`
