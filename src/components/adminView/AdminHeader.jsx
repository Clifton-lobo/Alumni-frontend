import React from 'react'
import {Button} from '../ui/button'
import { LogOut, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice/authSlice';


const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-white border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Menu />
      </Button>

      <div className="ml-auto">
        <Button
          onClick={() => dispatch(logoutUser())}
          className="flex  items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader