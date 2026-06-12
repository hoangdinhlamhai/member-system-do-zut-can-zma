// ══════════════════════════════════════════════════════════
// Scanner Page — Quét QR đa năng (Voucher + Xác thực TV)
// ══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { Page, Box, Text, Button, Sheet, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { scanQRCode } from 'zmp-sdk/apis';
import { api } from '../../services/api';

interface VoucherInfo {
  voucherCode: string;
  status: 'active' | 'used' | 'expired';
  type: string;
  title: string;
  description: string;
  discountPercent: number | null;
  expiresAt: string;
  memberName: string;
  memberPhone: string;
}

interface MemberInfo {
  id: string;
  phone: string;
  zaloName?: string | null;
  fullName?: string | null;
  pointsBalance?: number | null;
}

const ScanVoucherPage: React.FC = () => {
  const [voucher, setVoucher] = useState<VoucherInfo | null>(null);
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [scanning, setScanning] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [applying, setApplying] = useState(false);
  const [scanError, setScanError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  /** Detect QR type and extract data */
  const detectQrType = (qrData: string): { type: 'voucher' | 'member' | 'unknown'; value: string } => {
    const trimmed = qrData.trim();
    // Voucher: ZDC:VOUCHER:{code}
    if (trimmed.startsWith('ZDC:VOUCHER:')) {
      return { type: 'voucher', value: trimmed.replace('ZDC:VOUCHER:', '') };
    }
    // Voucher: raw code ZDC-V-XXXXXXXX
    if (trimmed.startsWith('ZDC-V-')) {
      return { type: 'voucher', value: trimmed };
    }
    // Member: ZDC:{memberId}:{timestamp}:{hash}
    if (trimmed.startsWith('ZDC:') && trimmed.split(':').length >= 3) {
      return { type: 'member', value: trimmed };
    }
    return { type: 'unknown', value: trimmed };
  };

  /** Xử lý QR sau khi quét — tự nhận dạng loại */
  const handleQrContent = async (rawContent: string) => {
    const { type, value } = detectQrType(rawContent);

    if (type === 'voucher') {
      // → Verify voucher
      try {
        const res = await api.get(`/api/v1/staff/verify-voucher/${value}`);
        if (res.data?.success && res.data?.data) {
          setVoucher(res.data.data);
          setMemberInfo(null);
          setSheetVisible(true);
          setScanError('');
        } else {
          setScanError(res.data?.message || 'Không tìm thấy voucher.');
        }
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Không tìm thấy voucher.';
        setScanError(msg === 'VOUCHER_NOT_FOUND' ? 'Mã voucher không tồn tại.' : msg);
      }
    } else if (type === 'member') {
      // → Identify member
      try {
        const res = await api.post('/api/v1/staff/identify-member', { qrData: value });
        if (res.data?.success && res.data?.data) {
          setMemberInfo(res.data.data);
          setVoucher(null);
          setSheetVisible(true);
          setScanError('');
        } else {
          setScanError(res.data?.message || 'Không tìm thấy thành viên.');
        }
      } catch (error: any) {
        const code = error.response?.data?.message;
        let msg = 'Không nhận dạng được thành viên.';
        if (code === 'QR_EXPIRED') msg = 'Mã QR đã hết hạn. Yêu cầu khách tải lại.';
        if (code === 'MEMBER_NOT_FOUND') msg = 'Không tìm thấy thành viên.';
        setScanError(msg);
      }
    } else {
      setScanError('Mã QR không hợp lệ. Hỗ trợ: QR voucher hoặc QR xác thực thành viên.');
    }
  };

  /** Quét QR bằng camera native Zalo */
  const handleScan = async () => {
    setScanning(true);
    setScanError('');
    try {
      const data = await scanQRCode({});
      console.log('[SCANNER] scanQRCode result:', JSON.stringify(data));

      const content =
        typeof data === 'string'
          ? data
          : (data as any)?.content ?? (data as any)?.data ?? (data as any)?.result ?? '';

      if (!content) {
        setScanError('Không đọc được nội dung QR. Hãy thử nhập mã thủ công.');
        setShowManualInput(true);
        return;
      }

      await handleQrContent(content);
    } catch (error: any) {
      console.error('[SCANNER] scanQRCode error:', error);
      setScanError('Không thể mở camera. Bạn có thể nhập mã thủ công.');
      setShowManualInput(true);
    } finally {
      setScanning(false);
    }
  };

  /** Nhập mã thủ công */
  const handleManualVerify = async () => {
    if (!manualCode.trim()) return;
    setScanning(true);
    setScanError('');
    await handleQrContent(manualCode.trim());
    setScanning(false);
  };

  /** Xác nhận áp dụng voucher */
  const handleApplyVoucher = async () => {
    if (!voucher) return;
    setApplying(true);
    try {
      const res = await api.post(
        `/api/v1/staff/apply-voucher/${voucher.voucherCode}`,
      );
      setSheetVisible(false);
      snackbar.openSnackbar({
        type: 'success',
        text: res.data?.message || `Đã áp dụng voucher ${voucher.title}!`,
        duration: 3000,
      });
      setVoucher(null);
      setManualCode('');
    } catch (error: any) {
      const code = error.response?.data?.message;
      let msg = 'Áp dụng voucher thất bại.';
      if (code === 'VOUCHER_ALREADY_USED') msg = 'Voucher này đã được sử dụng.';
      if (code === 'VOUCHER_EXPIRED') msg = 'Voucher đã hết hạn.';
      snackbar.openSnackbar({ type: 'error' as any, text: msg, duration: 3000 });
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));

  const statusConfig = {
    active: { label: '✓ Hợp lệ', bg: '#E6F5ED', color: '#3DAA6D' },
    used: { label: '✕ Đã sử dụng', bg: '#FDEDED', color: '#D94F4F' },
    expired: { label: '✕ Hết hạn', bg: '#FDEDED', color: '#D94F4F' },
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
            Quét QR
          </Text>
        </Box>
      </Box>

      {/* ─── Scanner Area ──────────────────────────── */}
      <Box className="px-5 -mt-4 relative z-10">
        <Box className="scan-viewfinder animate-scale-in">
          <Box className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
            {(voucher || memberInfo) ? (
              <Box className="text-center animate-scale-in">
                <Box className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-success/20 flex items-center justify-center">
                  <Text className="text-3xl">✅</Text>
                </Box>
                <Text className="text-success font-semibold">
                  Đã quét thành công!
                </Text>
              </Box>
            ) : (
              <Box className="text-center">
                <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Text className="text-3xl">📷</Text>
                </Box>
                <Text className="text-white/50 text-sm font-medium">
                  Quét mã QR voucher hoặc xác thực thành viên
                </Text>
              </Box>
            )}
          </Box>
          {scanning && <Box className="scan-line" />}
        </Box>
      </Box>

      {/* ─── Actions ─────────────────────────────────── */}
      <Box className="px-5 mt-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Scan Button */}
        <Button
          fullWidth
          size="large"
          loading={scanning}
          disabled={scanning}
          onClick={handleScan}
          className="!rounded-xl !font-semibold !text-base !shadow-sm"
          style={{ background: 'linear-gradient(135deg, #E8734A, #FF9D7A)' }}
        >
          {scanning ? 'Đang quét...' : '📷 Quét mã QR'}
        </Button>

        {/* Toggle manual input */}
        <Box className="flex justify-center mt-3">
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-xs text-primary font-medium underline underline-offset-2 cursor-pointer bg-transparent border-none"
          >
            {showManualInput ? 'Ẩn nhập mã thủ công' : 'Nhập mã thủ công'}
          </button>
        </Box>

        {/* Manual Input */}
        {showManualInput && (
          <Box className="mt-3 animate-slide-up">
            <Box className="flex gap-2">
              <Box className="flex-1">
                <Input
                  type="text"
                  placeholder="VD: ZDC-V-ABCD1234"
                  value={manualCode}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                    setManualCode(val);
                  }}
                  className="!rounded-xl"
                />
              </Box>
              <Button
                size="large"
                loading={scanning}
                disabled={scanning || !manualCode.trim()}
                onClick={handleManualVerify}
                className="!rounded-xl !font-semibold !px-5"
                style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
              >
                Tra cứu
              </Button>
            </Box>
          </Box>
        )}

        {/* Error */}
        {scanError && (
          <Box className="mt-3 bg-error/10 border border-error/20 rounded-xl px-4 py-3 animate-scale-in">
            <Text className="text-error text-sm text-center font-medium">
              {scanError}
            </Text>
          </Box>
        )}

        <Text className="text-center text-text-muted/60 dark:text-dark-muted/60 text-xs mt-3">
          Hỗ trợ: QR voucher + QR xác thực thành viên
        </Text>
      </Box>

      {/* ─── Result Sheet (Voucher OR Member) ─────── */}
      <Sheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler
        title={voucher ? 'Thông tin Voucher' : 'Thông tin Thành viên'}
      >
        {/* ── Voucher Result ── */}
        {voucher && (
          <Box className="px-5 pb-8">
            <Box className="flex justify-center mb-5">
              <Box
                className="px-5 py-2 rounded-xl text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #E8734A15, #E8734A30)',
                  color: '#E8734A',
                  border: '1.5px solid #E8734A40',
                }}
              >
                {voucher.voucherCode}
              </Box>
            </Box>

            <Box className="bg-cream dark:bg-dark-card rounded-2xl px-4 py-1">
              {[
                { label: 'Tên khách hàng', value: voucher.memberName },
                { label: 'SĐT', value: voucher.memberPhone || 'N/A' },
                { label: 'Loại', value: voucher.title, isAccent: true },
                ...(voucher.description
                  ? [{ label: 'Chi tiết', value: voucher.description }]
                  : []),
                { label: 'Hạn sử dụng', value: formatDate(voucher.expiresAt) },
              ].map((row) => (
                <Box key={row.label} className="voucher-sheet-row">
                  <Text className="voucher-sheet-label">{row.label}</Text>
                  <Text
                    className="voucher-sheet-value"
                    style={{ color: (row as any).isAccent ? '#E8734A' : undefined }}
                  >
                    {row.value}
                  </Text>
                </Box>
              ))}
              <Box className="voucher-sheet-row">
                <Text className="voucher-sheet-label">Trạng thái</Text>
                <Box
                  className="status-badge"
                  style={{
                    background: statusConfig[voucher.status].bg,
                    color: statusConfig[voucher.status].color,
                  }}
                >
                  {statusConfig[voucher.status].label}
                </Box>
              </Box>
            </Box>

            <Box className="mt-6">
              <Button
                fullWidth
                size="large"
                loading={applying}
                disabled={applying || voucher.status !== 'active'}
                onClick={handleApplyVoucher}
                className="!rounded-xl !font-semibold !text-base !shadow-sm"
                style={{
                  background:
                    voucher.status === 'active'
                      ? 'linear-gradient(135deg, #3DAA6D, #5EC88D)'
                      : undefined,
                }}
              >
                {voucher.status === 'active'
                  ? 'Xác nhận áp dụng'
                  : voucher.status === 'used'
                    ? 'Đã sử dụng'
                    : 'Đã hết hạn'}
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Member Result ── */}
        {memberInfo && (
          <Box className="px-5 pb-8">
            <Box className="flex justify-center mb-5">
              <Box
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
              >
                {(memberInfo.zaloName || memberInfo.fullName || 'K')?.charAt(0)}
              </Box>
            </Box>

            <Box className="bg-cream dark:bg-dark-card rounded-2xl px-4 py-1">
              {[
                { label: 'Tên', value: memberInfo.zaloName || memberInfo.fullName || 'Khách hàng' },
                { label: 'SĐT', value: memberInfo.phone || 'N/A' },
                { label: 'Điểm tích lũy', value: `${memberInfo.pointsBalance ?? 0} điểm`, isAccent: true },
              ].map((row) => (
                <Box key={row.label} className="voucher-sheet-row">
                  <Text className="voucher-sheet-label">{row.label}</Text>
                  <Text
                    className="voucher-sheet-value"
                    style={{ color: (row as any).isAccent ? '#3DAA6D' : undefined }}
                  >
                    {row.value}
                  </Text>
                </Box>
              ))}
            </Box>

            <Box className="mt-5 flex gap-3">
              <Button
                fullWidth
                size="large"
                onClick={() => {
                  setSheetVisible(false);
                  navigate('/staff/manual-bill');
                }}
                className="!rounded-xl !font-semibold !text-base !shadow-sm"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Nhập bill cho khách này
              </Button>
            </Box>

            <Box className="mt-3">
              <Button
                fullWidth
                size="large"
                variant="secondary"
                onClick={() => {
                  setSheetVisible(false);
                  setMemberInfo(null);
                }}
                className="!rounded-xl !font-semibold !text-base"
              >
                Quét mã khác
              </Button>
            </Box>
          </Box>
        )}
      </Sheet>
    </Page>
  );
};

export default ScanVoucherPage;
