import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      
      {/* Subtle Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

      {/* Centered Auth Card */}
      <div className="flex flex-1 justify-center items-center p-6 z-10">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-8">
          
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              🎓
            </div>
            <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Alumni Portal
            </h1>
            <p className="text-gray-400 text-sm mt-2">Connect • Grow • Inspire</p>
          </div>

          {/* Nested Routes (Login/Register) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
