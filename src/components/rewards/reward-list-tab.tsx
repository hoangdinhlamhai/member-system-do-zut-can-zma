import React, { useState } from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember, useRewards } from '../../hooks/use-member';
import RedeemModal, { RedeemItemData } from './redeem-modal';

const RewardListTab: React.FC = () => {
  const { member } = useMember();
  const { rewards } = useRewards();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RedeemItemData | null>(null);

  if (!member || !rewards) return null;

  const handleRedeem = (reward: any) => {
    setSelectedItem({
      id: reward.id,
      type: 'reward',
      name: reward.name,
      pointsRequired: reward.pointsRequired,
    });
    setIsModalOpen(true);
  };

  return (
    <Box className="px-4 py-4 animate-slide-up min-h-full">
      <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
        Quà tặng & Đồ uống
      </Text>

      <Box className="space-y-3">
        {rewards.filter(r => r.isActive).map((reward) => {
          const isEnough = member.pointsBalance >= reward.pointsRequired;

          return (
            <Box
              key={reward.id}
              className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-black/[0.03] dark:border-dark-border shadow-soft flex items-center justify-between"
            >
              <Box className="flex items-start gap-3 flex-1 min-w-0">
                <Box className="w-14 h-14 rounded-xl bg-cream dark:bg-dark-card flex items-center justify-center text-2xl shrink-0 border border-black/[0.03] dark:border-dark-border">
                  {reward.imageUrl}
                </Box>
                <Box className="flex-1 min-w-0 pr-2">
                  <Text className="font-semibold text-text-main dark:text-dark-text text-sm line-clamp-1">
                    {reward.name}
                  </Text>
                  <Text className="text-[11px] text-text-muted dark:text-dark-muted mt-0.5 line-clamp-2 leading-snug">
                    {reward.description}
                  </Text>
                  <Text className="text-sm font-bold text-primary mt-1.5">
                    {reward.pointsRequired} Điểm
                  </Text>
                </Box>
              </Box>

              <button
                onClick={() => handleRedeem(reward)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-spring shrink-0 cursor-pointer ${
                  isEnough
                    ? 'text-white shadow-sm active:scale-[0.95]'
                    : 'bg-black/[0.04] text-text-muted/50 dark:bg-dark-border dark:text-dark-muted/50 cursor-not-allowed'
                }`}
                style={isEnough ? { background: 'var(--gradient-primary)' } : undefined}
                disabled={!isEnough}
              >
                Đổi ngay
              </button>
            </Box>
          );
        })}
      </Box>

      <RedeemModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default RewardListTab;
