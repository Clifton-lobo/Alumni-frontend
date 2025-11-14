import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { useState } from 'react'

const AdminLayout = ({open,setOpen}) => {

  const[openSidebar,setOpenSidebar] =useState(false)

  return ( 

       
    <div className='flex min-h-screen w-full'>

      {/* admin sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
      <div className='flex flex-1 flex-col '>
        
        <AdminHeader setOpen={setOpenSidebar}/>
        {/* admin header */}
        <main className='flex-1 flex bg-gray-300 p-4 md:6'>
           <Outlet/>    
        </main>      
        </div>
    </div>
  )
}

export default AdminLayout