import { atom } from 'jotai';
import { Member, MemberStats, Reward, RefereeStat, Voucher, DiscountTier } from '../types/member';
import { api } from '../services/api';

// Type cho timeline item từ API
export interface APITimelineItem {
  type: 'personal_bill' | 'referral_bonus';
  id: string;
  title: string;
  amount?: number;
  points?: number;
  date: string;
}

// State atoms — start empty, filled by API
export const memberAtom = atom<Member | null>(null);
export const statsAtom = atom<MemberStats | null>(null);
export const rewardsAtom = atom<Reward[]>([]);
export const activeTabAtom = atom<string>('dashboard');
export const refereesAtom = atom<RefereeStat[]>([]);
export const timelineAtom = atom<APITimelineItem[]>([]);
export const timelineLoadingAtom = atom<boolean>(false);
export const vouchersAtom = atom<Voucher[]>([]);
export const discountTiersAtom = atom<DiscountTier[]>([]);

// Loading state for dashboard
export const dashboardLoadingAtom = atom<boolean>(true);

/**
 * Fetch dashboard từ API: /api/v1/members/me/dashboard
 */
export const fetchDashboardAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(dashboardLoadingAtom, true);
      const response = await api.get('/api/v1/members/me/dashboard');
      const { member, stats } = response.data;

      if (member) {
        set(memberAtom, member);
      }
      if (stats) {
        set(statsAtom, stats);
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch dashboard:', error);
      throw error;
    } finally {
      set(dashboardLoadingAtom, false);
    }
  }
);

export const fetchRefereesAtom = atom(
  null,
  async (_get, set) => {
    const response = await api.get<RefereeStat[]>('/referrals/my-referees');
    set(refereesAtom, response.data);
    return response.data;
  }
);

/**
 * Fetch timeline từ API: GET /api/v1/members/me/timeline
 */
export const fetchTimelineAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(timelineLoadingAtom, true);
      const response = await api.get('/api/v1/members/me/timeline?page=1&limit=50');
      set(timelineAtom, response.data.data || []);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch timeline:', error);
      throw error;
    } finally {
      set(timelineLoadingAtom, false);
    }
  }
);

/**
 * Fetch rewards catalog từ API: GET /api/v1/members/rewards
 */
export const fetchRewardsAtom = atom(
  null,
  async (_get, set) => {
    try {
      const response = await api.get<Reward[]>('/api/v1/members/rewards');
      set(rewardsAtom, response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch rewards:', error);
      return [];
    }
  }
);

/**
 * Fetch discount tiers từ API: GET /api/v1/members/discount-tiers
 */
export const fetchDiscountTiersAtom = atom(
  null,
  async (_get, set) => {
    try {
      const response = await api.get<DiscountTier[]>('/api/v1/members/discount-tiers');
      set(discountTiersAtom, response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch discount tiers:', error);
      return [];
    }
  }
);

/**
 * Fetch my vouchers từ API: GET /api/v1/members/me/vouchers
 */
export const fetchVouchersAtom = atom(
  null,
  async (_get, set) => {
    try {
      const response = await api.get<Voucher[]>('/api/v1/members/me/vouchers');
      set(vouchersAtom, response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch vouchers:', error);
      return [];
    }
  }
);

// Action atoms
export const redeemItemAtom = atom(
  null,
  async (get, set, payload: { type: 'reward' | 'discount'; id: string }) => {
    const member = get(memberAtom);
    if (!member) return { success: false, message: 'Chưa đăng nhập' };

    try {
      const response = await api.post('/api/v1/members/me/redeem', {
        type: payload.type,
        itemId: payload.id,
      });

      const result = response.data;

      // Update local member state with new balance from backend
      set(memberAtom, {
        ...member,
        pointsBalance: result.newBalance,
        pointsSpent: (member.pointsSpent ?? 0) + result.pointsSpent,
      });

      // Add new voucher to local vouchers list
      const currentVouchers = get(vouchersAtom);
      set(vouchersAtom, [
        {
          id: result.id,
          memberId: result.memberId,
          type: result.type,
          rewardId: result.rewardId ?? undefined,
          discountTierId: result.discountTierId ?? undefined,
          title: result.title,
          description: result.description || '',
          voucherCode: result.voucherCode,
          qrData: result.qrData,
          status: 'active' as const,
          expiresAt: result.expiresAt,
          createdAt: result.createdAt,
        },
        ...currentVouchers,
      ]);

      // Refresh rewards catalog (quantityRedeemed may have changed)
      if (payload.type === 'reward') {
        const rewardsResponse = await api.get<Reward[]>('/api/v1/members/rewards');
        set(rewardsAtom, rewardsResponse.data);
      }

      const messageStr = payload.type === 'reward'
        ? 'Đổi quà thành công! Kiểm tra Tab Voucher của tôi.'
        : 'Đổi mã giảm giá thành công! Kiểm tra Tab Voucher của tôi.';

      return { success: true, message: messageStr };
    } catch (error: any) {
      const errorCode = error.response?.data?.message || '';
      const errorMessages: Record<string, string> = {
        INSUFFICIENT_POINTS: 'Bạn chưa đủ điểm!',
        REWARD_OUT_OF_STOCK: 'Quà đã hết, vui lòng chọn quà khác.',
        REWARD_LIMIT_REACHED: 'Bạn đã đổi quà này đủ số lần cho phép.',
        REWARD_NOT_FOUND: 'Không tìm thấy quà tặng.',
        REWARD_EXPIRED: 'Quà đã hết hạn đổi.',
        REWARD_NOT_STARTED: 'Chương trình đổi quà chưa bắt đầu.',
        DISCOUNT_TIER_NOT_FOUND: 'Không tìm thấy gói giảm giá.',
        MEMBER_NOT_FOUND: 'Không tìm thấy thành viên.',
      };

      const message = errorMessages[errorCode] || 'Có lỗi xảy ra, vui lòng thử lại.';
      console.error('Lỗi khi đổi quà:', errorCode, error);
      return { success: false, message };
    }
  }
);

