// ══════════════════════════════════════════════════════════
// Staff Layout - Router & Layout cho Staff App
// ══════════════════════════════════════════════════════════
import React from 'react';
import { AnimationRoutes, Route } from 'zmp-ui';

// Staff Pages
import StaffHomePage from '../pages/home';
import ScanVoucherPage from '../pages/scan-voucher';
import ManualBillPage from '../pages/manual-bill';
import ApproveBillPage from '../pages/approve-bill';

const StaffRoutes: React.FC = () => {
  return (
    <AnimationRoutes>
      <Route path="/staff" element={<StaffHomePage />} />
      <Route path="/staff/scan" element={<ScanVoucherPage />} />
      <Route path="/staff/manual-bill" element={<ManualBillPage />} />
      <Route path="/staff/approve-bill" element={<ApproveBillPage />} />
    </AnimationRoutes>
  );
};

export default StaffRoutes;
