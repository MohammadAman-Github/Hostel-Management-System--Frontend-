import { useEffect, useState } from 'react'


import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { initDatabase } from './database/database'

import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Room_Details from './pages/Room_Details'
import Monthly_Rent_Details from './pages/Monthly_Rent_Details'
import MonthlyRentStatus from './pages/MonthlyRentStatus'
import Settings from './pages/Settings'

import { AndroidBackProvider } from './context/AndroidBackContext'
import { useAndroidBack } from './context/useAndroidBack'
import OccupancyRooms from './pages/OccupancyRooms'


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

        const popupWasClosed =
          handleAndroidBack()

        if (popupWasClosed) {
          return
        }


      // --------------------------------
// 2. Page is open
// --------------------------------

if (location.pathname !== '/') {

  // Monthly Rent child/status pages
  if (
    location.pathname === '/monthly-rent/paid' ||
    location.pathname === '/monthly-rent/partially-paid' ||
    location.pathname === '/monthly-rent/pending'
  ) {

    navigate('/monthly-rent')

    return
  }

  // Other pages
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

      listener.then(
        handle => handle.remove()
      )

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
    !isAndroidApp ||
    location.pathname === '/'


  return (

    <div
      className={`app-layout ${
        showSidebar ? '' : 'no-sidebar'
      }`}
    >

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
  path="/rooms/occupied"
  element={<OccupancyRooms />}
/>

<Route
  path="/rooms/partially-occupied"
  element={<OccupancyRooms />}
/>

<Route
  path="/rooms/vacant"
  element={<OccupancyRooms />}
/>

          <Route
            path="/monthly-rent"
            element={<Monthly_Rent_Details />}
          />

          <Route
  path="/monthly-rent/paid"
  element={<MonthlyRentStatus />}
/>

<Route
  path="/monthly-rent/partially-paid"
  element={<MonthlyRentStatus />}
/>

<Route
  path="/monthly-rent/pending"
  element={<MonthlyRentStatus />}
/>

          <Route
            path="/settings"
            element={<Settings />}
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

  const [databaseReady, setDatabaseReady] = useState(false)

  useEffect(() => {

    const initializeApp = async () => {

      try {

        console.log(
          'APP: Initializing SQLite database...'
        )

        await initDatabase()

        console.log(
          'APP: SQLite database ready'
        )

        setDatabaseReady(true)

      } catch (error) {

        console.error(
          'APP: SQLite initialization failed:',
          error
        )

      }

    }

    initializeApp()

  }, [])


  // ------------------------------------------
  // Wait for SQLite before loading application
  // ------------------------------------------

  if (!databaseReady) {

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}
      >
        Loading...
      </div>
    )

  }


  return (

    <BrowserRouter>

      <AndroidBackProvider>

        <ScrollToTop />

        <AppLayout />

      </AndroidBackProvider>

    </BrowserRouter>

  )
}


export default App