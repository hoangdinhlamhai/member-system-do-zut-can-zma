import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useMemberStats, useReferees } from '../../hooks/use-member';

const formatVND = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
  return amount.toString();
};

const MonthlySalesCard: React.FC = () => {
  const { stats } = useMemberStats();
  const { referees } = useReferees();

  if (!stats) return null;

  const totalF1Bills = referees?.reduce((acc, curr) => acc + curr.billCount, 0) || 0;

  return (
    <Box className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
          Thống kê tháng này
        </Text>

        <Box className="space-y-3">
          {/* Tự tạo */}
          <Box className="flex justify-between items-center bg-cream/80 dark:bg-dark-card p-3.5 rounded-xl border border-black/[0.02] dark:border-dark-border">
            <Box className="flex items-center gap-3">
              <Box className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
              >
                <Text className="text-base text-white">🧾</Text>
              </Box>
              <Box>
                <Text className="text-sm font-medium text-text-main dark:text-dark-text">Doanh số cá nhân</Text>
                <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">{stats.monthlyVisits} hóa đơn</Text>
              </Box>
            </Box>
            <Text className="text-base font-bold text-success">
              {formatVND(stats.monthlySelfSales)}
            </Text>
          </Box>

          {/* F1 */}
          <Box className="flex justify-between items-center bg-cream/80 dark:bg-dark-card p-3.5 rounded-xl border border-black/[0.02] dark:border-dark-border">
            <Box className="flex items-center gap-3">
              <Box className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Text className="text-base text-white">👥</Text>
              </Box>
              <Box>
                <Text className="text-sm font-medium text-text-main dark:text-dark-text">Từ bạn bè (F1)</Text>
                <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">{totalF1Bills} hóa đơn từ F1</Text>
              </Box>
            </Box>
            <Text className="text-base font-bold text-primary dark:text-primary-light">
              {formatVND(stats.monthlyReferralSales)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MonthlySalesCard;
