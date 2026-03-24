import React from "react";
import { Page, Box } from "zmp-ui";
import Header from "@/components/header";
import bg from "@/static/bg.svg";
import QRViewer from "@/components/qr/qr-viewer";

function QRPage() {
  return (
    <Page className="page page-content relative overflow-x-hidden min-h-screen bg-cream dark:bg-dark-bg">
      <Box
        className="absolute top-0 left-0 right-0 h-[320px] bg-cover bg-bottom opacity-[0.06] dark:opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <Header />

      <Box className="relative z-10 w-full max-w-md mx-auto pt-2">
        <QRViewer />
      </Box>
    </Page>
  );
}

export default QRPage;
