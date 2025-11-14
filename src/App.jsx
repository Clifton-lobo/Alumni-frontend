import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/auth/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/adminView/Dashboard'
import Alumni from './pages/adminView/Alumni'
import Jobs from './pages/adminView/Jobs'
import Events from './pages/adminView/Events'
import AdminLayout from './components/adminView/adminLayout'
import UserLayout from './components/userView/UserLayout'
import UserJobs from './pages/userView/UserJobs'
import UserEvents from './pages/userView/UserEvents'
import Home from './pages/userView/Home'
import CheckAuth from './components/common/CheckAuth'
import NotFound from './notFound/NotFound'
import UnAuth from './un-auth/UnAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/authSlice/authSlice.js'


function App() {

  const  {user,isAuthenticated,isLoading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect( ()=>{
    dispatch(checkAuth());
  },[dispatch])

  if(isLoading) return <div>Loading.......</div>
  return (

    <>
     <Routes>
           <Route
          path="/"
          element={
            <CheckAuth
            isAuthenticated={isAuthenticated}
              user={user}
            >
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth 
            isAuthenticated={isAuthenticated}
            user={user}>
              <Layout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={< Register />} />
        </Route>

      {/* admin */}
      <Route
        path="/admin"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="events" element={<Events />} />
      </Route>

      {/* user */}
      <Route
        path="/user"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <UserLayout />
          </CheckAuth>
        }
      >
        <Route path="events" element={<UserEvents />} />
        <Route path="jobs" element={<UserJobs />} />
        <Route path="home" element={<Home />} />
      </Route>

      {/* misc */}
      <Route path="*" element={<NotFound />} />
      <Route path="/un-auth" element={<UnAuth />} />
     </Routes>
    </>

  )
}

export default App
