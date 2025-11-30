import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/auth/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/adminView/Dashboard'
import Alumni from './pages/adminView/Alumni'
import Jobs from './pages/adminView/Jobs'
import Events from './pages/adminView/Event/Events'
import AdminLayout from './components/adminView/AdminLayout.jsx'
import UserLayout from './components/userView/UserLayout'
import UserJobs from './pages/userView/UserJobs'
import UserEvents from './pages/userView/events/UserEvents'
import Home from './pages/userView/Home/Home.jsx'
import CheckAuth from './components/common/CheckAuth'
import NotFound from './notFound/NotFound'
import UnAuth from './un-auth/UnAuth'
import NewsLetter from './pages/adminView/NewsLetter/NewsLetter'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/authSlice/authSlice.js'
import News from './pages/userView/News.jsx'
import About from './pages/userView/About.jsx'
import UserGallery from './pages/userView/userGallery.jsx'
import UserDonate from './pages/userView/userDonate.jsx'
import UserCommunity from './pages/userView/userCommunity.jsx'


function App() {

  const  {user,isAuthenticated,isLoading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect( ()=>{
    dispatch(checkAuth());
  },[dispatch])

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Layout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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
          <Route path="news" element={<NewsLetter />} />
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
          <Route path="news" element={<News />} />
          <Route path="community" element={<UserCommunity />} />
          <Route path="about" element={<About />} />
          <Route path="donate" element={<UserDonate />} />
          <Route path="gallery" element={<UserGallery />} />
        </Route>

        {/* misc */}
        <Route path="*" element={<NotFound />} />
        <Route path="/un-auth" element={<UnAuth />} />
      </Routes>
    </>
  );
}

export default App
