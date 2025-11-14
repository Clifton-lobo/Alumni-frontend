import React from 'react'
import {Button} from '../ui/button'
import { LogOut, Menu } from 'lucide-react';


const AdminHeader = ({setOpen}) => {
  return (
    <header className='flex items-center justify-between px4 py-3 bg-background shadow-md  px-4 '>
      <Button onClick={()=>setOpen(true)} className="lg:hidden md:block" >
        <Menu/>
        <span className='sr-only'>Toggle menu</span>
     </Button>
     <div className='flex flex-1 justify-end'>
      <Button className="inline-flex gap-2  items-center rounded-md px-4 py-2 text-sm font-medium shadow bg-blue-500 hover:bg-blue-700">
      <LogOut  />
      Logout
      </Button>
     </div>
    </header>

    
  )
}

export default AdminHeader