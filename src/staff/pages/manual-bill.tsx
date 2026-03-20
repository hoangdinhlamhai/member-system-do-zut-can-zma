// ══════════════════════════════════════════════════════════
// Manual Bill Page — Nhập Bill Thủ Công (API thật)
// ══════════════════════════════════════════════════════════
import React, { useState, useRef, useCallback } from 'react';
import { Page, Box, Text, Button, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { api } from '../../services/api';

interface MemberResult {
  id: string;
  phone: string;
  zaloName?: string | null;
  fullName?: string | null;
  pointsBalance?: number | null;
}

const ManualBillPage: React.FC = () => {
  const [memberPhone, setMemberPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [billCode, setBillCode] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [member, setMember] = useState<MemberResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [billCodeError, setBillCodeError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  // ─── Search member ───────────────────────────────────
  const searchMember = useCallback(async (phone: string) => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length < 10) {
      setMember(null);
      setSearchError('');
      return;
    }
    setSearching(true);
    setSearchError('');
    try {
      const response = await api.get('/api/v1/transactions/search-member', {
        params: { phone: cleaned },
      });
      if (response.data?.success && response.data?.data) {
        setMember(response.data.data);
        setSearchError('');
      } else {
        setMember(null);
        setSearchError(response.data?.message || 'Không tìm thấy khách hàng.');
      }
    } catch (error: any) {
      setMember(null);
      setSearchError(error.response?.data?.message || 'Không tìm thấy khách hàng.');
    } finally {
      setSearching(false);
    }
  }, []);

  const handlePhoneChange = (e: any) => {
    const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
    setMemberPhone(val);
    setMember(null);
    setSearchError('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const cleaned = val.replace(/[^\d]/g, '');
    if (cleaned.length >= 10) {
      searchTimeoutRef.current = setTimeout(() => searchMember(val), 500);
    }
  };

  const handleAmountChange = (e: any) => {
    const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
    setAmount(val.replace(/[^\d]/g, ''));
    setAmountError('');
  };

  const displayAmount = amount ? new Intl.NumberFormat('vi-VN').format(Number(amount)) : '';

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    if (!member) { setSearchError('Vui lòng tìm và chọn khách hàng trước.'); hasError = true; }
    if (!amount || Number(amount) < 1000) { setAmountError('Số tiền phải ≥ 1.000đ'); hasError = true; }
    if (!billCode.trim()) { setBillCodeError('Vui lòng nhập mã bill'); hasError = true; }
    if (hasError) return;

    setSubmitting(true);
    try {
      const response = await api.post('/api/v1/transactions/manual', {
        pos_bill_code: billCode.trim(),
        amount: Number(amount),
        member_id: member!.id,
      });
      snackbar.openSnackbar({
        type: 'success',
        text: response.data?.message || `Đã gửi bill ${billCode} để phê duyệt!`,
        duration: 3000,
      });
      setAmount('');
      setBillCode('');
      setMemberPhone('');
      setMember(null);
      setImagePreview(null);
    } catch (error: any) {
      snackbar.openSnackbar({
        type: 'error',
        text: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
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
            Nhập Bill Thủ Công
          </Text>
        </Box>
      </Box>

      {/* ─── Form ───────────────────────────────────── */}
      <Box className="px-5 -mt-4 relative z-10">
        <Box className="bg-white dark:bg-dark-surface rounded-3xl p-5 shadow-card border border-black/[0.03] dark:border-dark-border animate-slide-up">
          {/* SĐT Khách hàng */}
          <Box className="mb-5">
            <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-2 flex items-center gap-1.5">
              <Box className="w-5 h-5 rounded-md bg-info-light flex items-center justify-center">
                <Text className="text-[10px]">👤</Text>
              </Box>
              SĐT Khách hàng <span className="text-error text-xs">*</span>
            </Text>
            <Input
              type="text"
              placeholder="0901234567"
              value={memberPhone}
              onChange={handlePhoneChange}
              errorText={searchError}
              className="!rounded-xl"
            />
            {searching && (
              <Text className="text-xs text-primary mt-1.5 ml-1 animate-pulse-soft font-medium">
                Đang tìm kiếm...
              </Text>
            )}
            {member && (
              <Box className="mt-3 bg-success-light dark:bg-success/10 border border-success/20 rounded-2xl p-3.5 flex items-center gap-3 animate-scale-in">
                <Box className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
                >
                  {(member.zaloName || member.fullName || 'K')?.charAt(0)}
                </Box>
                <Box className="flex-1 min-w-0">
                  <Text className="font-semibold text-sm text-text-main dark:text-dark-text truncate">
                    {member.zaloName || member.fullName || 'Khách hàng'}
                  </Text>
                  <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">
                    {member.phone} · {member.pointsBalance ?? 0} điểm
                  </Text>
                </Box>
                <Box className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </Box>
              </Box>
            )}
          </Box>

          {/* Số tiền */}
          <Box className="mb-5">
            <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-2 flex items-center gap-1.5">
              <Box className="w-5 h-5 rounded-md bg-warning-light flex items-center justify-center">
                <Text className="text-[10px]">💰</Text>
              </Box>
              Số tiền hóa đơn <span className="text-error text-xs">*</span>
            </Text>
            <Input
              type="text"
              placeholder="350,000"
              value={displayAmount}
              onChange={handleAmountChange}
              errorText={amountError}
              className="!rounded-xl !text-lg !font-semibold"
            />
            {amount && (
              <Text className="text-xs text-text-muted dark:text-dark-muted mt-1.5 ml-1 font-medium">
                = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount))}
              </Text>
            )}
          </Box>

          {/* Mã bill */}
          <Box className="mb-5">
            <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-2 flex items-center gap-1.5">
              <Box className="w-5 h-5 rounded-md bg-primary-100 flex items-center justify-center">
                <Text className="text-[10px]">🏷️</Text>
              </Box>
              Mã bill <span className="text-error text-xs">*</span>
            </Text>
            <Input
              type="text"
              placeholder="BILL-20260316-001"
              value={billCode}
              onChange={(e: any) => {
                const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                setBillCode(val);
                setBillCodeError('');
              }}
              errorText={billCodeError}
              className="!rounded-xl"
            />
          </Box>

          {/* Upload ảnh */}
          <Box className="mb-2">
            <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-2 flex items-center gap-1.5">
              <Box className="w-5 h-5 rounded-md bg-cream flex items-center justify-center">
                <Text className="text-[10px]">📸</Text>
              </Box>
              Ảnh bill gốc <span className="text-text-muted text-xs font-normal">(tùy chọn)</span>
            </Text>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
            {!imagePreview ? (
              <Box className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <Box className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                  <Text className="text-2xl">📷</Text>
                </Box>
                <Text className="text-sm font-medium text-text-muted dark:text-dark-muted">
                  Chụp ảnh hoặc chọn từ thư viện
                </Text>
              </Box>
            ) : (
              <Box className="relative rounded-2xl overflow-hidden shadow-soft">
                <img src={imagePreview} alt="Bill preview" className="w-full object-cover max-h-56" />
                <Box
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-error/90 text-white flex items-center justify-center cursor-pointer active:bg-error text-sm font-bold shadow-card transition-colors"
                  onClick={() => setImagePreview(null)}
                >
                  ✕
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* ─── Submit ────────────────────────────────── */}
        <Box className="mt-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Button
            fullWidth
            size="large"
            loading={submitting}
            disabled={submitting || !member || !amount || !billCode.trim()}
            onClick={handleSubmit}
            className="!rounded-xl !font-semibold !text-base !shadow-sm"
            style={{
              background: member && amount && billCode.trim() ? 'var(--gradient-primary)' : undefined,
            }}
          >
            Gửi phê duyệt
          </Button>
        </Box>

        <Text className="text-center text-text-muted/60 dark:text-dark-muted/60 text-xs mt-3 px-4">
          Bill sẽ được gửi đến quản lý để phê duyệt trước khi cộng điểm.
        </Text>
      </Box>

      <Box className="h-8" />
    </Page>
  );
};

export default ManualBillPage;
