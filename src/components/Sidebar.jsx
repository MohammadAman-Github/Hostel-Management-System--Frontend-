// import { Link } from 'react-router-dom'

// const Sidebar = () => {
//   return (
//     <div className="sidebar">

//       <h2 className="sidebar-title">
//         HMS
//       </h2>

//       <div className="sidebar-menu">

//         <Link to="/">
//           Dashboard
//         </Link>

//         <Link to="/students">
//           Students
//         </Link>

//         <Link to="/rooms">
//           Rooms
//         </Link>

//         <Link to="/monthly-rent">
//           Monthly Rent
//         </Link>

//       </div>

//     </div>
//   )
// }

// export default Sidebar



import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">
        HMS
      </h2>

      <div className="sidebar-menu">

        <Link to="/">
          Dashboard
        </Link>

        <Link to="/students">
          Students
        </Link>

        <Link to="/rooms">
          Rooms
        </Link>

        <Link to="/monthly-rent">
          Monthly Rent
        </Link>

        <Link to="/settings">
          Settings
        </Link>

      </div>

    </div>
  )
}

export default Sidebar