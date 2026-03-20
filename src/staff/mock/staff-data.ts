// ══════════════════════════════════════════════════════════
// Mock Data cho Staff App - Zô Dứt Cạn
// ══════════════════════════════════════════════════════════

export interface StaffUser {
  id: string;
  fullName: string;
  phone: string;
  role: 'cashier' | 'store_manager';
  branchName: string;
  branchId: string;
  avatar?: string;
}

export interface VoucherInfo {
  voucherCode: string;
  memberName: string;
  memberTier: string;
  tierColor: string;
  rewardType: string;
  discountPercent: number;
  expiresAt: string;
  status: 'valid' | 'expired' | 'used';
}

export interface PendingBill {
  id: string;
  staffName: string;
  memberName: string;
  memberPhone: string;
  billCode: string;
  amount: number;
  billImageUrl: string;
  createdAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  rejectReason?: string;
}

// ─── Staff đang đăng nhập (giả lập) ───────────────────
export const MOCK_CURRENT_STAFF: StaffUser = {
  id: '00000000-0000-0000-0000-000000000101',
  fullName: 'Nguyễn Văn An',
  phone: '0912345678',
  role: 'store_manager', // Đổi sang 'cashier' để test ẩn nút Duyệt Bill
  branchName: 'Chi nhánh Nguyễn Huệ',
  branchId: '00000000-0000-0000-0000-000000000001',
};

// ─── Kết quả quét QR voucher (giả lập) ────────────────
export const MOCK_VOUCHER_SCAN_RESULT: VoucherInfo = {
  voucherCode: 'ZDC-VCR-2026-A1B2C3',
  memberName: 'Anh A',
  memberTier: 'Vàng',
  tierColor: '#FFD700',
  rewardType: 'Giảm 10%',
  discountPercent: 10,
  expiresAt: '2026-04-15T23:59:59+07:00',
  status: 'valid',
};

// ─── Danh sách bill chờ duyệt (giả lập) ──────────────
export const MOCK_PENDING_BILLS: PendingBill[] = [
  {
    id: 'bill-001',
    staffName: 'Trần Thị Bình',
    memberName: 'Nguyễn Minh Tuấn',
    memberPhone: '0901111222',
    billCode: 'BILL-20260316-001',
    amount: 350000,
    billImageUrl: 'https://placehold.co/400x600/f5e6d3/8B4513?text=Bill+350k',
    createdAt: '2026-03-16T15:30:00+07:00',
    status: 'pending_review',
  },
  {
    id: 'bill-002',
    staffName: 'Trần Thị Bình',
    memberName: 'Lê Hoàng Nam',
    memberPhone: '0903333444',
    billCode: 'BILL-20260316-002',
    amount: 520000,
    billImageUrl: 'https://placehold.co/400x600/f5e6d3/8B4513?text=Bill+520k',
    createdAt: '2026-03-16T16:45:00+07:00',
    status: 'pending_review',
  },
  {
    id: 'bill-003',
    staffName: 'Nguyễn Văn An',
    memberName: 'Phạm Thị Hoa',
    memberPhone: '0905555666',
    billCode: 'BILL-20260316-003',
    amount: 180000,
    billImageUrl: 'https://placehold.co/400x600/f5e6d3/8B4513?text=Bill+180k',
    createdAt: '2026-03-16T17:10:00+07:00',
    status: 'pending_review',
  },
  {
    id: 'bill-004',
    staffName: 'Nguyễn Văn An',
    memberName: 'Trương Công Đạt',
    memberPhone: '0907777888',
    billCode: 'BILL-20260315-010',
    amount: 1200000,
    billImageUrl: 'https://placehold.co/400x600/f5e6d3/8B4513?text=Bill+1.2M',
    createdAt: '2026-03-15T20:00:00+07:00',
    status: 'pending_review',
  },
];

// ─── Helpers ──────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}
