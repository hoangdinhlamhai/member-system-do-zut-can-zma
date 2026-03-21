import React from "react";
import { Page, Box, Button, Text, useNavigate } from "zmp-ui";
import { useSetAtom, useAtomValue } from "jotai";
import { logoutActionAtom, memberAtom } from "@/stores/auth";
import { useFetchReferees, useFetchDashboard, useFetchTimeline, useDashboardLoading } from "@/hooks/use-member";

import Header from "@/components/header";
import TierInfoCard from "@/components/dashboard/tier-info-card";
import PointsCard from "@/components/dashboard/points-card";
import MonthlySalesCard from "@/components/dashboard/monthly-sales";
import F1DetailsList from "@/components/dashboard/f1-details";
import TransactionTimeline from "@/components/dashboard/transaction-timeline";

import bg from "@/static/bg.svg";

function DashboardPage() {
  const logout = useSetAtom(logoutActionAtom);
  const navigate = useNavigate();
  const member = useAtomValue(memberAtom);
  const { fetchReferees } = useFetchReferees();
  const { fetchDashboard } = useFetchDashboard();
  const { fetchTimeline } = useFetchTimeline();
  const isLoading = useDashboardLoading();

  React.useEffect(() => {
    fetchDashboard().catch((error) => {
      console.error('Lỗi khi lấy dashboard:', error);
    });

    fetchReferees().catch((error) => {
      console.error('Lỗi khi lấy danh sách bạn giới thiệu:', error);
    });

    fetchTimeline().catch((error) => {
      console.error('Lỗi khi lấy timeline:', error);
    });
  }, [fetchDashboard, fetchReferees, fetchTimeline]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, animate: true, direction: "forward" });
  };

  return (
    <Page className="page pb-[120px] relative overflow-x-hidden min-h-screen bg-cream dark:bg-dark-bg">
      {/* Background decoration */}
      <Box
        className="absolute top-0 left-0 right-0 h-[320px] bg-cover bg-bottom opacity-[0.06] dark:opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <Header />

      <Box className="relative z-10 w-full max-w-md mx-auto">
        <Box id="dashboard-section" className="pb-4">
          {isLoading ? (
            // Loading skeleton
            <Box className="px-4 pt-[88px] space-y-4">
              <Box className="animate-pulse space-y-3">
                <Box className="h-5 w-32 bg-gray-200 dark:bg-dark-card rounded" />
                <Box className="h-7 w-48 bg-gray-200 dark:bg-dark-card rounded" />
                <Box className="h-[160px] bg-gray-200 dark:bg-dark-card rounded-3xl" />
                <Box className="h-[100px] bg-gray-200 dark:bg-dark-card rounded-2xl" />
                <Box className="h-[120px] bg-gray-200 dark:bg-dark-card rounded-2xl" />
              </Box>
            </Box>
          ) : (
            <>
              <TierInfoCard />
              <PointsCard />
              <MonthlySalesCard />
              <F1DetailsList />
              <TransactionTimeline />
            </>
          )}

          {/* ══ Thông tin cá nhân ══ */}
          <Box className="px-4 mt-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <Box className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/30">
              <Text className="font-semibold text-sm text-text-primary dark:text-white mb-3">
                👤 Thông tin cá nhân
              </Text>

              <Box className="space-y-2">
                {member?.zaloName && (
                  <Box className="flex justify-between items-center">
                    <Text className="text-xs text-text-muted dark:text-gray-400">Tên Zalo</Text>
                    <Text className="text-xs font-medium text-text-primary dark:text-white">{member.zaloName}</Text>
                  </Box>
                )}

                <Box className="flex justify-between items-center">
                  <Text className="text-xs text-text-muted dark:text-gray-400">Số điện thoại</Text>
                  {member?.phone ? (
                    <Text className="text-xs font-medium text-text-primary dark:text-white">{member.phone}</Text>
                  ) : (
                    <Button
                      size="small"
                      variant="tertiary"
                      className="!text-xs !text-amber-600 dark:!text-amber-400 !px-3 !py-1 !rounded-lg !bg-amber-50 dark:!bg-amber-900/20"
                      onClick={() => navigate('/add-phone', { animate: true, direction: 'forward' })}
                    >
                      + Thêm SĐT
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Logout */}
          <Box className="px-4 mt-8 pb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              fullWidth
              variant="secondary"
              className="!rounded-xl !font-semibold !border-error/30 !text-error !bg-error-light dark:!bg-error/10 dark:!text-red-400 dark:!border-error/20"
              size="large"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default DashboardPage;

