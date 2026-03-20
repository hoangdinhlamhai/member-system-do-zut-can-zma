import { Member, MemberStats, Reward, Transaction, ReferralEarning, RefereeStat, TimelineItem, DiscountTier, Voucher } from '../types/member';

export const mockMember: Member = {
  id: '81e4b679-b88d-4ad9-90d5-1f9e29bf4290',
  zaloId: '2026123456789',
  zaloName: 'Nguyễn Văn A',
  zaloAvatar: 'https://i.pravatar.cc/150?u=nguyenvana',
  phone: '0987654321',
  fullName: 'Nguyễn Văn A',
  status: 'verified',
  qrCode: 'ZDC-2026-001',
  referralCode: 'ZDC-REF-001',
  
  pointsBalance: 2450,
  pointsEarned: 15450,
  pointsSpent: 13000,
  
  lifetimeSpending: 12500000,
  monthlySpending: 320000,
  
  tierName: 'gold',
  tierMultiplier: 1.5,
  referralBonusPercent: 5,
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockStats: MemberStats = {
  totalVisits: 28,
  monthlyVisits: 4,
  pointsEarned: 15450,
  pointsSpent: 13000,
  nextTierSpendingRequired: 15000000 - 12500000, // 2.500.000 needed for Platinum
  monthlySelfSales: 1200000,
  monthlyReferralSales: 800000,
};

// ... keep mockRewards as is ...
export const mockRewards: Reward[] = [
  {
    id: 'f1ca1f54-bd69-4ebd-a8db-ac27fa5e12f0',
    name: 'Cà phê sữa đá size M',
    description: 'Đổi miễn phí 1 ly cà phê sữa đá đậm đà.',
    pointsRequired: 200,
    imageUrl: '☕',
    type: 'drink',
    quantityRedeemed: 15,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z'
  },
  {
    id: '1c6c57e6-f5b1-4fce-bc8c-4a11f2a36df1',
    name: 'Trà đào cam sả size L',
    description: 'Giải nhiệt cực đã, topping đào miếng chua ngọt.',
    pointsRequired: 350,
    imageUrl: '🍹',
    type: 'drink',
    quantityRedeemed: 5,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z'
  },
  {
    id: 'dd73b6de-bb09-41e9-9be8-c64dc15f3e70',
    name: 'Bánh sừng trâu bơ tỏi',
    description: 'Bánh croissant giòn thơm bơ tỏi.',
    pointsRequired: 400,
    imageUrl: '🥐',
    type: 'food',
    quantityRedeemed: 20,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z'
  },
  {
    id: '14bdf7df-4ce5-41e7-beeb-9d6e46d3f278',
    name: 'Voucher giảm 50K',
    description: 'Giảm trực tiếp 50K cho hóa đơn từ 200K.',
    pointsRequired: 1000,
    imageUrl: '🎫',
    type: 'voucher',
    quantityRedeemed: 2,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z'
  },
  {
    id: '7d56e297-f0b4-4ee9-b1d3-35ac094c92ba',
    name: 'Bình giữ nhiệt Zô Dứt Cạn',
    description: 'Bình giữ nhiệt cao cấp in logo.',
    pointsRequired: 5000,
    imageUrl: '🎁',
    type: 'gift',
    quantityRedeemed: 0,
    isActive: false,
    validUntil: '2026-12-31T23:59:59Z'
  }
];

export const mockReferees: RefereeStat[] = [
  { refereeId: 'ref-01', refereeName: 'Trần B', billCount: 3, totalBillAmount: 400000, totalEarned: 20000 },
  { refereeId: 'ref-02', refereeName: 'Lê C', billCount: 2, totalBillAmount: 400000, totalEarned: 20000 },
  { refereeId: 'ref-03', refereeName: 'Phạm D', billCount: 0, totalBillAmount: 0, totalEarned: 0 },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn-1', memberId: mockMember.id, branchId: 'b-1', amount: 350000, finalAmount: 320000, pointsEarned: 32, createdAt: '2026-03-12T10:30:00Z' },
  { id: 'txn-2', memberId: mockMember.id, branchId: 'b-1', amount: 180000, finalAmount: 180000, pointsEarned: 18, createdAt: '2026-03-10T14:15:00Z' },
];

export const mockReferralEarnings: ReferralEarning[] = [
  { id: 'earn-1', referralId: 'ref-rel-1', referrerId: mockMember.id, refereeId: 'ref-01', refereeName: 'Trần B', transactionId: 'txn-ref-1', billAmount: 200000, earnPercent: 5, earnAmount: 10000, pointsAwarded: 10, createdAt: '2026-03-11T18:20:00Z' },
];

export const mockTimeline: TimelineItem[] = [
  { type: 'transaction', id: 'tl-1', date: '2026-03-12T10:30:00Z', data: mockTransactions[0] },
  { type: 'referral_earning', id: 'tl-2', date: '2026-03-11T18:20:00Z', data: mockReferralEarnings[0] },
  { type: 'transaction', id: 'tl-3', date: '2026-03-10T14:15:00Z', data: mockTransactions[1] },
];

export const mockDiscountTiers: DiscountTier[] = [
  { id: 'dt-1', pointsRequired: 100, discountPercent: 5, maxDiscountAmount: 100000, description: 'Giảm 5% cho hóa đơn' },
  { id: 'dt-2', pointsRequired: 200, discountPercent: 10, maxDiscountAmount: 200000, description: 'Giảm 10% cho hóa đơn' },
];

export const mockVouchers: Voucher[] = [
  {
    id: 'v-1',
    memberId: mockMember.id,
    type: 'discount',
    discountTierId: 'dt-1',
    title: 'Giảm 5% Tổng Bill',
    description: 'Giảm tối đa 100K. Áp dụng toàn hệ thống.',
    voucherCode: 'ZDC-D-0921',
    qrData: 'ZDC:VOUCHER:ZDC-D-0921',
    status: 'active',
    expiresAt: '2026-03-19T23:59:59Z',
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    id: 'v-2',
    memberId: mockMember.id,
    type: 'reward',
    rewardId: 'f1ca1f54-bd69-4ebd-a8db-ac27fa5e12f0',
    title: 'Cà phê sữa đá size M',
    description: 'Đổi miễn phí 1 ly cà phê sữa đá đậm đà.',
    imageUrl: '☕',
    voucherCode: 'ZDC-R-5542',
    qrData: 'ZDC:VOUCHER:ZDC-R-5542',
    status: 'used',
    expiresAt: '2026-03-10T23:59:59Z',
    redeemedAt: '2026-03-09T15:30:00Z',
    createdAt: '2026-03-03T10:00:00Z'
  }
];
