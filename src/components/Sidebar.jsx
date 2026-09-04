import { Link } from 'react-router-dom'


const Sidebar = () => {

  return (

    <aside className="sidebar">

      {/* ==================================================
          SIDEBAR TITLE
          ================================================== */}

      <h2 className="sidebar-title">
        HMS
      </h2>


      {/* ==================================================
          SIDEBAR MENU
          ================================================== */}

      <nav className="sidebar-menu">

        {/* ------------------------------------------
            DASHBOARD
            ------------------------------------------ */}

        <Link
          to="/"
          className="sidebar-link"
        >
          Dashboard
        </Link>


        {/* ------------------------------------------
            STUDENTS
            ------------------------------------------ */}

        <Link
          to="/students"
          className="sidebar-link"
        >
          Students
        </Link>


        {/* ------------------------------------------
            ROOMS
            ------------------------------------------ */}

        <Link
          to="/rooms"
          className="sidebar-link"
        >
          Rooms
        </Link>


        {/* ------------------------------------------
            MONTHLY RENT
            ------------------------------------------ */}

        <Link
          to="/monthly-rent"
          className="sidebar-link"
        >
          Monthly Rent
        </Link>


        {/* ------------------------------------------
            PAYMENT QR
            ------------------------------------------ */}

        <Link
          to="/payment-qr"
          className="sidebar-link"
        >
          Payment QR
        </Link>


        {/* ------------------------------------------
            SETTINGS
            ------------------------------------------ */}

        <Link
          to="/settings"
          className="sidebar-link"
        >
          Settings
        </Link>

      </nav>

    </aside>

  )
}


export default Sidebar