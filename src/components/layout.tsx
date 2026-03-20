import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import DashboardPage from "@/pages/dashboard";
import ReferralPage from "@/pages/referral";
import RewardsPage from "@/pages/rewards";
import QRPage from "@/pages/qr";
import LoginPage from "@/pages/login";
import BottomNav from "@/components/bottom-nav";
import AuthGuard from "@/components/auth-guard";

// ─── Staff App Pages ────────────────────────────────────
import StaffHomePage from "@/staff/pages/home";
import ScanVoucherPage from "@/staff/pages/scan-voucher";
import ManualBillPage from "@/staff/pages/manual-bill";
import ApproveBillPage from "@/staff/pages/approve-bill";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      {/* @ts-expect-error React 18 children type mismatch with ZMP UI */}
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            {/* ══ Public Routes ════════════════════════ */}
            <Route path="/login" element={<LoginPage />}></Route>
            
            {/* ══ Member Routes (User App) ═════════════ */}
            <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>}></Route>
            <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>}></Route>
            <Route path="/referral" element={<AuthGuard><ReferralPage /></AuthGuard>}></Route>
            <Route path="/rewards" element={<AuthGuard><RewardsPage /></AuthGuard>}></Route>
            <Route path="/qr" element={<AuthGuard><QRPage /></AuthGuard>}></Route>

            {/* ══ Staff Routes (Staff App) ═════════════ */}
            <Route path="/staff" element={<StaffHomePage />}></Route>
            <Route path="/staff/scan" element={<ScanVoucherPage />}></Route>
            <Route path="/staff/manual-bill" element={<ManualBillPage />}></Route>
            <Route path="/staff/approve-bill" element={<ApproveBillPage />}></Route>
          </AnimationRoutes>
          <BottomNav />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;

