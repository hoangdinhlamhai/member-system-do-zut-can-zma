import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useSnackbar } from 'zmp-ui';
import QRCode from 'react-qr-code';
import { useMember } from '../../hooks/use-member';

const QRViewer: React.FC = () => {
  const { member } = useMember();
  const { openSnackbar } = useSnackbar();
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const generateCode = useCallback(() => {
    if (!member) return;
    const timestamp = Date.now();
    const hashStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newCode = `ZDC:${member.id}:${timestamp}:${hashStr}`;
    setQrCodeData(newCode);
    setTimeLeft(60);
  }, [member]);

  useEffect(() => {
    generateCode();
  }, [generateCode, refreshKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setRefreshKey((prev) => prev + 1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!member) return null;

  const handleCopy = () => {
    openSnackbar({
      text: 'Đã copy mã xác thực',
      type: 'success',
      duration: 2000,
    });
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const progressPercent = (timeLeft / 60) * 100;

  return (
    <Box className="animate-slide-up flex flex-col items-center justify-center p-4 min-h-[500px]">
      <Box className="bg-white dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-black/[0.03] dark:border-dark-border w-full max-w-[320px] mx-auto flex flex-col items-center">

        <Text className="text-lg font-bold text-text-main dark:text-dark-text mb-1 text-center tracking-tight">
          Xác Thực Thành Viên
        </Text>
        <Text className="text-xs text-text-muted dark:text-dark-muted mb-6 text-center max-w-[250px]">
          Đưa mã này cho thu ngân để tích điểm hoặc nhận ưu đãi
        </Text>

        {/* QR Code */}
        <Box className="bg-white p-4 rounded-2xl shadow-inner-soft border border-black/[0.04] w-full flex justify-center mb-5">
          <QRCode
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrCodeData}
            viewBox="0 0 256 256"
            bgColor="#ffffff"
            fgColor="#2A1F18"
            level="H"
          />
        </Box>

        {/* Member Info */}
        <Box className="w-full bg-cream dark:bg-dark-card rounded-xl p-4 border border-black/[0.03] dark:border-dark-border mb-5">
          <Text className="text-sm font-bold text-text-main dark:text-dark-text text-center tracking-wide">
            {member.fullName}
          </Text>
          <Box className="flex justify-center items-center gap-2 mt-1.5">
            <Text className="text-xs text-text-muted dark:text-dark-muted font-mono">{member.phone || member.qrCode}</Text>
            <Text className="text-text-muted/30">·</Text>
            <Text className="text-xs text-primary font-bold uppercase">{member.tierName}</Text>
          </Box>
        </Box>

        {/* Timer with progress ring */}
        <Box className="flex flex-col items-center w-full">
          <Box className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-warning-light dark:bg-warning/10 rounded-xl border border-warning/15">
            <Text className="text-xs font-medium text-warning">
              Tự động làm mới: <span className="font-mono font-bold text-sm">{timeLeft}s</span>
            </Text>
          </Box>

          {/* Progress bar */}
          <Box className="w-full h-1 bg-black/[0.04] dark:bg-dark-border rounded-full overflow-hidden mb-5">
            <Box
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </Box>

          <Box className="flex w-full gap-3">
            <button
              onClick={handleRefresh}
              className="flex-1 py-3 bg-cream dark:bg-dark-card hover:bg-primary-50 dark:hover:bg-dark-border text-text-main dark:text-dark-text rounded-xl font-semibold text-sm transition-colors duration-200 active:scale-[0.97] border border-black/[0.04] dark:border-dark-border cursor-pointer"
            >
              Tải lại
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.97] shadow-sm cursor-pointer"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Copy Mã
            </button>
          </Box>
        </Box>
      </Box>

      <Text className="text-xs text-text-muted/50 dark:text-dark-muted/50 mt-6 text-center max-w-[280px] px-4">
        Mã QR chỉ dùng một lần và tự động thay đổi để bảo mật.
      </Text>
    </Box>
  );
};

export default QRViewer;
