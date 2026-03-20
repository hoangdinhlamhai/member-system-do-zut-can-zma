import React, { useState, useEffect } from 'react';
import { Page, Button, Text, Box, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { useSetAtom } from 'jotai';
import { phoneLoginActionAtom } from '../stores/auth';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const phoneLoginAction = useSetAtom(phoneLoginActionAtom);
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlRef = searchParams.get('ref');
    if (urlRef) setRefCode(urlRef);
  }, []);

  const handleLogin = async () => {
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
        snackbar.openSnackbar({
          type: 'success',
          text: `Xin chào ${data.staff?.fullName || 'Nhân viên'}!`,
          duration: 2000,
        });
        navigate('/staff', { replace: true, animate: true, direction: 'forward' });
      } else {
        snackbar.openSnackbar({
          type: 'success',
          text: data.isNewUser ? 'Chào mừng bạn đến với Zô Dứt Cạn!' : 'Đăng nhập thành công!',
          duration: 2000,
        });
        navigate('/dashboard', { replace: true, animate: true, direction: 'forward' });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      snackbar.openSnackbar({
        type: 'error',
        text: errorMsg,
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

            {/* Phone Input */}
            <Box className="mb-4">
              <Text className="text-xs font-medium text-text-muted dark:text-dark-muted mb-1.5 ml-1">
                Số điện thoại
              </Text>
              <Input
                type="tel"
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

            {/* Ref Code Input */}
            <Box className="mb-6">
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

            {/* Login Button */}
            <Button
              onClick={handleLogin}
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
