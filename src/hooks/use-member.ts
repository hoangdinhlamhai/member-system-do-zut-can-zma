import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
  activeTabAtom, 
  memberAtom, 
  redeemItemAtom, 
  rewardsAtom, 
  statsAtom, 
  refereesAtom, 
  timelineAtom,
  timelineLoadingAtom,
  vouchersAtom,
  discountTiersAtom,
  fetchRefereesAtom,
  fetchDashboardAtom,
  fetchTimelineAtom,
  fetchRewardsAtom,
  fetchDiscountTiersAtom,
  fetchVouchersAtom,
  dashboardLoadingAtom,
} from '../stores/member-store';

export const useMember = () => {
  const member = useAtomValue(memberAtom);
  return { member, isLoading: !member };
};

export const useMemberStats = () => {
  const stats = useAtomValue(statsAtom);
  return { stats, isLoading: !stats };
};

export const useRewards = () => {
  const rewards = useAtomValue(rewardsAtom);
  return { rewards, isLoading: !rewards };
};

export const useReferees = () => {
  const referees = useAtomValue(refereesAtom);
  return { referees, isLoading: !referees };
};

export const useFetchReferees = () => {
  const fetchReferees = useSetAtom(fetchRefereesAtom);
  return { fetchReferees };
};

export const useFetchDashboard = () => {
  const fetchDashboard = useSetAtom(fetchDashboardAtom);
  return { fetchDashboard };
};

export const useFetchTimeline = () => {
  const fetchTimeline = useSetAtom(fetchTimelineAtom);
  return { fetchTimeline };
};

export const useFetchRewards = () => {
  const fetchRewards = useSetAtom(fetchRewardsAtom);
  return { fetchRewards };
};

export const useFetchDiscountTiers = () => {
  const fetchDiscountTiers = useSetAtom(fetchDiscountTiersAtom);
  return { fetchDiscountTiers };
};

export const useFetchVouchers = () => {
  const fetchVouchers = useSetAtom(fetchVouchersAtom);
  return { fetchVouchers };
};

export const useDashboardLoading = () => {
  const isLoading = useAtomValue(dashboardLoadingAtom);
  return isLoading;
};

export const useTimeline = () => {
  const timeline = useAtomValue(timelineAtom);
  const isLoading = useAtomValue(timelineLoadingAtom);
  return { timeline, isLoading };
};

export const useVouchers = () => {
  const vouchers = useAtomValue(vouchersAtom);
  return { vouchers, isLoading: !vouchers };
};

export const useDiscountTiers = () => {
  const discountTiers = useAtomValue(discountTiersAtom);
  return { discountTiers, isLoading: !discountTiers };
};

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  return { activeTab, setActiveTab };
};

export const useRedeemItem = () => {
  const redeem = useSetAtom(redeemItemAtom);
  return { redeem };
};
