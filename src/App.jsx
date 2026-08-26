import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Room_Details from './pages/Room_Details'
import Monthly_Rent_Details from './pages/Monthly_Rent_Details'


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

  return (

    <div className="app-layout">

      <Sidebar />

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

      <ScrollToTop />

      <AppLayout />

    </BrowserRouter>

  )
}


export default App