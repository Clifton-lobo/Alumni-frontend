import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useState } from "react";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100">
      {/* SIDEBAR */}
      <AdminSidebar  open={openSidebar} setOpen={setOpenSidebar} />

      {/* MAIN COLUMN */}
      <div className="flex flex-col flex-1 b overflow-hidden">
        {/* HEADER */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
