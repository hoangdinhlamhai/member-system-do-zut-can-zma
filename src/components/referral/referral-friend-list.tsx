import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useReferees } from '../../hooks/use-member';

const formatVND = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
  return amount.toString();
};

const ReferralFriendList: React.FC = () => {
  const { referees } = useReferees();

  if (!referees || referees.length === 0) return null;

  return (
    <Box className="px-4 mt-4 animate-slide-up pb-8" style={{ animationDelay: '0.3s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
          Danh sách bạn giới thiệu
        </Text>

        <Box className="space-y-3">
          {referees.map((f1) => {
            const isPending = f1.billCount === 0;

            return (
              <Box key={f1.refereeId} className="flex justify-between items-center bg-cream/50 dark:bg-dark-card p-3 rounded-xl border border-black/[0.02] dark:border-dark-border">
                <Box className="flex items-center gap-3">
                  <Box className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isPending ? 'bg-black/[0.04] text-text-muted dark:bg-dark-border dark:text-dark-muted' : 'bg-primary-50 text-primary-600 dark:bg-primary/10 dark:text-primary-light'
                  }`}>
                    {f1.refereeName.charAt(0)}
                  </Box>
                  <Box className="min-w-0 flex-1">
                    <Box className="flex items-center gap-1.5">
                      <Text className="text-sm font-semibold text-text-main dark:text-dark-text truncate">
                        {f1.refereeName}
                      </Text>
                      <Text className="text-[9px] bg-black/[0.04] dark:bg-dark-border px-1.5 py-0.5 rounded font-semibold text-text-muted dark:text-dark-muted shrink-0">
                        F1
                      </Text>
                    </Box>
                    {isPending ? (
                      <Text className="text-xs text-warning font-medium mt-0.5">
                        Chưa có hóa đơn
                      </Text>
                    ) : (
                      <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">
                        {f1.billCount} bills · <span className="text-success font-semibold">{formatVND(f1.totalEarned)}</span>
                      </Text>
                    )}
                  </Box>
                </Box>
                <Box className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                  isPending
                    ? 'bg-black/[0.03] text-text-muted/60 dark:bg-dark-border dark:text-dark-muted/60'
                    : 'bg-primary-50 text-primary dark:bg-primary/10 dark:text-primary-light'
                }`}>
                  {isPending ? 'PENDING' : 'ACTIVE'}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ReferralFriendList;
