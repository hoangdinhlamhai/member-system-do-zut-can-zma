import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember } from '../../hooks/use-member';
import { useNavigate } from 'react-router-dom';

const PointsCard: React.FC = () => {
  const { member } = useMember();
  const navigate = useNavigate();

  if (!member) return null;

  return (
    <Box className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border flex items-center justify-between">
        <Box>
          <Text className="text-sm font-medium text-text-muted dark:text-dark-muted mb-1">Điểm hiện có</Text>
          <Text className="text-3xl font-bold text-gradient tracking-tight">
            {member.pointsBalance.toLocaleString()}
          </Text>
          <Text className="text-xs text-text-muted/60 dark:text-dark-muted/60 mt-0.5">điểm tích lũy</Text>
        </Box>
        <Box
          className="bg-primary-50 dark:bg-primary/10 hover:bg-primary-100 dark:hover:bg-primary/20 transition-all duration-300 ease-spring px-4 py-3 rounded-2xl text-center cursor-pointer border border-primary/10 dark:border-primary/20"
          onClick={() => navigate('/rewards')}
        >
          <Box className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5 shadow-sm"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Text className="text-lg text-white">🎁</Text>
          </Box>
          <Text className="text-xs font-semibold text-primary-600 dark:text-primary-light">
            Đổi quà
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default PointsCard;
