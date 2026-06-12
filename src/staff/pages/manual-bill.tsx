// ══════════════════════════════════════════════════════════
// Manual Bill Page — Nhập Bill Thủ Công (API thật + Upload ảnh)
// ══════════════════════════════════════════════════════════
import React, { useState, useRef, useCallback } from 'react';
import { Page, Box, Text, Button, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { scanQRCode } from 'zmp-sdk/apis';
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
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [member, setMember] = useState<MemberResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [scanningQR, setScanningQR] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [billCodeError, setBillCodeError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  // ─── Scan QR member ─────────────────────────────────
  const handleScanMemberQR = async () => {
    setScanningQR(true);
    setSearchError('');
    try {
      const data = await scanQRCode({});
      console.log('[MANUAL_BILL] scanQRCode result:', JSON.stringify(data));

      // Defensive: handle multiple possible return formats
      const content =
        typeof data === 'string'
          ? data
          : (data as any)?.content ?? (data as any)?.data ?? (data as any)?.result ?? '';

      if (!content) {
        setSearchError('Không đọc được mã QR. Vui lòng thử lại hoặc nhập SĐT.');
        return;
      }

      // Gọi API identify member
      const res = await api.post('/api/v1/staff/identify-member', {
        qrData: content,
      });

      if (res.data?.success && res.data?.data) {
        const m = res.data.data;
        setMember(m);
        setMemberPhone(m.phone || '');
        setSearchError('');
        snackbar.openSnackbar({
          type: 'success',
          text: `Đã nhận diện: ${m.zaloName || m.fullName || m.phone}`,
          duration: 2000,
        });
      } else {
        setSearchError(res.data?.message || 'Không tìm thấy khách hàng.');
      }
    } catch (error: any) {
      console.error('[MANUAL_BILL] scanQRCode error:', error);
      const code = error.response?.data?.message;
      let msg = 'Quét QR thất bại. Vui lòng nhập SĐT.';
      if (code === 'QR_EXPIRED') msg = 'Mã QR đã hết hạn. Yêu cầu khách tải lại.';
      if (code === 'QR_FORMAT_INVALID') msg = 'Mã QR không hợp lệ.';
      if (code === 'MEMBER_NOT_FOUND') msg = 'Không tìm thấy thành viên.';
      setSearchError(msg);
    } finally {
      setScanningQR(false);
    }
  };

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
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Upload image via GCS Signed URL (bypass Vercel) ──
  const uploadBillImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    console.log('[UPLOAD] Starting upload...', { fileName: file.name, size: file.size, type: file.type });

    try {
      // Step 1: Get signed URL from backend (small JSON request)
      console.log('[UPLOAD] Step 1: Getting signed URL...');
      const signedRes = await api.get('/api/v1/upload/signed-url', {
        params: {
          fileName: file.name,
          contentType: file.type || 'image/jpeg',
        },
      });

      if (!signedRes.data?.success || !signedRes.data?.data?.signedUrl) {
        alert('❌ Không lấy được signed URL từ server:\n' + JSON.stringify(signedRes.data));
        return null;
      }

      const { signedUrl, publicUrl, fileName } = signedRes.data.data;
      console.log('[UPLOAD] Step 1 OK. Got signed URL for:', fileName);

      // Step 2: Upload directly to GCS (bypasses Vercel — no size limit)
      console.log('[UPLOAD] Step 2: Uploading to GCS directly...');
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        alert(`❌ Upload lên GCS thất bại!\n\nStatus: ${uploadRes.status}\n${errText.slice(0, 300)}`);
        return null;
      }

      console.log('[UPLOAD] Step 2 OK. File uploaded to GCS.');
      console.log('[UPLOAD] Public URL:', publicUrl);
      return publicUrl;

    } catch (error: any) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;
      const errCode = error.code;
      const errMsg = error.message;

      console.error('[UPLOAD] Failed:', { status, serverMsg, errCode, errMsg });

      let alertText = `❌ Upload ảnh thất bại! (${sizeMB}MB)\n\n`;
      if (errCode === 'ECONNABORTED') {
        alertText += `⏱ Timeout: Request quá lâu.\nẢnh ${sizeMB}MB có thể quá lớn hoặc mạng yếu.`;
      } else if (errCode === 'ERR_NETWORK') {
        alertText += `🌐 Network Error: Không kết nối được server.`;
      } else if (status) {
        alertText += `🔴 Server Error ${status}:\n${serverMsg || errMsg}`;
      } else {
        alertText += `⚠️ Lỗi: ${errMsg}\nCode: ${errCode || 'unknown'}`;
      }

      alert(alertText);

      snackbar.openSnackbar({
        type: 'error',
        text: serverMsg || errMsg || 'Upload ảnh thất bại.',
        duration: 3000,
      });
      return null;
    } finally {
      setUploading(false);
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
      // Upload image first if exists
      let billImageUrl: string | null = null;
      console.log('[SUBMIT] imageFile:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'none');

      if (imageFile) {
        billImageUrl = await uploadBillImage(imageFile);
        console.log('[SUBMIT] Upload result:', billImageUrl);
        // If upload failed but image was selected, warn but don't block
        if (!billImageUrl) {
          snackbar.openSnackbar({
            type: 'warning',
            text: 'Upload ảnh thất bại, bill vẫn được gửi không kèm ảnh.',
            duration: 3000,
          });
        }
      }

      const payload: Record<string, any> = {
        pos_bill_code: billCode.trim(),
        amount: Number(amount),
        member_id: member!.id,
      };

      if (billImageUrl) {
        payload.bill_image_url = billImageUrl;
      }

      console.log('[SUBMIT] Sending payload:', payload);
      const response = await api.post('/api/v1/transactions/manual', payload);
      console.log('[SUBMIT] Response:', response.data);
      snackbar.openSnackbar({
        type: 'success',
        text: response.data?.message || `Đã gửi bill ${billCode} để phê duyệt!`,
        duration: 3000,
      });
      setAmount('');
      setBillCode('');
      setMemberPhone('');
      setMember(null);
      removeImage();
    } catch (error: any) {
      console.error('[SUBMIT] Failed:', error.response?.status, error.response?.data || error.message);
      snackbar.openSnackbar({
        type: 'error',
        text: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUploading = uploading || submitting;

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
          {/* Quét QR khách hàng */}
          {!member && (
            <Box className="mb-5 animate-slide-up">
              <Button
                fullWidth
                size="large"
                loading={scanningQR}
                disabled={scanningQR}
                onClick={handleScanMemberQR}
                className="!rounded-xl !font-semibold !text-base !shadow-sm"
                style={{ background: 'linear-gradient(135deg, #3DAA6D, #5EC88D)' }}
              >
                {scanningQR ? 'Đang quét...' : '📷 Quét QR Khách Hàng'}
              </Button>
              <Text className="text-center text-text-muted/60 text-xs mt-2">
                Hoặc nhập SĐT bên dưới
              </Text>
            </Box>
          )}

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
                {uploading && (
                  <Box className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Box className="bg-white rounded-xl px-4 py-2 flex items-center gap-2">
                      <Box className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <Text className="text-sm font-medium text-text-main">Đang upload...</Text>
                    </Box>
                  </Box>
                )}
                <Box
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-error/90 text-white flex items-center justify-center cursor-pointer active:bg-error text-sm font-bold shadow-card transition-colors"
                  onClick={removeImage}
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
            loading={submitting || uploading}
            disabled={!member || !amount || !billCode.trim()}
            onClick={handleSubmit}
            className="!rounded-xl !font-semibold !text-base !shadow-sm"
            style={{
              background: member && amount && billCode.trim() ? 'var(--gradient-primary)' : undefined,
            }}
          >
            {uploading ? 'Đang upload ảnh...' : submitting ? 'Đang gửi...' : 'Gửi phê duyệt'}
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
