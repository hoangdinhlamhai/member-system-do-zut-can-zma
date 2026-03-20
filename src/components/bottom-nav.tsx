import React, { useEffect, useState } from "react";
import { BottomNavigation, Icon } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/dashboard");

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key, { replace: true });
  };

  // Hide on login, index, and staff pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/staff')) return null;

  return (
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={handleTabChange}
      className="z-50 border-t border-black/[0.04] dark:border-dark-border bg-white/90 dark:bg-dark-surface/90"
      style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
    >
      <BottomNavigation.Item
        key="/dashboard"
        label="Trang chủ"
        icon={<Icon icon="zi-home" />}
        activeIcon={<Icon icon="zi-home" className="text-primary" />}
      />
      <BottomNavigation.Item
        key="/referral"
        label="Giới thiệu"
        icon={<Icon icon="zi-user" />}
        activeIcon={<Icon icon="zi-user" className="text-primary" />}
      />
      <BottomNavigation.Item
        key="/rewards"
        label="Đổi quà"
        icon={<Icon icon="zi-star" />}
        activeIcon={<Icon icon="zi-star-solid" className="text-primary" />}
      />
      <BottomNavigation.Item
        key="/qr"
        label="Xác thực"
        icon={<Icon icon="zi-more-grid" />}
        activeIcon={<Icon icon="zi-more-grid" className="text-primary" />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
