import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAndroidBack } from '../context/useAndroidBack'
import { getRooms } from '../services/roomService.js'
import { createPortal } from 'react-dom'

const OccupancyRooms = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

  const {
    registerBackHandler,
    clearBackHandler
  } = useAndroidBack()


  // =========================
// DETERMINE ROOM STATUS
// =========================

let occupancyStatus = ''
let pageTitle = ''

if (location.pathname === '/rooms/single-occupancy') {

  occupancyStatus = 'SINGLE OCCUPANCY'
  pageTitle = 'Single Occupancy Rooms'

}

if (location.pathname === '/rooms/double-occupancy') {

  occupancyStatus = 'DOUBLE OCCUPANCY'
  pageTitle = 'Double Occupancy Rooms'

}

if (location.pathname === '/rooms/triple-occupancy') {

  occupancyStatus = 'TRIPLE OCCUPANCY'
  pageTitle = 'Triple Occupancy Rooms'

}

if (location.pathname === '/rooms/vacant') {

  occupancyStatus = 'VACANT'
  pageTitle = 'Vacant Rooms'

}


  // =========================
  // LOAD ROOMS
  // =========================

  useEffect(() => {

    getRooms()
      .then((rooms) => {

        const filteredRooms = rooms.filter(
          (room) =>
            room.occupancyStatus === occupancyStatus
        )

        setRooms(filteredRooms)

      })
      .catch((error) => {

        console.error(
          'Error fetching occupancy rooms:',
          error
        )

      })

  }, [occupancyStatus])


  // =========================
  // ANDROID BACK
  // =========================

  useEffect(() => {

    if (selectedRoom) {

      registerBackHandler(() => {
        setSelectedRoom(null)
      })

      return () => clearBackHandler()
    }


    registerBackHandler(() => {
      navigate('/rooms')
    })

    return () => {
      clearBackHandler()
    }

  }, [
    selectedRoom,
    registerBackHandler,
    clearBackHandler,
    navigate
  ])


  return (

    <div className="rooms-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="rooms-header">

        <div>

          <h1>{pageTitle}</h1>

          <p>
            Total Rooms: {rooms.length}
          </p>

        </div>


        <button
          className="cancel-btn"
          onClick={() => navigate('/rooms')}
        >
          ← Back to Rooms
        </button>

      </div>


      {/* =========================
          ROOMS TABLE
          ========================= */}

      <div className="room-table-container">

        <table className="room-table">

          <thead>

            <tr>

              <th>Room No</th>
              <th>Room Type</th>
              <th>Occupancy</th>
              <th>Light Bill</th>
              <th>Monthly Rent</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {rooms.length > 0 ? (

              rooms.map((room) => (

                <tr key={room.roomNo}>

                  <td>{room.roomNo}</td>

                  <td>{room.roomType}</td>

                  <td>{room.occupancyStatus}</td>

                  <td>{room.lightBill}</td>

                  <td>₹{room.monthlyRent}</td>

                  <td className="room-action-cell">

                    <button
                      className="view-btn"
                      onClick={() => setSelectedRoom(room)}
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center',
                    padding: '20px'
                  }}
                >
                  No {pageTitle.toLowerCase()} found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* =========================
          VIEW ROOM MODAL
          ========================= */}

      {selectedRoom && createPortal(

        <div className="room-details">

          <div className="room-details-header">

            <h2>Room Details</h2>

            <button
              className="close-btn"
              onClick={() => setSelectedRoom(null)}
            >
              ×
            </button>

          </div>


          <div className="room-details-grid">

            <div>
              <strong>Room No</strong>
              <p>{selectedRoom.roomNo}</p>
            </div>


            <div>
              <strong>Room Type</strong>
              <p>{selectedRoom.roomType}</p>
            </div>


            <div>
              <strong>Floor</strong>
              <p>{selectedRoom.floor}</p>
            </div>


            <div>
              <strong>Beds</strong>
              <p>{selectedRoom.beds}</p>
            </div>


            <div>
              <strong>Tables</strong>
              <p>{selectedRoom.tables}</p>
            </div>


            <div>
              <strong>Chairs</strong>
              <p>{selectedRoom.chairs}</p>
            </div>


            <div>
              <strong>Coolers</strong>
              <p>{selectedRoom.coolers}</p>
            </div>


            <div>
              <strong>Monthly Rent</strong>
              <p>₹{selectedRoom.monthlyRent}</p>
            </div>


            <div>
              <strong>Light Bill</strong>
              <p>{selectedRoom.lightBill}</p>
            </div>


            <div>
              <strong>Last Meter Reading</strong>
              <p>{selectedRoom.lastMeterReading}</p>
            </div>


            <div>
              <strong>Security Amount</strong>
              <p>₹{selectedRoom.securityAmount}</p>
            </div>


            <div>
              <strong>Security Amount Status</strong>
              <p>{selectedRoom.securityAmountStatus}</p>
            </div>


            <div>
              <strong>Arrear Bill</strong>
              <p>₹{selectedRoom.arrearBill}</p>
            </div>


            <div>
              <strong>Occupancy Status</strong>
              <p>{selectedRoom.occupancyStatus}</p>
            </div>

          </div>

        </div>,

        document.body

      )}

    </div>

  )

}

export default OccupancyRooms