import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import UserHeader from './UserHeader'
import Footer from '../../pages/userView/Footer'

const UserLayout = () => {  
  const location = useLocation();
  const isHomePage = location.pathname === '/user/home';
  
  return (
    <div className='flex flex-col'>
      <UserHeader/>
      <main className={`flex flex-col w-full ${isHomePage ? null : 'pt-[72px]'}`}>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default UserLayout