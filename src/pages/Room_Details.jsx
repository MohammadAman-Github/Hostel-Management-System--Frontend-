import { useEffect, useState } from 'react'
import {getRooms,createRoomData,
  updateRoomData,
  deleteRoomData} from '../services/roomService.js'
import { createPortal } from 'react-dom'

const Room_Details = () => {

  const [rooms, setRooms] = useState([])
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [editingRoom, setEditingRoom] = useState(null)
  const [addingRoom, setAddingRoom] = useState(false)

  const [deletingRoom, setDeletingRoom] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')

  const [errors, setErrors] = useState({})



  const [newRoom, setNewRoom] = useState({
  roomNo: '',
  roomType: '',
  floor: '',
  beds: '',
  tables: '',
  chairs: '',
  coolers: '',
  monthlyRent: '',
  lightBill: '',
  securityAmount: '',
  securityAmountStatus: 'Pending'
})

  useEffect(() => {

  getRooms()
    .then((rooms) => {
      setRooms(rooms)
    })
    .catch((error) => {
      console.error('Error fetching rooms:', error)
    })

}, [])


  // Calculate room occupancy
  const occupiedRooms = rooms.filter(
    room => room.occupancyStatus === "OCCUPIED"
  ).length

  const partiallyOccupiedRooms = rooms.filter(
    room => room.occupancyStatus === "PARTIALLY OCCUPIED"
  ).length

  const vacantRooms = rooms.filter(
    room => room.occupancyStatus === "VACANT"
  ).length


  // Search rooms
  const filteredRooms = rooms.filter((room) =>
    room.roomNo?.toString().includes(search) ||
    room.roomType?.toLowerCase().includes(search.toLowerCase())
  )


  //  Create Room 

// =========================
// CREATE ROOM
// =========================

const handleCreateRoom = () => {

  const newErrors = {}

  if (!newRoom.roomNo) {
    newErrors.roomNo = 'Room number is required.'
  }

  if (!newRoom.roomType.trim()) {
    newErrors.roomType = 'Room type is required.'
  }

  if (!newRoom.floor) {
    newErrors.floor = 'Floor is required.'
  }

  if (!newRoom.beds) {
    newErrors.beds = 'Number of beds is required.'
  }

  if (!newRoom.tables) {
    newErrors.tables = 'Number of tables is required.'
  }

  if (!newRoom.chairs) {
    newErrors.chairs = 'Number of chairs is required.'
  }

  if (!newRoom.monthlyRent) {
    newErrors.monthlyRent = 'Monthly rent is required.'
  }

  if (!newRoom.securityAmount) {
    newErrors.securityAmount = 'Security amount is required.'
  }

  setErrors(newErrors)

  // Stop if validation failed
  if (Object.keys(newErrors).length > 0) {
    return
  }

  const roomData = {
    roomNo: Number(newRoom.roomNo),
    roomType: newRoom.roomType,
    floor: Number(newRoom.floor),
    beds: Number(newRoom.beds),
    tables: Number(newRoom.tables),
    chairs: Number(newRoom.chairs),
    coolers: newRoom.coolers,
    monthlyRent: Number(newRoom.monthlyRent),
    lightBill: newRoom.lightBill,
    securityAmount: Number(newRoom.securityAmount),
    securityAmountStatus: newRoom.securityAmountStatus,
    occupancyStatus: 'VACANT'
  }

  createRoomData(roomData)
    .then((createdRoom) => {

      console.log('Room created:', createdRoom)

      setRooms((prevRooms) => [
        ...prevRooms,
        createdRoom
      ])

      setAddingRoom(false)
      setErrors({})

      setNewRoom({
        roomNo: '',
        roomType: '',
        floor: '',
        beds: '',
        tables: '',
        chairs: '',
        coolers: '',
        monthlyRent: '',
        lightBill: '',
        securityAmount: '',
        securityAmountStatus: 'Pending'
      })

    })
    .catch((error) => {

      console.error('Error creating room:', error)

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create room.'

      setErrors({
        roomNo: message
      })

    })
}



// =========================
// HANDLE ADD ROOM INPUT
// =========================

const handleRoomChange = (e) => {

  const { name, value } = e.target

  setNewRoom({
    ...newRoom,
    [name]: value
  })

  const newErrors = { ...errors }

  if (name === 'roomNo' && value.trim() !== '') {
    delete newErrors.roomNo
  }

  if (name === 'roomType' && value.trim() !== '') {
    delete newErrors.roomType
  }

  if (name === 'floor' && value !== '') {
    delete newErrors.floor
  }

  if (name === 'beds' && value !== '') {
    delete newErrors.beds
  }

  if (name === 'tables' && value !== '') {
    delete newErrors.tables
  }

  if (name === 'chairs' && value !== '') {
    delete newErrors.chairs
  }

  if (name === 'monthlyRent' && value !== '') {
    delete newErrors.monthlyRent
  }

  if (name === 'securityAmount' && value !== '') {
    delete newErrors.securityAmount
  }

  setErrors(newErrors)
}


// =========================
// VALIDATE EDIT ROOM
// =========================

const validateEditRoom = () => {

  const newErrors = {}

  if (!editingRoom.roomType?.trim()) {
    newErrors.roomType = 'Room type is required.'
  }

  if (!editingRoom.floor) {
    newErrors.floor = 'Floor is required.'
  }

  if (!editingRoom.beds) {
    newErrors.beds = 'Number of beds is required.'
  }

  if (!editingRoom.tables) {
    newErrors.tables = 'Number of tables is required.'
  }

  if (!editingRoom.chairs) {
    newErrors.chairs = 'Number of chairs is required.'
  }

  if (!editingRoom.monthlyRent) {
    newErrors.monthlyRent = 'Monthly rent is required.'
  }

  if (!editingRoom.securityAmount) {
    newErrors.securityAmount = 'Security amount is required.'
  }

  // =========================
  // LAST METER READING
  // =========================

  if (
    editingRoom.lastMeterReading === '' ||
    editingRoom.lastMeterReading === null ||
    editingRoom.lastMeterReading === undefined
  ) {
    newErrors.lastMeterReading = 'Last meter reading is required.'
  } else if (Number(editingRoom.lastMeterReading) < 0) {
    newErrors.lastMeterReading =
      'Last meter reading cannot be less than 0.'
  }

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0
}


// =========================
// UPDATE ROOM
// =========================

const handleUpdateRoom = () => {

  if (!validateEditRoom()) {
    return
  }

  const roomData = {
    ...editingRoom,
    lastMeterReading: Number(editingRoom.lastMeterReading)
  }

  updateRoomData(editingRoom.roomNo, roomData)
    .then((updatedRoom) => {

      console.log('Room updated:', updatedRoom)

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomNo === editingRoom.roomNo
            ? updatedRoom
            : room
        )
      )

      setEditingRoom(null)
      setErrors({})

    })
    .catch((error) => {

      console.error('Error updating room:', error)

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update room.'

      setErrors({
        roomType: message
      })

    })
}

