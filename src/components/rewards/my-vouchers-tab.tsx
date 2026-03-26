import React, { useState } from 'react';
import { Box, Text } from 'zmp-ui';
import { QRCodeSVG } from 'qrcode.react';
import { useVouchers } from '../../hooks/use-member';

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

interface QRModalState {
  visible: boolean;
  qrData: string;
  title: string;
  code: string;
}

const MyVouchersTab: React.FC = () => {
  const { vouchers } = useVouchers();
  const [qrModal, setQrModal] = useState<QRModalState>({
    visible: false,
    qrData: '',
    title: '',
    code: '',
  });

  if (!vouchers || vouchers.length === 0) {
    return (
      <Box className="px-4 py-16 text-center animate-slide-up flex flex-col items-center">
        <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 dark:bg-primary/10 flex items-center justify-center">
          <Text className="text-3xl grayscale">🎫</Text>
        </Box>
        <Text className="text-text-muted dark:text-dark-muted font-medium">Bạn chưa có voucher nào</Text>
      </Box>
    );
  }

  const openQR = (v: any) => {
    setQrModal({ visible: true, qrData: v.qrData, title: v.title, code: v.voucherCode });
  };

  const closeQR = () => {
    setQrModal((prev) => ({ ...prev, visible: false }));
  };

  return (
    <Box className="px-4 py-4 animate-slide-up min-h-full">
      <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
        Voucher của bạn
      </Text>

      <Box className="space-y-3">
        {vouchers.map((v) => {
          const isUsed = v.status === 'used';
          const isExpired = v.status === 'expired' || new Date(v.expiresAt) < new Date();

          const getStatusBadge = () => {
            if (isUsed) return (
              <Text className="text-[10px] bg-black/[0.04] dark:bg-dark-border text-text-muted/60 dark:text-dark-muted/60 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                Đã dùng
              </Text>
            );
            if (isExpired) return (
              <Text className="text-[10px] bg-error-light text-error px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                Hết hạn
              </Text>
            );
            return (
              <Text className="text-[10px] bg-success-light text-success px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                Sẵn sàng
              </Text>
            );
          };

          return (
            <Box
              key={v.id}
              className={`bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-black/[0.03] dark:border-dark-border shadow-soft transition-all duration-200 ${
                isUsed || isExpired ? 'opacity-50' : ''
              }`}
            >
              <Box className="flex">
                <Box className={`w-16 h-20 flex flex-col items-center justify-center shrink-0 border-r border-black/[0.03] dark:border-dark-border ${
                  v.type === 'discount' ? 'bg-primary-50 dark:bg-primary/10' : 'bg-success-light dark:bg-success/10'
                }`}>
                  <Text className="text-2xl">{v.type === 'discount' ? '💰' : v.imageUrl || '🎁'}</Text>
                </Box>
                <Box className="p-3 flex-1 flex flex-col justify-between min-w-0">
                  <Box className="flex justify-between items-start gap-2">
                    <Text className="font-semibold text-text-main dark:text-dark-text text-sm line-clamp-1 flex-1">{v.title}</Text>
                    {getStatusBadge()}
                  </Box>
                  <Text className="text-[11px] font-mono text-text-muted dark:text-dark-muted bg-cream dark:bg-dark-card px-2 py-0.5 rounded-lg mt-1.5 self-start font-semibold tracking-wide">
                    {v.voucherCode}
                  </Text>
                  <Text className="text-[10px] text-text-muted/60 dark:text-dark-muted/60 mt-1 font-medium">
                    Hết hạn: {formatDate(v.expiresAt)}
                  </Text>
                </Box>
              </Box>

              {!isUsed && !isExpired && (
                <Box
                  className="bg-primary-50 dark:bg-primary/10 text-primary text-center py-2.5 text-xs font-bold border-t border-primary/10 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary/20 active:bg-primary/20 transition-colors uppercase tracking-wider"
                  onClick={() => openQR(v)}
                >
                  Mở QR Code
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* QR Overlay — tap outside to close */}
      {qrModal.visible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {/* Backdrop — tap to close */}
          <div
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={closeQR}
            onTouchEnd={(e) => { e.preventDefault(); closeQR(); }}
          />

          {/* QR Card */}
          <div
            className="relative z-10 w-[85%] max-w-[320px] bg-white dark:bg-dark-surface rounded-3xl shadow-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            {/* Header gradient */}
            <Box
              className="px-6 pt-6 pb-4 text-center text-white"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Text className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1">
                Đưa mã này cho thu ngân
              </Text>
              <Text className="text-base font-bold text-white">
                {qrModal.title}
              </Text>
            </Box>

            {/* QR Code */}
            <Box className="px-6 py-6 flex flex-col items-center">
              <Box className="bg-white p-4 rounded-2xl shadow-soft border border-black/[0.04] mb-4">
                <QRCodeSVG
                  value={qrModal.qrData}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#2E2722"
                  level="M"
                  includeMargin={false}
                />
              </Box>

              <Text className="text-lg font-mono font-bold text-primary bg-primary-50 dark:bg-primary/10 px-5 py-2 rounded-xl border border-primary/15 tracking-[0.15em] mb-2">
                {qrModal.code}
              </Text>

              <Text className="text-[11px] text-text-muted/50 dark:text-dark-muted/50 mt-1 mb-3">
                Nhấn vùng trống để đóng
              </Text>

              <div
                className="w-full py-3 text-center text-sm font-bold text-white rounded-xl cursor-pointer active:opacity-80 transition-opacity"
                style={{ background: 'var(--gradient-primary)' }}
                onClick={closeQR}
                onTouchEnd={(e) => { e.preventDefault(); closeQR(); }}
              >
                Đóng
              </div>
            </Box>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default MyVouchersTab;
