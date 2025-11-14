import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldUser } from "lucide-react";
import { AdminSidebarMenuItems } from "../../config/index.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.jsx";

/* ----------------- Menu Item Component ----------------- */
function MenuItem({ setOpen }) {
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
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all 
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Icon
              size={20}
              className={`${isActive ? "text-blue-700" : "text-gray-600"}`}
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
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background p-6">
        <div className="flex items-center gap-2 cursor-pointer mb-6">
          <ShieldUser className="text-blue-600" />
          <h1 className="font-semibold text-xl">Admin Panel</h1>
        </div>
        <MenuItem setOpen={setOpen} />
      </aside>
    </>
  );
};

export default AdminSidebar;
