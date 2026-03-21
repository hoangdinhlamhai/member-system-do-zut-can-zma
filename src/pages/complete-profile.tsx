import React, { useState } from 'react';
import { Page, Button, Text, Box, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { useAtomValue } from 'jotai';
import { tokenAtom, memberAtom } from '../stores/auth';
import { api } from '../services/api';

const CompleteProfilePage: React.FC = () => {
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const member = useAtomValue(memberAtom);

  const handleSubmit = async () => {
    if (!refCode.trim()) {
      snackbar.openSnackbar({
        type: 'error',
        text: 'Vui lòng nhập mã giới thiệu',
        duration: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      await api.patch('/auth/complete-profile', { refCode: refCode.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      snackbar.openSnackbar({
        type: 'success',
        text: 'Đã áp dụng mã giới thiệu! 🎉',
        duration: 2000,
      });
      navigate('/dashboard', { replace: true, animate: true, direction: 'forward' });
    } catch (error: any) {
      snackbar.openSnackbar({
        type: 'error',
        text: 'Mã giới thiệu không hợp lệ, vui lòng thử lại',
        duration: 3000,
      });
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
            Chào {member?.zaloName || 'bạn'} 👋
          </Text>
          <Text className="text-white/60 text-sm">
            Bạn có mã giới thiệu từ bạn bè không?
          </Text>
        </Box>

        <Box className="w-full max-w-sm mb-6">
          <Text className="text-white/80 text-sm mb-2 font-medium">
            Mã giới thiệu
          </Text>
          <Input
            type="text"
            placeholder="VD: ZDC-ABC123"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            maxLength={20}
            className="rounded-xl"
          />
          <Text className="text-white/40 text-xs mt-1">
            Nhập mã từ bạn bè để cả hai cùng nhận ưu đãi!
          </Text>
        </Box>

        <Box className="w-full max-w-sm space-y-3">
          <Button
            fullWidth loading={loading} onClick={handleSubmit}
            className="rounded-xl h-12 bg-gradient-to-r from-amber-500 to-orange-500 font-bold"
          >
            Áp dụng mã giới thiệu
          </Button>
          <Button
            fullWidth variant="tertiary"
            onClick={() => navigate('/dashboard', { replace: true, animate: true, direction: 'forward' })}
            className="rounded-xl h-10 text-white/50"
          >
            Bỏ qua
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default CompleteProfilePage;
