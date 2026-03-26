import React, { useState, useEffect } from 'react';
import { Page, Button, Text, Box, Input, useNavigate } from 'zmp-ui';
import { useSetAtom } from 'jotai';
import { phoneLoginActionAtom, zaloLoginActionAtom, tokenAtom, memberAtom } from '../stores/auth';
import { api } from '../services/api';
import { sileo } from 'sileo';


const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [zaloLoading, setZaloLoading] = useState(false);

  const navigate = useNavigate();
  const phoneLoginAction = useSetAtom(phoneLoginActionAtom);
  const zaloLoginAction = useSetAtom(zaloLoginActionAtom);
  const setToken = useSetAtom(tokenAtom);
  const setMember = useSetAtom(memberAtom);
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);

  useEffect(() => {
    // Read ref from URL query params (direct link) or localStorage (via AuthGuard redirect)
    const searchParams = new URLSearchParams(window.location.search);
    const urlRef = searchParams.get('ref');
    const pendingRef = localStorage.getItem('pendingRefCode');
    
    const ref = urlRef || pendingRef || '';
    if (ref) {
      setRefCode(ref);
      // Clean up so it doesn't persist across sessions
      localStorage.removeItem('pendingRefCode');
    }
  }, []);

  // ═══ Zalo Login ═══
  const handleZaloLogin = async () => {
    try {
      setZaloLoading(true);

      const { performZaloAuth } = await import('../services/zalo-auth');
      const authResult = await performZaloAuth();

      const response = await api.post('/auth/zalo-login', {
        zaloId: authResult.userInfo.zaloId,
        zaloName: authResult.userInfo.zaloName,
        zaloAvatar: authResult.userInfo.zaloAvatar,
        authCode: authResult.authCode,
        codeVerifier: authResult.codeVerifier,
        refCode: refCode?.trim() || undefined,
      });

      const data = response.data;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userType', 'member');
      setToken(data.accessToken);
      setMember(data.member);

      if (data.isNewUser) {
        sileo.success({
          title: 'Chào mừng! 🎉',
          description: 'Bạn đã đăng ký thành công Zô Dứt Cạn',
          duration: 3000,
        });
        navigate('/complete-profile', { replace: true, animate: true, direction: 'forward' });
      } else {
        sileo.success({
          title: 'Đăng nhập thành công! ✅',
          description: 'Chào mừng bạn quay lại',
          duration: 2500,
        });
        navigate('/dashboard', { replace: true, animate: true, direction: 'forward' });
      }
    } catch (error: any) {
      console.error('Zalo login error:', error);
      setShowPhoneLogin(true);
      sileo.error({
        title: 'Đăng nhập Zalo thất bại',
        description: 'Thử đăng nhập bằng SĐT nhé!',
        duration: 3000,
      });
    } finally {
      setZaloLoading(false);
    }
  };

  // ═══ Phone Login (fallback) ═══
  const handlePhoneLogin = async () => {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Vui lòng nhập số điện thoại hợp lệ (VD: 0987xxx)');
      return;
    }
    setPhoneError('');

    try {
      setLoading(true);
      const data = await phoneLoginAction({
        phone,
        refCode: refCode ? refCode.trim() : undefined,
      });

      if (data.userType === 'staff') {
        sileo.success({
          title: `Xin chào ${data.staff?.fullName || 'Nhân viên'}! 👋`,
          description: 'Đăng nhập nhân viên thành công',
          duration: 2500,
        });
        navigate('/staff', { replace: true, animate: true, direction: 'forward' });
      } else {
        sileo.success({
          title: data.isNewUser ? 'Chào mừng! 🎉' : 'Đăng nhập thành công! ✅',
          description: data.isNewUser ? 'Bạn đã đăng ký thành công Zô Dứt Cạn' : 'Chào mừng bạn quay lại',
          duration: 2500,
        });
        navigate('/dashboard', { replace: true, animate: true, direction: 'forward' });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Vui lòng thử lại!';
      sileo.error({
        title: 'Đăng nhập thất bại',
        description: errorMsg,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="page min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <Box
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-hero)' }}
      />

      {/* Decorative circles */}
      <Box className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] rounded-full z-0 opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(200,149,108,0.4) 0%, transparent 70%)' }}
      />
      <Box className="absolute bottom-[20%] left-[-60px] w-[180px] h-[180px] rounded-full z-0 opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(200,149,108,0.3) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <Box className="relative z-10 flex flex-col items-center justify-center px-6 min-h-screen">
        {/* Logo / Brand */}
        <Box className="mb-10 text-center animate-fade-in">
          <Box className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-glow"
            style={{ background: 'linear-gradient(135deg, #C8956C, #A07248)' }}
          >
            <Text className="text-3xl text-white font-display font-bold">Z</Text>
          </Box>
          <Text className="text-white/90 font-display text-3xl font-bold tracking-tight">
            Zô Dứt Cạn
          </Text>
          <Text className="text-white/50 text-sm mt-2 font-light">
            Hệ thống thành viên & tích điểm
          </Text>
        </Box>

        {/* Login Card */}
        <Box className="w-full max-w-sm animate-slide-up">
          <Box className="bg-white/95 dark:bg-dark-surface/95 rounded-3xl p-6 shadow-elevated"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <Text className="text-text-main dark:text-dark-text font-semibold text-lg mb-5 text-center">
              Đăng nhập
            </Text>

            {/* Ref Code Input (always visible) */}
            {refCode && (
              <Box className="mb-4">
                <Text className="text-xs font-medium text-text-muted dark:text-dark-muted mb-1.5 ml-1">
                  Mã giới thiệu
                </Text>
                <Input
                  type="text"
                  placeholder="VD: ZDC-XXXXXX"
                  value={refCode}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                    setRefCode(val);
                  }}
                  className="!rounded-xl"
                />
              </Box>
            )}

            {/* ═══ Zalo Login Button (Primary) ═══ */}
            <Button
              onClick={handleZaloLogin}
              loading={zaloLoading}
              disabled={zaloLoading || loading}
              fullWidth
              size="large"
              className="!rounded-xl !font-semibold !text-base !shadow-sm !mb-3"
              style={{
                background: '#0068FF',
                color: '#fff',
              }}
            >
              <Box className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z" fill="white"/>
                  <path d="M33.6 15.6H14.4C13.08 15.6 12 16.68 12 18V30C12 31.32 13.08 32.4 14.4 32.4H20.4L24 36L27.6 32.4H33.6C34.92 32.4 36 31.32 36 30V18C36 16.68 34.92 15.6 33.6 15.6ZM17.4 27.6L15.6 25.8L22.2 19.2H16.2V17.4H25.2L17.4 27.6ZM28.8 28.8C27.48 28.8 26.4 27.72 26.4 26.4C26.4 25.08 27.48 24 28.8 24C30.12 24 31.2 25.08 31.2 26.4C31.2 27.72 30.12 28.8 28.8 28.8Z" fill="#0068FF"/>
                </svg>
                <span>Đăng nhập bằng Zalo</span>
              </Box>
            </Button>

            <Text className="text-text-muted/50 text-xs text-center mb-3">
              Đăng nhập nhanh, không cần nhập gì
            </Text>

            {/* ═══ Divider ═══ */}
            <Box className="flex items-center gap-3 mb-4">
              <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <Text className="text-text-muted/50 text-xs">hoặc</Text>
              <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </Box>

            {/* ═══ Phone Login Section ═══ */}
            {!showPhoneLogin ? (
              <Button
                onClick={() => setShowPhoneLogin(true)}
                fullWidth
                size="large"
                variant="tertiary"
                className="!rounded-xl !font-medium !text-sm"
              >
                Đăng nhập bằng số điện thoại
              </Button>
            ) : (
              <Box className="animate-slide-up">
                {/* Phone Input */}
                <Box className="mb-3">
                  <Text className="text-xs font-medium text-text-muted dark:text-dark-muted mb-1.5 ml-1">
                    Số điện thoại
                  </Text>
                  <Input
                    type="number"
                    placeholder="0987 654 321"
                    value={phone}
                    onChange={(e: any) => {
                      const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                      setPhone(val);
                      setPhoneError('');
                    }}
                    errorText={phoneError}
                    className="!rounded-xl"
                  />
                </Box>

                {/* Ref Code Input (if not shown above) */}
                {!refCode && (
                  <Box className="mb-4">
                    <Text className="text-xs font-medium text-text-muted dark:text-dark-muted mb-1.5 ml-1">
                      Mã giới thiệu <span className="text-text-muted/50">(tùy chọn)</span>
                    </Text>
                    <Input
                      type="text"
                      placeholder="VD: ZDC-XXXXXX"
                      value={refCode}
                      onChange={(e: any) => {
                        const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                        setRefCode(val);
                      }}
                      className="!rounded-xl"
                    />
                  </Box>
                )}

                {/* Phone Login Button */}
                <Button
                  onClick={handlePhoneLogin}
                  loading={loading}
                  disabled={loading || phone.length < 10}
                  fullWidth
                  size="large"
                  className="!rounded-xl !font-semibold !text-base !shadow-sm"
                  style={{
                    background: phone.length >= 10 ? 'var(--gradient-primary)' : undefined,
                  }}
                >
                  Đăng nhập
                </Button>
              </Box>
            )}
          </Box>

          {/* Footer note */}
          <Text className="text-white/30 text-xs text-center mt-6 px-4">
            Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng của chúng tôi.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default LoginPage;