// =========================
// DELETE ROOM
// =========================

const handleDeleteRoom = () => {

  setDeleteError('')
  setDeleteSuccess('')

  if (!roomToDelete) {
    setDeleteError('Please select a room.')
    return
  }

  const roomNo = Number(roomToDelete)

  const roomExists = rooms.some(
    (room) => Number(room.roomNo) === roomNo
  )

  if (!roomExists) {
    setDeleteError(`Room ${roomNo} does not exist.`)
    return
  }

  deleteRoomData(roomNo)
    .then(() => {

      console.log('Room deleted:', roomNo)

      setRooms((prevRooms) =>
        prevRooms.filter(
          (room) => Number(room.roomNo) !== roomNo
        )
      )

      setRoomToDelete('')
      setDeleteError('')
      setDeleteSuccess(`Room ${roomNo} deleted successfully.`)

    })
    .catch((error) => {

      console.error('Error deleting room:', error)

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete room.'

      setDeleteError(message)

    })
}

  return (

    <div className="rooms-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="rooms-header">

        <div>
          <h1>Rooms</h1>
          <p>Total Rooms: {rooms.length}</p>
        </div>

        <button
        className="add-room-btn"
        onClick={() => setAddingRoom(true)}
        >
        + Add Room
        </button>

         <button
    className="delete-room-main-btn"
    onClick={() => {
      setDeletingRoom(true)
      setDeleteError('')
      setDeleteSuccess('')
      setRoomToDelete('')
    }}
  >
    Delete Room
  </button>

      </div>


      {/* =========================
          ROOM SUMMARY
          ========================= */}

      <div
  className="room-summary"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    width: "100%",
    marginBottom: "25px"
  }}
