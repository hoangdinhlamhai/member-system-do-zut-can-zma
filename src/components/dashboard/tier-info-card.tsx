import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember, useMemberStats } from '../../hooks/use-member';

// Fallback nếu API chưa trả themeConfig
const TIER_FALLBACK: Record<string, { gradient: string; label: string }> = {
  bronze:   { gradient: 'linear-gradient(135deg, #CD7F32, #E8A96A)', label: 'ĐỒNG' },
  silver:   { gradient: 'linear-gradient(135deg, #A8A9AD, #D4D4D8)', label: 'BẠC' },
  gold:     { gradient: 'linear-gradient(135deg, #D4A017, #FFD700)', label: 'VÀNG' },
  platinum: { gradient: 'linear-gradient(135deg, #B0C4D8, #E5E4E2)', label: 'BẠCH KIM' },
  diamond:  { gradient: 'linear-gradient(135deg, #4FC3F7, #B9F2FF)', label: 'KIM CƯƠNG' },
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const TierInfoCard: React.FC = () => {
  const { member } = useMember();
  const { stats } = useMemberStats();

  if (!member || !stats) return null;

  // Ưu tiên: themeConfig từ API (DB) > fallback hardcoded
  const themeFromAPI = member.tierThemeConfig;
  const fallback = TIER_FALLBACK[member.tierName] || TIER_FALLBACK['bronze'];

  const gradient = themeFromAPI?.gradient || fallback.gradient;
  const icon = themeFromAPI?.icon || '';
  const tierLabel = member.tierDisplayName?.toUpperCase() || fallback.label;

  const nextSpending = stats.nextTierSpendingRequired;
  const currentSpending = member.lifetimeSpending;
  const totalNeeded = currentSpending + nextSpending;
  const progressPercent = totalNeeded > 0 ? Math.min(100, (currentSpending / totalNeeded) * 100) : 0;
  const isMaxTier = nextSpending <= 0;

  return (
    <Box className="px-4 pt-[88px] animate-slide-up">
      {/* Greeting */}
      <Box className="mb-3">
        <Text className="text-base text-text-muted dark:text-dark-muted font-medium">
          Xin chào,
        </Text>
        <Text className="text-xl font-bold text-text-main dark:text-dark-text tracking-tight">
          {member.fullName || member.zaloName || member.phone || 'Thành viên'}
        </Text>
      </Box>

      {/* Tier Card */}
      <Box
        className="p-5 rounded-3xl shadow-elevated relative overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Decorative glow */}
        <Box className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
        />
        <Box className="absolute bottom-[-30px] left-[-10px] w-[100px] h-[100px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
        />

        {/* Top row */}
        <Box className="flex justify-between items-start mb-5 relative z-10">
          <Box>
            <Box className="flex items-center gap-2 mb-2">
              <Box className="bg-white/20 px-2.5 py-1 rounded-lg border border-white/15"
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <Text className="text-xs font-bold text-white tracking-widest">
                  {icon && <span className="mr-1">{icon}</span>}
                  {tierLabel}
                </Text>
              </Box>
              <Text className="text-sm font-semibold text-white/80">×{member.tierMultiplier || 1} điểm</Text>
            </Box>
            <Text className="text-xs font-medium text-white/60 mb-0.5">Chi tiêu trọn đời</Text>
            <Text className="text-2xl font-bold text-white tracking-tight">{formatVND(member.lifetimeSpending)}</Text>
          </Box>
        </Box>

        {/* Progress bar */}
        <Box className="relative z-10">
          {isMaxTier ? (
            <Box className="flex justify-center text-xs font-medium">
              <Text className="text-white/90 bg-white/15 px-3 py-1 rounded-lg">
                👑 Hạng cao nhất
              </Text>
            </Box>
          ) : (
            <>
              <Box className="flex justify-between text-xs mb-2 font-medium">
                <Text className="text-white/70">Tiến độ lên hạng</Text>
                <Text className="text-white/90">Còn {formatVND(nextSpending)}</Text>
              </Box>
              <Box className="h-2 w-full bg-black/15 rounded-full overflow-hidden">
                <Box
                  className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-spring"
                  style={{ width: `${progressPercent}%` }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TierInfoCard;
