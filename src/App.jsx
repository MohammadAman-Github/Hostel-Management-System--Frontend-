import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Room_Details from './pages/Room_Details'
import Monthly_Rent_Details from './pages/Monthly_Rent_Details'

import { AndroidBackProvider } from './context/AndroidBackContext'
import { useAndroidBack } from './context/useAndroidBack'


// ==================================================
// SCROLL TO TOP WHEN PAGE CHANGES
// ==================================================

function ScrollToTop() {

  const { pathname } = useLocation()

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })

  }, [pathname])

  return null
}


// ==================================================
// APP LAYOUT
// ==================================================

function AppLayout() {

  const location = useLocation()
  const navigate = useNavigate()

  const {
    handleAndroidBack
  } = useAndroidBack()

  const isAndroidApp =
    Capacitor.getPlatform() === 'android'


  useEffect(() => {

    if (!isAndroidApp) {
      return
    }

    const listener = CapacitorApp.addListener(
      'backButton',
      () => {

        // --------------------------------
        // 1. Popup is open
        // --------------------------------

        const popupWasClosed = handleAndroidBack()

        if (popupWasClosed) {
          return
        }


        // --------------------------------
        // 2. Page is open
        // --------------------------------

        if (location.pathname !== '/') {

          navigate('/')

          return
        }


        // --------------------------------
        // 3. Already on Dashboard
        // --------------------------------

        CapacitorApp.minimizeApp()

      }
    )

    return () => {
      listener.then(handle => handle.remove())
    }

  }, [
    isAndroidApp,
    location.pathname,
    navigate,
    handleAndroidBack
  ])


  // Android:
  // Sidebar only on Dashboard

  const showSidebar =
    !isAndroidApp || location.pathname === '/'


  return (

    <div className={`app-layout ${showSidebar ? '' : 'no-sidebar'}`}>

      {showSidebar && <Sidebar />}

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/rooms"
            element={<Room_Details />}
          />

          <Route
            path="/monthly-rent"
            element={<Monthly_Rent_Details />}
          />

        </Routes>

      </main>

    </div>

  )
}


// ==================================================
// MAIN APP
// ==================================================

function App() {

  return (

    <BrowserRouter>

      <AndroidBackProvider>

        {/* Reset page scroll whenever route changes */}

        <ScrollToTop />

        <AppLayout />

      </AndroidBackProvider>

    </BrowserRouter>

  )
}


export default App