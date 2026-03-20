import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember } from '../../hooks/use-member';
import { openShareSheet } from 'zmp-sdk';

const ReferralCodeCard: React.FC = () => {
  const { member } = useMember();

  if (!member) return null;

  const handleCopy = () => {
    console.log('Copied:', member.referralCode);
    alert('Đã copy mã: ' + member.referralCode);
  };

  const handleShare = () => {
    try {
      openShareSheet({
        type: 'link',
        data: {
          link: `https://zalo.me/app/123456?ref=${member.referralCode}`,
          chatOnly: false,
        },
        success: (res) => console.log('Share success', res),
        fail: (err) => console.error('Share failed', err),
      });
    } catch (e) {
      console.error(e);
      alert('Chức năng share đang được phát triển.');
    }
  };

  return (
    <Box className="px-4 pt-[88px] animate-slide-up">
      <Box
        className="p-6 rounded-3xl shadow-elevated relative overflow-hidden text-center text-white"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Decorative glow */}
        <Box className="absolute top-[-20px] right-[-20px] w-[140px] h-[140px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,149,108,0.25) 0%, transparent 70%)' }}
        />
        <Box className="absolute bottom-[-30px] left-[-10px] w-[100px] h-[100px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
        />

        <Text className="text-sm font-medium text-white/70 mb-3 relative z-10">
          Mã giới thiệu của bạn
        </Text>

        <Box
          className="bg-white/10 border border-white/15 p-3.5 rounded-2xl flex items-center justify-between mb-4 cursor-pointer active:scale-[0.97] transition-transform relative z-10"
          style={{ backdropFilter: 'blur(8px)' }}
          onClick={handleCopy}
        >
          <Text className="text-xl font-bold tracking-[0.2em] text-white mx-auto">
            {member.referralCode}
          </Text>
          <Box className="text-white/70 p-1">
            <span className="text-lg">📋</span>
          </Box>
        </Box>

        <Box
          className="bg-white text-secondary font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-soft cursor-pointer active:scale-[0.97] transition-transform relative z-10 text-sm"
          onClick={handleShare}
        >
          Chia sẻ ngay cho bạn bè
        </Box>
      </Box>
    </Box>
  );
};

export default ReferralCodeCard;
