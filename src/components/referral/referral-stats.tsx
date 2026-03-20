import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useReferees } from '../../hooks/use-member';

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ReferralStats: React.FC = () => {
  const { referees } = useReferees();

  if (!referees) return null;

  const totalInvited = referees.length;
  const pendingCount = referees.filter(r => r.billCount === 0).length;
  const totalEarned = referees.reduce((acc, curr) => acc + curr.totalEarned, 0);

  return (
    <Box className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
          Thống kê giới thiệu
        </Text>

        <Box className="grid grid-cols-2 gap-3">
          <Box className="bg-primary-50 dark:bg-primary/10 rounded-xl p-4 border border-primary/10 text-center">
            <Text className="text-2xl font-bold text-primary mb-1">{totalInvited}</Text>
            <Text className="text-xs text-text-muted dark:text-dark-muted font-medium">Đã mời</Text>
          </Box>

          <Box className="bg-warning-light dark:bg-warning/10 rounded-xl p-4 border border-warning/10 text-center">
            <Text className="text-2xl font-bold text-warning mb-1">{pendingCount}</Text>
            <Text className="text-xs text-text-muted dark:text-dark-muted font-medium">Chưa có bill</Text>
          </Box>
        </Box>

        <Box className="mt-3 bg-success-light dark:bg-success/10 rounded-xl p-4 border border-success/15 flex justify-between items-center">
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
            >
              <Text className="text-base text-white">💰</Text>
            </Box>
            <Text className="text-sm font-medium text-success">Tổng thu nhập</Text>
          </Box>
          <Text className="text-lg font-bold text-success">{formatVND(totalEarned)}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ReferralStats;
