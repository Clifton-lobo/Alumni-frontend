import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ShieldUser } from "lucide-react";
import { AdminSidebarMenuItems } from "../../config/index.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.jsx";
import { Button } from "../ui/button.jsx";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../store/authSlice/authSlice.js';

/* ----------------- Menu Item Component ----------------- */
function MenuItem({ setOpen, collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="mt-6 space-y-2">
      {AdminSidebarMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.id}
            onClick={() => {
              navigate(item.path);
              if (typeof setOpen === "function") {
                setTimeout(() => setOpen(false), 150);
              }
            }}
            title={collapsed ? item.label : ""}
            className={`flex items-center gap-2 p-2 rounded-md text-white cursor-pointer transition-all overflow-hidden
              ${isActive
                ? "bg-[#EBAB09] text-white font-semibold"
                : "hover:text-black hover:bg-slate-300"
              }
            `}
          >
            <Icon
              size={20}
              className={`shrink-0 ${isActive ? "text-blue-700" : "text-white"}`}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 overflow-hidden
                ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
              `}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

/* ----------------- Admin Sidebar Component ----------------- */
const AdminSidebar = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            className="w-64 p-0 flex flex-col bg-background border-r transition-transform duration-300 ease-in-out"
          >
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                <ShieldUser className="text-blue-600" size={20} />
                Admin Panel
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <MenuItem setOpen={setOpen} collapsed={false} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar — icon-only, expands on hover */}
      <aside
        className="hidden bg-blue-950 lg:flex flex-col border-r sticky top-0 h-screen
          w-16 hover:w-64 transition-all duration-300 ease-in-out overflow-hidden group"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-3 pt-6 overflow-hidden">
          <div className="bg-orange-400 p-2 rounded-xl shrink-0">
            <ShieldUser className="text-white" />
          </div>
          <h1
            className="text-xl text-white font-bold whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
          >
            Alumni Admin
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2">
          <nav className="mt-6 space-y-2 ml-2">
            {AdminSidebarMenuItems.map((item) => {
              // We need useNavigate/useLocation here — keep MenuItem logic inline for desktop
              return <DesktopMenuItem key={item.id} item={item} />;
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-2 pb-6">
          <Button
            variant="ghost"
            onClick={() => dispatch(logoutUser())}
            className="w-full justify-start gap-2 text-white hover:bg-[#EBAB09] hover:text-white cursor-pointer overflow-hidden"
          >
            <LogOut size={16} className="shrink-0" />
            <span
              className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
            >
              Logout
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
};

/* Inline desktop menu item to access hooks */
function DesktopMenuItem({ item }) {
  const navigate = useNavigate();
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.path;

  return (
    <div
      onClick={() => navigate(item.path)}
      title={item.label}
      className={`flex items-center gap-2 p-2 rounded-md text-white cursor-pointer transition-all overflow-hidden
        ${isActive
          ? "bg-[#EBAB09] text-white font-semibold"
          : "hover:text-black hover:bg-slate-300"
        }
      `}
    >
      <Icon
        size={20}
        className={`shrink-0 ${isActive ? "text-blue-700" : "text-white"}`}
      />
      <span
        className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
      >
        {item.label}
      </span>
    </div>
  );
}

export default AdminSidebar;