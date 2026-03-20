import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useTimeline } from '../../hooks/use-member';

const formatVND = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
  return amount.toString();
};

const formatDateDayMonth = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

const TransactionTimeline: React.FC = () => {
  const { timeline, isLoading } = useTimeline();

  if (isLoading) {
    return (
      <Box className="px-4 mt-4 animate-slide-up pb-4" style={{ animationDelay: '0.4s' }}>
        <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
          <Box className="animate-pulse space-y-3">
            <Box className="h-4 w-36 bg-gray-200 dark:bg-dark-card rounded" />
            <Box className="h-16 bg-gray-200 dark:bg-dark-card rounded-xl" />
            <Box className="h-16 bg-gray-200 dark:bg-dark-card rounded-xl" />
          </Box>
        </Box>
      </Box>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <Box className="px-4 mt-4 animate-slide-up pb-4" style={{ animationDelay: '0.4s' }}>
        <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border text-center">
          <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-3">
            Lịch sử giao dịch
          </Text>
          <Text className="text-3xl mb-2">📋</Text>
          <Text className="text-sm text-text-muted dark:text-dark-muted">
            Chưa có giao dịch nào
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="px-4 mt-4 animate-slide-up pb-4" style={{ animationDelay: '0.4s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border relative">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-5">
          Lịch sử giao dịch
        </Text>

        <Box className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-[9px] top-2 bottom-4 w-[2px] bg-primary/10 dark:bg-primary/5 z-0 rounded-full" />

          {timeline.map((item, index) => {
            if (item.type === 'personal_bill') {
              return (
                <Box key={item.id} className="relative z-10 mb-4 last:mb-0 animate-slide-up" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                  {/* Dot — primary color for personal bill */}
                  <Box className="absolute -left-[18px] top-3 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-dark-surface z-10 shadow-sm" />
                  <Box className="bg-cream/60 dark:bg-dark-card p-3.5 rounded-xl border border-black/[0.02] dark:border-dark-border">
                    <Box className="flex justify-between items-start">
                      <Box className="flex-1 min-w-0 mr-3">
                        <Text className="text-sm font-semibold text-text-main dark:text-dark-text truncate">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">
                          {formatDateDayMonth(item.date)}
                        </Text>
                      </Box>
                      <Box className="text-right shrink-0">
                        <Text className="text-sm font-bold text-text-main dark:text-dark-text">
                          {formatVND(item.amount || 0)}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            }

            if (item.type === 'referral_bonus') {
              return (
                <Box key={item.id} className="relative z-10 mb-4 last:mb-0 animate-slide-up" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                  {/* Dot — success color for referral bonus */}
                  <Box className="absolute -left-[18px] top-3 w-3 h-3 rounded-full bg-success ring-4 ring-white dark:ring-dark-surface z-10 shadow-sm" />
                  <Box className="bg-success-light/60 dark:bg-success/5 p-3.5 rounded-xl border border-success/10">
                    <Box className="flex justify-between items-start">
                      <Box className="flex-1 min-w-0 mr-3">
                        <Text className="text-sm font-semibold text-text-main dark:text-dark-text truncate">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-success/80 mt-0.5">
                          Hoa hồng giới thiệu · {formatDateDayMonth(item.date)}
                        </Text>
                      </Box>
                      <Box className="text-right shrink-0">
                        <Text className="text-sm font-bold text-success">
                          +{item.points} điểm
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            }

            return null;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionTimeline;
