// ══════════════════════════════════════════════════════════
// Scan Voucher Page — Quét QR Voucher
// ══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { Page, Box, Text, Button, Sheet, useSnackbar, useNavigate } from 'zmp-ui';
import { MOCK_VOUCHER_SCAN_RESULT, formatDateShort } from '../mock/staff-data';

const ScanVoucherPage: React.FC = () => {
  const [scanned, setScanned] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [applying, setApplying] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const voucher = MOCK_VOUCHER_SCAN_RESULT;

  const handleSimulateScan = () => {
    setScanned(true);
    setTimeout(() => setSheetVisible(true), 600);
  };

  const handleApplyVoucher = async () => {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setApplying(false);
    setSheetVisible(false);
    snackbar.openSnackbar({
      type: 'success',
      text: `Đã áp dụng voucher ${voucher.rewardType} cho ${voucher.memberName}!`,
      duration: 3000,
    });
    setTimeout(() => setScanned(false), 500);
  };

  return (
    <Page className="page bg-cream dark:bg-dark-bg min-h-screen">
      {/* ─── Header ─────────────────────────────────── */}
      <Box className="staff-header px-5 pt-14 pb-7 rounded-b-4xl">
        <Box className="flex items-center gap-3 animate-fade-in">
          <Box
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center cursor-pointer active:bg-white/25 transition-colors"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => navigate('/staff')}
          >
            <Text className="text-white text-lg">←</Text>
          </Box>
          <Text className="text-white font-bold text-lg tracking-tight">
            Quét Voucher
          </Text>
        </Box>
      </Box>

      {/* ─── Camera Viewfinder ──────────────────────── */}
      <Box className="px-5 -mt-4 relative z-10">
        <Box className="scan-viewfinder animate-scale-in">
          <Box className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
            {!scanned ? (
              <Box className="text-center">
                <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Text className="text-3xl">📷</Text>
                </Box>
                <Text className="text-white/50 text-sm font-medium">
                  Đưa camera vào mã QR voucher
                </Text>
              </Box>
            ) : (
              <Box className="text-center animate-scale-in">
                <Box className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-success/20 flex items-center justify-center">
                  <Text className="text-3xl">✅</Text>
                </Box>
                <Text className="text-success font-semibold">Đã quét thành công!</Text>
              </Box>
            )}
          </Box>
          {!scanned && <Box className="scan-line" />}
        </Box>
      </Box>

      {/* ─── Scan Button ────────────────────────────── */}
      <Box className="px-5 mt-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {!scanned ? (
          <Button
            fullWidth
            size="large"
            onClick={handleSimulateScan}
            className="!rounded-xl !font-semibold !text-base !shadow-sm"
            style={{ background: 'linear-gradient(135deg, #E8734A, #FF9D7A)' }}
          >
            Giả lập quét QR
          </Button>
        ) : (
          <Button
            fullWidth
            size="large"
            onClick={() => setSheetVisible(true)}
            variant="secondary"
            className="!rounded-xl !font-semibold !text-base"
          >
            Xem lại thông tin voucher
          </Button>
        )}

        <Text className="text-center text-text-muted/60 dark:text-dark-muted/60 text-xs mt-3">
          Hướng camera vào mã QR trên voucher của khách hàng
        </Text>
      </Box>

      {/* ─── Bottom Sheet ───────────────────────────── */}
      <Sheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler
        title="Thông tin Voucher"
      >
        <Box className="px-5 pb-8">
          {/* Voucher Badge */}
          <Box className="flex justify-center mb-5">
            <Box
              className="px-5 py-2 rounded-xl text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${voucher.tierColor}15, ${voucher.tierColor}30)`,
                color: voucher.tierColor,
                border: `1.5px solid ${voucher.tierColor}40`,
              }}
            >
              {voucher.voucherCode}
            </Box>
          </Box>

          {/* Info Rows */}
          <Box className="bg-cream dark:bg-dark-card rounded-2xl px-4 py-1">
            {[
              { label: 'Tên khách hàng', value: voucher.memberName },
              { label: 'Hạng thẻ', value: voucher.memberTier, color: voucher.tierColor },
              { label: 'Loại quà', value: voucher.rewardType, isAccent: true },
              { label: 'Hạn sử dụng', value: formatDateShort(voucher.expiresAt) },
            ].map((row) => (
              <Box key={row.label} className="voucher-sheet-row">
                <Text className="voucher-sheet-label">{row.label}</Text>
                <Text
                  className="voucher-sheet-value"
                  style={{ color: row.color || (row.isAccent ? '#E8734A' : undefined) }}
                >
                  {row.value}
                </Text>
              </Box>
            ))}
            <Box className="voucher-sheet-row">
              <Text className="voucher-sheet-label">Trạng thái</Text>
              <Box className="status-badge" style={{
                background: voucher.status === 'valid' ? '#E6F5ED' : '#FDEDED',
                color: voucher.status === 'valid' ? '#3DAA6D' : '#D94F4F',
              }}>
                {voucher.status === 'valid' ? '✓ Hợp lệ' : '✕ Hết hạn'}
              </Box>
            </Box>
          </Box>

          {/* Apply */}
          <Box className="mt-6">
            <Button
              fullWidth
              size="large"
              loading={applying}
              disabled={applying || voucher.status !== 'valid'}
              onClick={handleApplyVoucher}
              className="!rounded-xl !font-semibold !text-base !shadow-sm"
              style={{
                background: voucher.status === 'valid' ? 'linear-gradient(135deg, #3DAA6D, #5EC88D)' : undefined,
              }}
            >
              Xác nhận áp dụng
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default ScanVoucherPage;
