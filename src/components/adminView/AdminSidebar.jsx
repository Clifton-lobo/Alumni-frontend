import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ShieldUser } from "lucide-react";
import { AdminSidebarMenuItems } from "../../config/index.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.jsx";
import { Button } from "../ui/button.jsx";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../store/authSlice/authSlice.js';

/* ----------------- Menu Item Component ----------------- */
function MenuItem({ setOpen }) {


  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6  space-y-2">
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
            className={`flex items-center gap-2 p-2 rounded-md text-white cursor-pointer transition-all 
              ${isActive
                ? "bg-[#EBAB09] text-white font-semibold"
                : " hover:text-black hover:bg-slate-300"
              }
            `}
          >
            <Icon
              size={20}
              className={`${isActive ? "text-blue-700" : "text-white"}`}
            />
            <span>{item.label}</span>
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
      {/* ✅ Mobile Sidebar (Sheet) */}
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
              <MenuItem setOpen={setOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ✅ Desktop Sidebar (Visible only on large screens) */}
      <aside className="hidden bg-blue-950 lg:flex w-64 flex-col bgwhite border-r sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8 px-6 pt-6">
          <div className="bg-orange-400 p-2  rounded-xl">
          <ShieldUser className="text-white" />
          </div>
          <h1 className="text-xl text-white font-bold">Alumni Admin</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <MenuItem />
        </div>

        <div className="px-4 pb-6">
          <Button
            variant="ghost"
          onClick={() => dispatch(logoutUser())}
            className="w-full justify-start gap-2 text-white hover:bg-[#EBAB09] hover:text-white cursor-pointer "
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

    </>
  );
};

export default AdminSidebar;