>

  <div
    className="summary-card"
    style={{
      background: "white",
      padding: "15px 18px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}
  >
    <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>
      Total Rooms
    </h3>

    <p style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
      {rooms.length}
    </p>
  </div>


  <div
    className="summary-card"
    style={{
      background: "white",
      padding: "15px 18px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}
  >
    <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>
      Occupied
    </h3>

    <p style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
      {occupiedRooms}
    </p>
  </div>


  <div
    className="summary-card"
    style={{
      background: "white",
      padding: "15px 18px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}
  >
    <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>
      Partially Occupied
    </h3>

    <p style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
      {partiallyOccupiedRooms}
    </p>
  </div>


  <div
    className="summary-card"
    style={{
      background: "white",
      padding: "15px 18px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}
  >
    <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>
      Vacant
    </h3>

    <p style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
      {vacantRooms}
    </p>
  </div>

</div>


      {/* =========================
          SEARCH
          ========================= */}

      <div className="room-search">

        <input
          type="text"
          placeholder="Search by room number, room type ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


{/* {errorMessage && (
  <div className="room-error">
    {errorMessage}
  </div>
)} */}




      {/* =========================
          ROOMS TABLE
          ========================= */}
{/* 
      <div className="room-table-container"
  style={{
    width: "100%",
    overflowX: "auto"
  }}
  >

        <table
        style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px"
    }}
        >
            

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

            {filteredRooms.map((room) => (

              <tr key={room.roomNo}>

                <td>{room.roomNo}</td>

                <td>{room.roomType}</td>

                <td>{room.occupancyStatus}</td>

                <td>{room.lightBill}</td>

                <td>₹{room.monthlyRent}</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedRoom(room)}
                  >
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => setEditingRoom(room)}
                  >
                    Edit
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
 */}

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

      {filteredRooms.map((room) => (

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

            <button
              className="edit-btn"
              onClick={() => setEditingRoom(room)}
            >
              Edit
            </button>

          </td>

        </tr>

      ))}

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

{/* =========================
    EDIT ROOM MODAL
    ========================= */}

{editingRoom && createPortal(

  <div className="modal-overlay">

    <div className="add-student-form">

      <div className="add-student-form-header">

        <h2>Edit Room</h2>

        <button
          className="close-btn"
          onClick={() => setEditingRoom(null)}
        >
          ×
        </button>

      </div>


      <div className="student-form-grid">


        <div>
          <label>Room No</label>

          <input
            type="number"
            value={editingRoom.roomNo}
            disabled
          />
        </div>


<div>
  <label>Room Type</label>

  <select
    value={editingRoom.roomType || ''}
    onChange={(e) =>
      setEditingRoom({
        ...editingRoom,
        roomType: e.target.value
      })
    }
  >
    <option value="">Select Room Type</option>
    <option value="Single">Single</option>
    <option value="Double">Double</option>
    <option value="Tripple">Tripple</option>
  </select>

  {errors.roomType && (
    <p className="form-error">
      {errors.roomType}
    </p>
  )}
</div>


        <div>
          <label>Floor</label>

          <input
            type="number"
            value={editingRoom.floor}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                floor: e.target.value
              })
            }
            placeholder="Enter floor no."
          />
        </div>


        <div>
          <label>Beds</label>

          <input
            type="number"
            value={editingRoom.beds}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                beds: e.target.value
              })
            }
            placeholder="Enter number of beds"
          />
        </div>


        <div>
          <label>Tables</label>

          <input
            type="number"
            value={editingRoom.tables}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                tables: e.target.value
              })
            }
            placeholder="Enter number of tables"
          />
        </div>


        <div>
          <label>Chairs</label>

          <input
            type="number"
            value={editingRoom.chairs}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                chairs: e.target.value
              })
            }
            placeholder="Enter number of chairs"
          />
        </div>


        <div>
          <label>Coolers</label>

          <input
            type="text"
            value={editingRoom.coolers}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                coolers: e.target.value
              })
            }
            placeholder="Enter number of coolers"
          />
        </div>


        <div>
          <label>Monthly Rent</label>

          <input
            type="number"
            value={editingRoom.monthlyRent}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                monthlyRent: e.target.value
              })
            }
            placeholder="Enter monthly rent"
          />
        </div>


        <div>
          <label>Light Bill</label>

          <input
            type="text"
            value={editingRoom.lightBill}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                lightBill: e.target.value
              })
            }
            placeholder="Enter light bill"
          />
        </div>

       <div>
  <label>Last Meter Reading</label>

  <input
    type="number"
    min="0"
    value={editingRoom.lastMeterReading ?? ''}
    onChange={(e) =>
      setEditingRoom({
        ...editingRoom,
        lastMeterReading: e.target.value
      })
    }
    placeholder="Enter last meter reading"
  />

  {errors.lastMeterReading && (
    <p className="form-error">
      {errors.lastMeterReading}
    </p>
  )}
