import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getStudents } from '../services/studentService.js'
import { getRooms } from '../services/roomService.js'


const Dashboard = () => {

  const navigate = useNavigate()

  const [studentCount, setStudentCount] = useState(0)
  const [roomCount, setRoomCount] = useState(0)


  useEffect(() => {

    // =========================
    // GET ACTIVE STUDENTS COUNT
    // =========================

    getStudents()
      .then((students) => {

        const activeStudents =
          students.filter(
            (student) =>
              student.status?.toUpperCase() === 'ACTIVE'
          )

        setStudentCount(activeStudents.length)

      })
      .catch((error) => {

        console.error(
          'Error fetching students:',
          error
        )

      })


    // =========================
    // GET ROOMS COUNT
    // =========================

    getRooms()
      .then((rooms) => {

        setRoomCount(rooms.length)

      })
      .catch((error) => {

        console.error(
          'Error fetching rooms:',
          error
        )

      })

  }, [])


  return (

    <div className="dashboard">

      <h1>Dashboard</h1>


      <div className="dashboard-cards">


        {/* =========================
            ACTIVE STUDENTS
            ========================= */}

        <div
          className="card"
          onClick={() => navigate('/students')}
        >

          <h3>Students</h3>

          <p>{studentCount}</p>

        </div>


        {/* =========================
            ROOMS
            ========================= */}

        <div
          className="card"
          onClick={() => navigate('/rooms')}
        >

          <h3>Rooms</h3>

          <p>{roomCount}</p>

        </div>


        {/* =========================
            MONTHLY RENT
            ========================= */}

        <div
          className="card"
          onClick={() => navigate('/monthly-rent')}
        >

          <h3>Monthly Rent</h3>

          <p>₹0</p>

        </div>


      </div>

    </div>

  )

}


export default Dashboard