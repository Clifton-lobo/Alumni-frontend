import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "./UserHeader";
import Footer from "../../pages/userView/Footer";

const UserLayout = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const location = useLocation();
  const isMessagesPage = location.pathname.startsWith("/user/messages");

  return (
    <div className="flex flex-col min-h-screen">

      {!isFullscreen && <UserHeader />}

      <main className={`flex flex-col flex-1 w-full ${!isFullscreen ? "pt-[72px]" : ""}`}>
        <Outlet context={{ isFullscreen, setIsFullscreen }} />
      </main>

      {!isFullscreen && !isMessagesPage && <Footer />}
    </div>
  );
};

export default UserLayout;