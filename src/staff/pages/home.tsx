// ══════════════════════════════════════════════════════════
// Staff Home Page — Trang chủ Nhân viên
// ══════════════════════════════════════════════════════════
import React from 'react';
import { Page, Box, Text, Button, useNavigate } from 'zmp-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { staffUserAtom, isStoreManagerAtom } from '../stores/staff-auth';
import { logoutActionAtom } from '../../stores/auth';

const StaffHomePage: React.FC = () => {
  const staff = useAtomValue(staffUserAtom);
  const isManager = useAtomValue(isStoreManagerAtom);
  const navigate = useNavigate();
  const logout = useSetAtom(logoutActionAtom);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, animate: true, direction: 'forward' });
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'store_manager':
      case 'manager':
        return 'Quản lý cửa hàng';
      case 'cashier':
        return 'Thu ngân';
      default:
        return role;
    }
  };

  const menuItems = [
    {
      label: 'Quét Voucher',
      desc: 'Scan QR khách hàng',
      icon: '📷',
      gradient: 'linear-gradient(135deg, #E8734A, #FF9D7A)',
      route: '/staff/scan',
      show: true,
    },
    {
      label: 'Nhập Bill',
      desc: 'Nhập hóa đơn thủ công',
      icon: '📝',
      gradient: 'linear-gradient(135deg, #3DAA6D, #5EC88D)',
      route: '/staff/manual-bill',
      show: true,
    },
    {
      label: 'Duyệt Bill',
      desc: 'Phê duyệt hóa đơn chờ',
      icon: '✅',
      gradient: 'linear-gradient(135deg, #4A8FD4, #6BABEB)',
      route: '/staff/approve-bill',
      show: isManager,
      span2: true,
    },
  ];

  return (
    <Page className="page bg-cream dark:bg-dark-bg min-h-screen">
      {/* ─── Header ─────────────────────────────────── */}
      <Box className="staff-header px-5 pt-14 pb-9 rounded-b-4xl">
        <Box className="flex items-center gap-4 mb-5 animate-fade-in">
          {/* Avatar */}
          <Box className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <Text className="text-white">{staff?.fullName?.charAt(0) || 'S'}</Text>
          </Box>
          <Box className="flex-1">
            <Text className="text-white/60 text-xs font-medium mb-0.5">Xin chào,</Text>
            <Text className="text-white font-bold text-lg leading-tight tracking-tight">
              {staff?.fullName || 'Nhân viên'}
            </Text>
            <Box className="inline-flex items-center gap-1.5 mt-1 bg-white/15 px-2 py-0.5 rounded-lg">
              <Box className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <Text className="text-white/80 text-xs font-medium">
                {getRoleName(staff?.role || '')}
              </Text>
            </Box>
          </Box>
        </Box>
        {/* Branch Info */}
        <Box className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-up"
          style={{ backdropFilter: 'blur(8px)', animationDelay: '0.05s' }}
        >
          <Box className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Text className="text-sm">📍</Text>
          </Box>
          <Text className="text-white/85 text-sm font-medium">
            {staff?.branchName || staff?.branchAddress || 'Chưa có chi nhánh'}
          </Text>
        </Box>
      </Box>

      {/* ─── Menu Grid ──────────────────────────────── */}
      <Box className="px-5 -mt-5 relative z-10">
        <Text className="text-text-muted dark:text-dark-muted text-sm font-semibold mb-3 ml-1 tracking-wide uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.08em' }}
        >
          Chức năng
        </Text>

        <Box className="grid grid-cols-2 gap-3">
          {menuItems.filter(item => item.show).map((item, index) => (
            <Box
              key={item.route}
              className={`staff-menu-card animate-slide-up ${item.span2 ? 'col-span-2' : ''}`}
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
              onClick={() => navigate(item.route)}
            >
              <Box className="menu-icon" style={{ background: item.gradient }}>
                {item.icon}
              </Box>
              <Text className="font-semibold text-text-main dark:text-dark-text text-sm text-center">
                {item.label}
              </Text>
              <Text className="text-text-muted dark:text-dark-muted text-xs text-center -mt-1">
                {item.desc}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ─── Quick Stats ────────────────────────────── */}
      <Box className="px-5 mt-7 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Text className="text-text-muted dark:text-dark-muted text-sm font-semibold mb-3 ml-1 tracking-wide uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.08em' }}
        >
          Hôm nay
        </Text>
        <Box className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-soft border border-black/[0.03] dark:border-dark-border grid grid-cols-3 gap-4">
          <Box className="text-center">
            <Text className="stat-number text-accent">5</Text>
            <Text className="text-[11px] text-text-muted dark:text-dark-muted mt-1.5 font-medium">Voucher quét</Text>
          </Box>
          <Box className="text-center border-x border-black/[0.04] dark:border-dark-border">
            <Text className="stat-number text-success">3</Text>
            <Text className="text-[11px] text-text-muted dark:text-dark-muted mt-1.5 font-medium">Bill đã gửi</Text>
          </Box>
          <Box className="text-center">
            <Text className="stat-number text-info">4</Text>
            <Text className="text-[11px] text-text-muted dark:text-dark-muted mt-1.5 font-medium">Chờ duyệt</Text>
          </Box>
        </Box>
      </Box>

      {/* ─── Logout ──────────────────────────────────── */}
      <Box className="px-5 mt-8 pb-10 animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <Button
          fullWidth
          variant="secondary"
          size="large"
          onClick={handleLogout}
          className="!rounded-xl !font-semibold !border-error/30 !text-error !bg-error-light dark:!bg-error/10 dark:!text-red-400 dark:!border-error/20"
        >
          Đăng xuất
        </Button>
      </Box>
    </Page>
  );
};

export default StaffHomePage;
