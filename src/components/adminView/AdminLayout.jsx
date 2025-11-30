  import { Outlet } from 'react-router-dom'
  import AdminSidebar from './AdminSidebar'
  import AdminHeader from './AdminHeader'
  import { useState } from 'react'

  const AdminLayout = ({ open, setOpen }) => {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />

        {/* Main column */}
        <div className="flex flex-1 flex-col min-h-screen">
          <AdminHeader setOpen={setOpenSidebar} />

          <main className="flex-1 bg-gray-300 p-2 sm:p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminLayout