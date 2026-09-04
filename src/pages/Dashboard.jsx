import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getStudents } from '../services/studentService.js'
import { getRooms } from '../services/roomService.js'

import {
  getMonthlyRentByMonthAndYear
} from '../services/monthlyRentService.js'


const Dashboard = () => {

  const navigate = useNavigate()


  // ==================================================
  // DASHBOARD STATES
  // ==================================================

  const [studentCount, setStudentCount] =
    useState(0)


  const [roomCount, setRoomCount] =
    useState(0)


  const [pendingAmount, setPendingAmount] =
    useState(0)


  // ==================================================
  // LOAD DASHBOARD DATA
  // ==================================================

  useEffect(() => {

    // ==================================================
    // ACTIVE STUDENTS
    // ==================================================

    getStudents()
      .then((students) => {

        const activeStudents =
          students.filter(
            (student) =>
              student.status?.toUpperCase() === 'ACTIVE'
          )


        setStudentCount(
          activeStudents.length
        )

      })
      .catch((error) => {

        console.error(
          'Failed to load students:',
          error
        )

        setStudentCount(0)

      })


    // ==================================================
    // TOTAL ROOMS
    // ==================================================

    getRooms()
      .then((rooms) => {

        setRoomCount(
          rooms.length
        )

      })
      .catch((error) => {

        console.error(
          'Failed to load rooms:',
          error
        )

        setRoomCount(0)

      })


    // ==================================================
    // CURRENT MONTH PENDING RENT
    // ==================================================

    const currentDate =
      new Date()


    const currentMonth =
      currentDate.toLocaleString(
        'default',
        {
          month: 'long'
        }
      )


    const currentYear =
      currentDate
        .getFullYear()
        .toString()


    getMonthlyRentByMonthAndYear(
      currentMonth,
      currentYear
    )
      .then((rentDetails) => {

        const totalPending =
          rentDetails.reduce(
            (sum, rent) => {

              const totalRent =
                Number(
                  rent.totalRent ?? 0
                )


              const totalRentPaid =
                Number(
                  rent.totalRentPaid ?? 0
                )


              const pending =
                Math.max(
                  totalRent - totalRentPaid,
                  0
                )


              return sum + pending

            },
            0
          )


        setPendingAmount(
          totalPending
        )

      })
      .catch((error) => {

        console.error(
          'Failed to load monthly rent:',
          error
        )

        setPendingAmount(0)

      })

  }, [])


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="dashboard">

      <h1>
        Dashboard
      </h1>


      {/* ==================================================
          SUMMARY CARDS
          ================================================== */}

      <div className="dashboard-cards">


        {/* ==================================================
            STUDENTS
            ================================================== */}

        <div
          className="card"
          onClick={() =>
            navigate('/students')
          }
        >

          <div className="dashboard-card-icon">
            👥
          </div>


          <div className="dashboard-card-content">

            <h3>
              Students
            </h3>


            <span>
              Active Students
            </span>


            <p>
              {studentCount}
            </p>

          </div>

        </div>


        {/* ==================================================
            ROOMS
            ================================================== */}

        <div
          className="card"
          onClick={() =>
            navigate('/rooms')
          }
        >

          <div className="dashboard-card-icon">
            🛏️
          </div>


          <div className="dashboard-card-content">

            <h3>
              Rooms
            </h3>


            <span>
              Total Rooms
            </span>


            <p>
              {roomCount}
            </p>

          </div>

        </div>


        {/* ==================================================
            MONTHLY RENT
            ================================================== */}

        <div
          className="card"
          onClick={() =>
            navigate('/monthly-rent')
          }
        >

          <div className="dashboard-card-icon">
            📄
          </div>


          <div className="dashboard-card-content">

            <h3>
              Monthly Rent
            </h3>


            <span>
              Pending Amount
            </span>


            <p>
              ₹{pendingAmount}
            </p>

          </div>

        </div>

      </div>

    </div>

  )

}


export default Dashboard