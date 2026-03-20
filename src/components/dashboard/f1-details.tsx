import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useReferees } from '../../hooks/use-member';
import { useNavigate } from 'react-router-dom';

const formatVND = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
  return amount.toString();
};

const F1DetailsList: React.FC = () => {
  const { referees } = useReferees();
  const navigate = useNavigate();

  if (!referees || referees.length === 0) return null;

  return (
    <Box className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
        <Box className="flex justify-between items-center mb-4">
          <Text className="text-sm font-semibold text-text-main dark:text-dark-text">
            Bạn bè (F1)
          </Text>
          <Text
            className="text-xs text-primary font-semibold cursor-pointer hover:text-primary-dark transition-colors"
            onClick={() => navigate('/referral')}
          >
            Xem tất cả →
          </Text>
        </Box>

        <Box className="space-y-3">
          {referees.slice(0, 3).map((f1) => (
            <Box key={f1.refereeId} className="flex justify-between items-center bg-cream/50 dark:bg-dark-card p-3 rounded-xl border border-black/[0.02] dark:border-dark-border">
              <Box className="flex items-center gap-3">
                <Box className="w-10 h-10 rounded-xl bg-primary/10 text-primary-600 dark:text-primary-light flex items-center justify-center font-bold text-sm">
                  {f1.refereeName.charAt(0)}
                </Box>
                <Box>
                  <Text className="text-sm font-semibold text-text-main dark:text-dark-text line-clamp-1">
                    {f1.refereeName}
                  </Text>
                  <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">
                    {f1.billCount} bills · {formatVND(f1.totalBillAmount)}
                  </Text>
                </Box>
              </Box>
              <Box className="bg-success-light dark:bg-success/10 px-2.5 py-1 rounded-lg border border-success/15">
                <Text className="text-xs text-success font-bold">+{formatVND(f1.totalEarned)}</Text>
              </Box>
            </Box>
          ))}
        </Box>

        {referees.length > 3 && (
          <Box className="mt-4 pt-3 border-t border-dashed border-black/[0.06] dark:border-dark-border text-center">
            <Text
              className="text-xs text-text-muted dark:text-dark-muted cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate('/referral')}
            >
              +{referees.length - 3} người bạn khác
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default F1DetailsList;