</div>

<div>
  <label>Arrear Bill</label>

  <input
    type="number"
    min="0"
    value={editingRoom.arrearBill ?? ''}
    onChange={(e) =>
      setEditingRoom({
        ...editingRoom,
        arrearBill: e.target.value
      })
    }
    placeholder="Enter arrear bill"
  />
</div>

        <div>
          <label>Security Amount</label>

          <input
            type="number"
            value={editingRoom.securityAmount}
            onChange={(e) =>
              setEditingRoom({
                ...editingRoom,
                securityAmount: e.target.value
              })
            }
            placeholder="Enter security amount"
          />
        </div>

      <div>
          <label>Security Amount Status</label>

          <select
          value={editingRoom.securityAmountStatus || "Pending"}
          onChange={(e) =>
          setEditingRoom({
          ...editingRoom,
          securityAmountStatus: e.target.value
        })
        }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          </select>
      </div>


      </div>


      <div className="student-form-buttons">

        <button
          className="cancel-btn"
          onClick={() => setEditingRoom(null)}
        >
          Cancel
        </button>


        <button
          className="save-student-btn"
          onClick={handleUpdateRoom}
        >
          Update Room
        </button>

      </div>


    </div>

  </div>,

  document.body

)}



{/* =========================
    ADD ROOM MODAL
    ========================= */}

