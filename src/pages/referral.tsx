import React from "react";
import { Page, Box } from "zmp-ui";
import Header from "@/components/header";
import bg from "@/static/bg.svg";

import ReferralCodeCard from "@/components/referral/referral-code-card";
import HowItWorks from "@/components/referral/how-it-works";
import ReferralStats from "@/components/referral/referral-stats";
import ReferralFriendList from "@/components/referral/referral-friend-list";
import { useFetchReferees } from "@/hooks/use-member";

function ReferralPage() {
  const { fetchReferees } = useFetchReferees();

  React.useEffect(() => {
    fetchReferees().catch((error) => {
      console.error('Loi khi lay danh sach ban gioi thieu:', error);
    });
  }, [fetchReferees]);

  return (
    <Page className="page page-content relative overflow-x-hidden min-h-screen bg-cream dark:bg-dark-bg">
      <Box
        className="absolute top-0 left-0 right-0 h-[320px] bg-cover bg-bottom opacity-[0.06] dark:opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <Header />

      <Box className="relative z-10 w-full max-w-md mx-auto">
        <ReferralCodeCard />
        <HowItWorks />
        <ReferralStats />
        <ReferralFriendList />
      </Box>
    </Page>
  );
}

export default ReferralPage;
