import React, { useState, useCallback } from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember } from '../../hooks/use-member';
import { openShareSheet } from 'zmp-sdk';
import { QRCodeSVG } from 'qrcode.react';

const ZALO_APP_ID = '1756817649065317309';
// TODO: Set to false when app is published on Zalo
const IS_TESTING = true;

/**
 * Build deep link that opens ZMA with referral code.
 * Format: https://zalo.me/s/{appId}/?env=TESTING&ref={code}  (dev)
 *         https://zalo.me/s/{appId}/?ref={code}               (prod)
 * Works from any QR scanner — redirects into Zalo → opens mini app.
 */
const buildReferralLink = (referralCode: string) => {
  const params = new URLSearchParams();
  if (IS_TESTING) params.set('env', 'TESTING');
  params.set('ref', referralCode);
  return `https://zalo.me/s/${ZALO_APP_ID}/?${params.toString()}`;
};

const ReferralCodeCard: React.FC = () => {
  const { member } = useMember();
  const [copied, setCopied] = useState(false);

  const referralLink = member ? buildReferralLink(member.referralCode) : '';

  const handleCopy = useCallback(async () => {
    if (!member) return;
    try {
      await navigator.clipboard.writeText(member.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / Zalo WebView
      const textarea = document.createElement('textarea');
      textarea.value = member.referralCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [member]);

  const handleShare = useCallback(() => {
    if (!member) return;
    try {
      openShareSheet({
        type: 'link',
        data: {
          link: referralLink,
          chatOnly: false,
        },
        success: (res) => console.log('Share success', res),
        fail: (err) => console.error('Share failed', err),
      });
    } catch (e) {
      console.error(e);
      alert('Chức năng share đang được phát triển.');
    }
  }, [member, referralLink]);

  if (!member) return null;

  return (
    <Box className="px-4 animate-slide-up">
      {/* ═══ Referral Code Card ═══ */}
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
            <span className="text-lg">{copied ? '✅' : '📋'}</span>
          </Box>
        </Box>

        {/* Copy feedback */}
        {copied && (
          <Text className="text-xs text-white/80 mb-2 animate-fade-in relative z-10">
            Đã copy mã giới thiệu!
          </Text>
        )}

        <Box
          className="bg-white text-secondary font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-soft cursor-pointer active:scale-[0.97] transition-transform relative z-10 text-sm"
          onClick={handleShare}
        >
          Chia sẻ ngay cho bạn bè
        </Box>
      </Box>

      {/* ═══ QR Code Section ═══ */}
      <Box className="mt-4 p-6 rounded-3xl shadow-elevated bg-white dark:bg-dark-surface text-center">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-1">
          Mã QR giới thiệu
        </Text>
        <Text className="text-xs text-text-muted dark:text-dark-muted mb-4">
          Bạn bè quét mã này để tự động mở app và nhận ưu đãi
        </Text>

        {/* QR Code with border + branding */}
        <Box className="inline-flex flex-col items-center">
          <Box
            className="p-4 rounded-2xl border-2 border-dashed inline-block"
            style={{
              borderColor: 'rgba(160, 114, 72, 0.25)',
              background: 'linear-gradient(135deg, rgba(200,149,108,0.04) 0%, rgba(255,255,255,1) 100%)',
            }}
          >
            <QRCodeSVG
              value={referralLink}
              size={180}
              level="M"
              includeMargin={false}
              fgColor="#2D1B0E"
              bgColor="transparent"
            />
          </Box>

          {/* Code label below QR */}
          <Box className="mt-3 px-4 py-1.5 rounded-full inline-block"
            style={{ background: 'linear-gradient(135deg, #C8956C, #A07248)' }}
          >
            <Text className="text-xs font-bold text-white tracking-widest">
              {member.referralCode}
            </Text>
          </Box>
        </Box>

        {/* Save QR hint */}
        <Text className="text-[11px] text-text-muted/60 dark:text-dark-muted/60 mt-4">
          💡 Nhấn giữ mã QR để lưu ảnh và gửi cho bạn bè
        </Text>
      </Box>
    </Box>
  );
};

export default ReferralCodeCard;
