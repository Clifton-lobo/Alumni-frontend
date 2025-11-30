import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from './UserHeader'
import Footer from '../../pages/userView/Footer'


const UserLayout = () => {
  return (
    <div className='flex flex-col '> 
     <UserHeader/>
     <main className='flex flex-col w-full'>
        <Outlet/>
     </main>
     <main>
      <Footer/>
     </main>

    </div>
  )
}

export default UserLayout