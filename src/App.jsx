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
import OccupancyRooms from './pages/OccupancyRooms'
import PaymentQR from './pages/PaymentQR'
import Settings from './pages/Settings'

import { AndroidBackProvider } from './context/AndroidBackContext'
import { useAndroidBack } from './context/useAndroidBack'


// ==================================================
// SCROLL TO TOP WHEN PAGE CHANGES
// ==================================================

function ScrollToTop() {

  const { pathname } =
    useLocation()


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

  const location =
    useLocation()


  const navigate =
    useNavigate()


  const {
    handleAndroidBack
  } = useAndroidBack()


  const isAndroidApp =
    Capacitor.getPlatform() === 'android'


  // ==================================================
  // ANDROID BACK BUTTON
  // ==================================================

  useEffect(() => {

    if (!isAndroidApp) {
      return
    }


    const listener =
      CapacitorApp.addListener(
        'backButton',
        () => {

          // ==========================================
          // 1. POPUP IS OPEN
          // ==========================================

          const popupWasClosed =
            handleAndroidBack()


          if (popupWasClosed) {
            return
          }


          // ==========================================
          // 2. PAGE IS OPEN
          // ==========================================

          if (
            location.pathname !== '/'
          ) {


            // ========================================
            // MONTHLY RENT STATUS PAGES
            // ========================================

            if (
              location.pathname ===
                '/monthly-rent/paid' ||

              location.pathname ===
                '/monthly-rent/partially-paid' ||

              location.pathname ===
                '/monthly-rent/pending'
            ) {

              navigate(
                '/monthly-rent'
              )

              return

            }


            // ========================================
            // ROOM OCCUPANCY PAGES
            // ========================================

            if (
              location.pathname ===
                '/rooms/single-occupancy' ||

              location.pathname ===
                '/rooms/double-occupancy' ||

              location.pathname ===
                '/rooms/triple-occupancy' ||

              location.pathname ===
                '/rooms/vacant'
            ) {

              navigate(
                '/rooms'
              )

              return

            }


            // ========================================
            // PAYMENT QR PAGE
            // ========================================

            if (
              location.pathname ===
                '/payment-qr'
            ) {

              navigate(
                '/'
              )

              return

            }


            // ========================================
            // SETTINGS PAGE
            // ========================================

            if (
              location.pathname ===
                '/settings'
            ) {

              navigate(
                '/'
              )

              return

            }


            // ========================================
            // OTHER PAGES
            // ========================================

            navigate('/')

            return

          }


          // ==========================================
          // 3. ALREADY ON DASHBOARD
          // ==========================================

          CapacitorApp.minimizeApp()

        }
      )


    return () => {

      listener.then(
        handle =>
          handle.remove()
      )

    }

  }, [
    isAndroidApp,
    location.pathname,
    navigate,
    handleAndroidBack
  ])


  // ==================================================
  // SIDEBAR VISIBILITY
  // ==================================================
  //
  // Browser:
  // Sidebar is always visible.
  //
  // Android:
  // Sidebar is visible on:
  // Dashboard
  // Payment QR
  // Settings
  //
  // Other Android pages use no sidebar.
  // ==================================================

  const showSidebar =
  !isAndroidApp ||
  location.pathname === '/'


  // ==================================================
  // UI
  // ==================================================

  return (

    <div
      className={`app-layout ${
        showSidebar
          ? ''
          : 'no-sidebar'
      }`}
    >

      {/* ============================================
          SIDEBAR
          ============================================ */}

      {showSidebar && (
        <Sidebar />
      )}


      {/* ============================================
          MAIN CONTENT
          ============================================ */}

      <main className="main-content">

        <Routes>


          {/* ==========================================
              DASHBOARD
              ========================================== */}

          <Route
            path="/"
            element={
              <Dashboard />
            }
          />


          {/* ==========================================
              STUDENTS
              ========================================== */}

          <Route
            path="/students"
            element={
              <Students />
            }
          />


          {/* ==========================================
              ROOMS
              ========================================== */}

          <Route
            path="/rooms"
            element={
              <Room_Details />
            }
          />


          {/* ==========================================
              ROOM OCCUPANCY
              ========================================== */}

          <Route
            path="/rooms/single-occupancy"
            element={
              <OccupancyRooms />
            }
          />

          <Route
            path="/rooms/double-occupancy"
            element={
              <OccupancyRooms />
            }
          />

          <Route
            path="/rooms/triple-occupancy"
            element={
              <OccupancyRooms />
            }
          />

          <Route
            path="/rooms/vacant"
            element={
              <OccupancyRooms />
            }
          />


          {/* ==========================================
              MONTHLY RENT
              ========================================== */}

          <Route
            path="/monthly-rent"
            element={
              <Monthly_Rent_Details />
            }
          />


          {/* ==========================================
              MONTHLY RENT STATUS
              ========================================== */}

          <Route
            path="/monthly-rent/paid"
            element={
              <MonthlyRentStatus />
            }
          />

          <Route
            path="/monthly-rent/partially-paid"
            element={
              <MonthlyRentStatus />
            }
          />

          <Route
            path="/monthly-rent/pending"
            element={
              <MonthlyRentStatus />
            }
          />


          {/* ==========================================
              PAYMENT QR
              ========================================== */}

          <Route
            path="/payment-qr"
            element={
              <PaymentQR />
            }
          />


          {/* ==========================================
              SETTINGS
              ========================================== */}

          <Route
            path="/settings"
            element={
              <Settings />
            }
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

  const [
    databaseReady,
    setDatabaseReady
  ] = useState(false)


  // ==================================================
  // INITIALIZE DATABASE
  // ==================================================

  useEffect(() => {

    const initializeApp =
      async () => {

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


  // ==================================================
  // WAIT FOR DATABASE
  // ==================================================

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


  // ==================================================
  // APPLICATION
  // ==================================================

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