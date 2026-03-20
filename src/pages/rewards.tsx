import React, { useState, useEffect } from "react";
import { Page, Box, Text } from "zmp-ui";
import Header from "@/components/header";
import bg from "@/static/bg.svg";

import DiscountBillTab from "@/components/rewards/discount-bill-tab";
import RewardListTab from "@/components/rewards/reward-list-tab";
import MyVouchersTab from "@/components/rewards/my-vouchers-tab";
import { useMember, useFetchRewards, useFetchDiscountTiers, useFetchVouchers } from "@/hooks/use-member";

const TABS = [
  { key: 'discount', label: 'Giảm bill' },
  { key: 'reward', label: 'Đổi quà' },
  { key: 'vouchers', label: 'Của tôi' },
];

function RewardsPage() {
  const { member } = useMember();
  const [activeTab, setActiveTab] = useState("discount");
  const { fetchRewards } = useFetchRewards();
  const { fetchDiscountTiers } = useFetchDiscountTiers();
  const { fetchVouchers } = useFetchVouchers();

  useEffect(() => {
    fetchRewards();
    fetchDiscountTiers();
    fetchVouchers();
  }, []);

  return (
    <Page className="page pb-[120px] relative overflow-x-hidden min-h-screen bg-cream dark:bg-dark-bg">
      <Box
        className="absolute top-0 left-0 right-0 h-[320px] bg-cover bg-bottom opacity-[0.06] dark:opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <Header />

      <Box className="relative z-10 w-full max-w-md mx-auto pt-[82px]">
        {/* Points Display */}
        <Box className="px-4 py-4 mb-3 flex flex-col items-center animate-fade-in">
          <Text className="text-sm font-medium text-text-muted dark:text-dark-muted mb-1.5">Điểm hiện có</Text>
          <Text className="text-4xl font-bold text-gradient tracking-tight">
            {member?.pointsBalance.toLocaleString()}
          </Text>
          <Text className="text-xs text-text-muted/50 dark:text-dark-muted/50 mt-0.5">điểm tích lũy</Text>
        </Box>

        {/* Tab Switcher */}
        <Box className="px-4 mb-4 animate-slide-up">
          <Box className="bg-white/60 dark:bg-dark-card/60 p-1 rounded-2xl flex gap-1 border border-black/[0.03] dark:border-dark-border shadow-soft"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {TABS.map((tab) => (
              <Box
                key={tab.key}
                className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-xl transition-all duration-300 ease-spring cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-dark-surface shadow-soft text-primary'
                    : 'text-text-muted dark:text-dark-muted hover:text-text-main'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Content */}
        <Box className="min-h-[500px]">
          {activeTab === 'discount' && <DiscountBillTab />}
          {activeTab === 'reward' && <RewardListTab />}
          {activeTab === 'vouchers' && <MyVouchersTab />}
        </Box>
      </Box>
    </Page>
  );
}

export default RewardsPage;
