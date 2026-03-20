import React, { useEffect } from "react";
import { Page, Box, Spinner } from "zmp-ui";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động chuyển hướng sang Dashboard khi mở app
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <Page className="flex justify-center items-center h-screen bg-cream dark:bg-dark-bg">
      <Box className="flex flex-col items-center">
        <Spinner visible />
      </Box>
    </Page>
  );
}

export default HomePage;
