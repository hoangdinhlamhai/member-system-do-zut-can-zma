import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useMember } from '../../hooks/use-member';

const HowItWorks: React.FC = () => {
  const { member } = useMember();

  if (!member) return null;

  const percent = member.referralBonusPercent || 5;

  const steps = [
    {
      num: '1',
      title: 'Chia sẻ mã cho bạn bè',
      desc: 'Gửi link hoặc mã để bạn bè đăng ký thành viên mới',
      color: 'primary',
    },
    {
      num: '2',
      title: 'Bạn bè đến ăn uống',
      desc: 'Họ đọc SĐT hoặc quét thẻ thành viên khi thanh toán',
      color: 'primary',
    },
    {
      num: '3',
      title: `Nhận ngay ${percent}% giá trị hóa đơn`,
      desc: 'Quy đổi thành Điểm: 1 Điểm = 1,000VNĐ. Nhận trọn đời!',
      color: 'success',
    },
  ];

  return (
    <Box className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
        <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-4">
          Cách hoạt động
        </Text>

        <Box className="space-y-4">
          {steps.map((step) => (
            <Box key={step.num} className="flex items-start gap-3.5">
              <Box className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                step.color === 'success'
                  ? 'bg-success-light text-success'
                  : 'bg-primary-50 text-primary'
              }`}>
                {step.num}
              </Box>
              <Box>
                <Text className="text-sm font-medium text-text-main dark:text-dark-text">{step.title}</Text>
                <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">{step.desc}</Text>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Example */}
        <Box className="mt-5 bg-cream dark:bg-dark-card p-4 rounded-xl border border-black/[0.03] dark:border-dark-border">
          <Text className="text-xs font-semibold text-text-main dark:text-dark-text mb-1.5">
            Ví dụ minh họa
          </Text>
          <Text className="text-[11px] text-text-muted dark:text-dark-muted leading-relaxed">
            Giao dịch bạn bè <strong className="text-text-main dark:text-dark-text">500.000đ</strong> → Bạn nhận{' '}
            <strong className="text-success">{percent}% = 25.000đ</strong>
            {' '}(quy ra <strong className="text-success">25 Điểm</strong>) trực tiếp vào ví.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorks;
