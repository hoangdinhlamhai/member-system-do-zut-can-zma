export interface Member {
  id: string;
  zaloId: string;
  zaloName: string;
  zaloAvatar: string;
  phone: string;
  fullName: string;
  status: string;
  qrCode: string;
  referralCode: string;
  
  pointsBalance: number;
  pointsEarned: number;
  pointsSpent: number;
  
  lifetimeSpending: number;
  monthlySpending: number;
  
  // Custom fields computed by backend or mapped for frontend needs
  tierId?: string;
  tierName: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | string;
  tierDisplayName?: string; // Tên tiếng Việt: Đồng, Bạc, Vàng, Bạch Kim, Kim Cương
  tierMultiplier?: number;
  tierThemeConfig?: {       // Theme từ DB
    color: string;
    icon: string;
    gradient: string;
  } | null;
  referralBonusPercent?: number;
  createdAt: string;
}

export interface Reward {
  id: string;
  brandId?: string;
  name: string; 
  description: string;
  imageUrl: string; 
  type: string; 
  pointsRequired: number; 
  quantityLimit?: number;
  quantityRedeemed: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
}

export interface MemberStats {
  totalVisits: number;      
  monthlyVisits: number;    
  pointsEarned: number;
  pointsSpent: number;
  nextTierSpendingRequired: number; // Tiền cần để lên hạng (spending-based)
  monthlySelfSales: number;     // Doanh số tự tạo trong tháng
  monthlyReferralSales: number; // Doanh số F1 trong tháng
}

// Giao dịch cá nhân
export interface Transaction {
  id: string;
  memberId: string;
  branchId: string;
  amount: number;
  finalAmount: number;
  pointsEarned: number; // Mapped field from point_transactions for UI convenience
  createdAt: string;
}

// Chi tiết hoa hồng từ referee (F1)
export interface ReferralEarning {
  id: string;
  referralId: string;
  referrerId: string;  // Người giới thiệu (mình)
  refereeId: string;   // Người được giới thiệu (bạn bè)
  refereeName: string; // Tên bạn bè (mapped for UI)
  transactionId: string;
  billAmount: number;  // Giá trị bill
  earnPercent: number; // Phần trăm (ví dụ 5%)
  earnAmount: number;  // Tiền thưởng tương đương
  pointsAwarded: number; // Số điểm thực nhận (1 điểm = 1000đ => điểm = earnAmount/1000)
  createdAt: string;
}

// Thống kê từng cá nhân F1
export interface RefereeStat {
  refereeId: string;
  refereeName: string;
  billCount: number;
  totalBillAmount: number;
  totalEarned: number; // Tiền bạn dã nhận từ F1 này
}

// Timeline item mixed type
export type TimelineItemType = 'transaction' | 'referral_earning';

export interface BaseTimelineItem {
  id: string;
  type: TimelineItemType;
  date: string; // ISO string
}

export interface TransactionTimelineItem extends BaseTimelineItem {
  type: 'transaction';
  data: Transaction;
}

export interface EarningTimelineItem extends BaseTimelineItem {
  type: 'referral_earning';
  data: ReferralEarning;
}

export type TimelineItem = TransactionTimelineItem | EarningTimelineItem;

// Discount Tier cho viec giam gia hoa don
export interface DiscountTier {
  id: string;
  pointsRequired: number;
  discountPercent: number;
  maxDiscountAmount: number;
  description: string;
}

// Voucher da doi
export interface Voucher {
  id: string;
  memberId: string;
  type: 'reward' | 'discount'; // Phan biet giam gia voi qua tang hien vat
  rewardId?: string; // Neu la doi qua
  discountTierId?: string; // Neu la giam gia
  
  title: string;
  description: string;
  imageUrl?: string;
  
  voucherCode: string;
  qrData: string; // "ZDC:VOUCHER:{voucherCode}"
  
  status: 'active' | 'used' | 'expired';
  expiresAt: string;
  redeemedAt?: string;
  createdAt: string;
}
