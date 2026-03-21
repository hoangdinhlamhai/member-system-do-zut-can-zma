import React, { useState } from 'react';
import { Page, Button, Text, Box, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, memberAtom } from '../stores/auth';
import { api } from '../services/api';

const AddPhonePage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const member = useAtomValue(memberAtom);
  const setToken = useSetAtom(tokenAtom);
  const setMember = useSetAtom(memberAtom);

  const handleSubmit = async () => {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Vui lòng nhập SĐT hợp lệ (VD: 0987654321)');
      return;
    }
    setPhoneError('');

    try {
      setLoading(true);
      const response = await api.patch('/auth/complete-profile', { phone }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
      setMember(data.member);

      snackbar.openSnackbar({
        type: 'success',
        text: 'Đã cập nhật số điện thoại! ✅',
        duration: 2000,
      });
      navigate('/dashboard', { replace: true, animate: true, direction: 'forward' });
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      if (msg === 'PHONE_ALREADY_LINKED') {
        setPhoneError('SĐT này đã được liên kết với tài khoản khác');
      } else {
        snackbar.openSnackbar({
          type: 'error',
          text: 'Có lỗi xảy ra, vui lòng thử lại',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0f1923] to-[#1a2a3a]">
      <Box className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
        <Box className="text-center mb-8">
          {member?.zaloAvatar && (
            <img
              src={member.zaloAvatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-amber-400/50"
            />
          )}
          <Text className="text-2xl font-bold text-white mb-2">
            Thêm số điện thoại
          </Text>
          <Text className="text-white/60 text-sm">
            Nhập SĐT để thuận tiện quản lý tài khoản
          </Text>
        </Box>

        <Box className="w-full max-w-sm mb-6">
          <Text className="text-white/80 text-sm mb-2 font-medium">
            Số điện thoại
          </Text>
          <Input
            type="number"
            placeholder="0987654321"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
            maxLength={10}
            status={phoneError ? 'error' : undefined}
            errorText={phoneError}
            className="rounded-xl"
          />
        </Box>

        <Box className="w-full max-w-sm space-y-3">
          <Button
            fullWidth loading={loading} onClick={handleSubmit}
            className="rounded-xl h-12 bg-gradient-to-r from-amber-500 to-orange-500 font-bold"
          >
            Cập nhật SĐT
          </Button>
          <Button
            fullWidth variant="tertiary"
            onClick={() => navigate('/dashboard', { replace: true, animate: true, direction: 'forward' })}
            className="rounded-xl h-10 text-white/50"
          >
            Quay lại
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default AddPhonePage;