{addingRoom && createPortal(

  <div className="modal-overlay">

    <div className="add-student-form">

      <div className="add-student-form-header">

        <h2>Add Room</h2>

        <button
          className="close-btn"
          onClick={() => {
  setAddingRoom(false)
  setErrors({})
}}
        >
          ×
        </button>

      </div>


      <div className="student-form-grid">

<div>
  <label>Room No</label>

  <input
    type="number"
    name="roomNo"
    value={newRoom.roomNo}
    onChange={handleRoomChange}
    placeholder="Enter room no."
  />

  {errors.roomNo && (
    <p className="form-error">
      {errors.roomNo}
    </p>
  )}
</div>


<div>
  <label>Room Type</label>

  <select
    name="roomType"
    value={newRoom.roomType}
    onChange={handleRoomChange}
  >
    <option value="">Select Room Type</option>
    <option value="Single">Single</option>
    <option value="Double">Double</option>
    <option value="Tripple">Tripple</option>
  </select>

  {errors.roomType && (
    <p className="form-error">
      {errors.roomType}
    </p>
  )}
</div>


<div>
  <label>Floor</label>

  <input
    type="number"
    name="floor"
    value={newRoom.floor}
    onChange={handleRoomChange}
    placeholder="Enter floor no."
  />

  {errors.floor && (
    <p className="form-error">
      {errors.floor}
    </p>
  )}
</div>


<div>
  <label>Beds</label>

  <input
    type="number"
    name="beds"
    value={newRoom.beds}
    onChange={handleRoomChange}
    placeholder="Enter number of beds"
  />

  {errors.beds && (
    <p className="form-error">
      {errors.beds}
    </p>
  )}
</div>


<div>
  <label>Tables</label>

  <input
    type="number"
    name="tables"
    value={newRoom.tables}
    onChange={handleRoomChange}
    placeholder="Enter number of tables"
  />

  {errors.tables && (
    <p className="form-error">
      {errors.tables}
    </p>
  )}
</div>


<div>
  <label>Chairs</label>

  <input
    type="number"
    name="chairs"
    value={newRoom.chairs}
    onChange={handleRoomChange}
    placeholder="Enter number of chairs"
  />

  {errors.chairs && (
    <p className="form-error">
      {errors.chairs}
    </p>
  )}
</div>


<div>
  <label>Coolers</label>

  <input
    type="text"
    name="coolers"
    value={newRoom.coolers}
    onChange={handleRoomChange}
    placeholder="Enter number of coolers"
  />
</div>


<div>
  <label>Monthly Rent</label>

  <input
    type="number"
    name="monthlyRent"
    value={newRoom.monthlyRent}
    onChange={handleRoomChange}
    placeholder="Enter monthly rent"
  />

  {errors.monthlyRent && (
    <p className="form-error">
      {errors.monthlyRent}
    </p>
  )}
</div>


<div>
  <label>Light Bill</label>

  <input
    type="text"
    name="lightBill"
    value={newRoom.lightBill}
    onChange={handleRoomChange}
    placeholder="Enter light bill"
  />
</div>


<div>
  <label>Security Amount</label>

  <input
    type="number"
    name="securityAmount"
    value={newRoom.securityAmount}
    onChange={handleRoomChange}
    placeholder="Enter security amount"
  />

  {errors.securityAmount && (
    <p className="form-error">
      {errors.securityAmount}
    </p>
  )}
</div>


<div>
  <label>Security Amount Status</label>

  <select
    name="securityAmountStatus"
    value={newRoom.securityAmountStatus}
    onChange={handleRoomChange}
  >
    <option value="Pending">Pending</option>
    <option value="Paid">Paid</option>
  </select>
</div>

      </div>


      <div className="student-form-buttons">

        <button
          className="cancel-btn"
          onClick={() => {
  setAddingRoom(false)
  setErrors({})
}}
        >
          Cancel
        </button>


        <button
          className="save-student-btn"
          onClick={handleCreateRoom}
        >
          Add Room
        </button>

      </div>

    </div>

  </div>,

  document.body

)}


{/* =========================
    DELETE ROOM MODAL
    ========================= */}

{deletingRoom && createPortal(

  <div className="modal-overlay">

    <div className="delete-confirmation room-delete-modal">

      <div className="add-student-form-header">

        <h2>Delete Room</h2>

        <button
          className="close-btn"
          onClick={() => {
            setDeletingRoom(false)
            setRoomToDelete('')
            setDeleteError('')
            setDeleteSuccess('')
          }}
        >
          ×
        </button>

      </div>


      {!deleteSuccess && (

        <>
          <p>
            Select the room you want to delete.
          </p>

          <div className="delete-room-select">

            <label>Room Number</label>

            <select
              value={roomToDelete}
              onChange={(e) => {
                setRoomToDelete(e.target.value)
                setDeleteError('')
              }}
            >

              <option value="">
                Select Room
              </option>

              {rooms.map((room) => (

                <option
                  key={room.roomNo}
                  value={room.roomNo}
                >
                  Room {room.roomNo} - {room.roomType}
                </option>

              ))}

            </select>

          </div>


          {deleteError && (

            <div className="room-error">
              {deleteError}
            </div>

          )}


          <div className="delete-confirmation-buttons">

            <button
              className="cancel-btn"
              onClick={() => {
                setDeletingRoom(false)
                setRoomToDelete('')
                setDeleteError('')
              }}
            >
              Cancel
            </button>

            <button
              className="confirm-delete-btn"
              onClick={handleDeleteRoom}
            >
              Delete Room
            </button>

          </div>

        </>

      )}


      {deleteSuccess && (

        <>

          <div className="room-success">
            {deleteSuccess}
          </div>

          <div className="delete-confirmation-buttons">

            <button
              className="success-ok-btn"
              onClick={() => {
                setDeletingRoom(false)
                setRoomToDelete('')
                setDeleteSuccess('')
              }}
            >
              OK
            </button>

          </div>

        </>

      )}

    </div>

  </div>,

  document.body

)}


</div>
)
}

export default Room_Details