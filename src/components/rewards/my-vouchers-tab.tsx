import React, { useState } from 'react';
import { Box, Text, Modal } from 'zmp-ui';
import { useVouchers } from '../../hooks/use-member';

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const MyVouchersTab: React.FC = () => {
  const { vouchers } = useVouchers();
  const [qrModalData, setQrModalData] = useState<{ visible: boolean; qrData: string; title: string; code: string }>({
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
    setQrModalData({ visible: true, qrData: v.qrData, title: v.title, code: v.voucherCode });
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

      {/* QR Modal */}
      <Modal
        visible={qrModalData.visible}
        title="Đưa mã này cho thu ngân"
        onClose={() => setQrModalData({ ...qrModalData, visible: false })}
        actions={[{ text: 'Đóng', close: true, highLight: true }]}
      >
        <Box className="text-center py-4 flex flex-col items-center justify-center">
          <Text className="text-base text-text-main dark:text-dark-text font-bold mb-2">
            {qrModalData.title}
          </Text>
          <Text className="text-lg font-mono text-primary font-bold mb-5 bg-primary-50 dark:bg-primary/10 px-5 py-1.5 rounded-xl border border-primary/15 tracking-[0.15em]">
            {qrModalData.code}
          </Text>

          <Box className="bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-soft border border-black/[0.04] dark:border-dark-border inline-block mb-3">
            <Box className="w-48 h-48 bg-cream dark:bg-dark-card rounded-xl flex items-center justify-center bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZDC:VOUCHER')] bg-contain bg-center" />
          </Box>

          <Text className="text-xs text-text-muted/60 dark:text-dark-muted/60 mt-2">
            Mã QR tự động làm mới mỗi 30 giây để bảo mật
          </Text>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyVouchersTab;
