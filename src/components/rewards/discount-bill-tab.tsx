import React, { useState } from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember, useDiscountTiers } from '../../hooks/use-member';
import RedeemModal, { RedeemItemData } from './redeem-modal';

const DiscountBillTab: React.FC = () => {
  const { member } = useMember();
  const { discountTiers } = useDiscountTiers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RedeemItemData | null>(null);

  if (!member || !discountTiers) return null;

  const handleRedeem = (discount: any) => {
    setSelectedItem({
      id: discount.id,
      type: 'discount',
      name: `Giảm ${discount.discountPercent}% Tổng Bill`,
      pointsRequired: discount.pointsRequired,
    });
    setIsModalOpen(true);
  };

  return (
    <Box className="px-4 py-4 animate-slide-up min-h-full">
      <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
        Giảm giá trực tiếp hóa đơn
      </Text>

      <Box className="space-y-3">
        {discountTiers.map((discount) => {
          const isEnough = member.pointsBalance >= discount.pointsRequired;

          return (
            <Box
              key={discount.id}
              className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-black/[0.03] dark:border-dark-border shadow-soft"
            >
              <Box className="flex justify-between items-start gap-3">
                <Box className="flex gap-3 flex-1">
                  <Box className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Text className="text-sm font-bold">{discount.discountPercent}%</Text>
                  </Box>
                  <Box className="flex-1 min-w-0">
                    <Text className="font-semibold text-text-main dark:text-dark-text text-sm">
                      Giảm {discount.discountPercent}% Tổng Bill
                    </Text>
                    <Text className="text-[11px] text-text-muted dark:text-dark-muted mt-0.5">
                      {discount.description} (Tối đa {(discount.maxDiscountAmount / 1000)}K)
                    </Text>
                    <Text className="text-sm font-bold text-primary mt-1.5">
                      {discount.pointsRequired} Điểm
                    </Text>
                  </Box>
                </Box>

                <button
                  onClick={() => handleRedeem(discount)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ease-spring shrink-0 cursor-pointer ${
                    isEnough
                      ? 'text-white shadow-sm active:scale-[0.95]'
                      : 'bg-black/[0.04] text-text-muted/50 dark:bg-dark-border dark:text-dark-muted/50 cursor-not-allowed'
                  }`}
                  style={isEnough ? { background: 'var(--gradient-primary)' } : undefined}
                  disabled={!isEnough}
                >
                  Đổi
                </button>
              </Box>
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

export default DiscountBillTab;
