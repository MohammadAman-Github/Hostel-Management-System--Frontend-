import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAndroidBack } from '../context/useAndroidBack'

import {
  getMonthlyRentByMonthAndYear,
  getMonthlyRentByRoomNoAndYear,
  getMonthlyRentByMonthYearAndRoomNo,
  createMonthlyRentData,
  updateMonthlyRentData,
  deleteMonthlyRentData
} from '../services/monthlyRentService'

import {
  getStudents
} from '../services/studentService'

// Use the existing roomService function that returns all rooms.
import {
  getRooms
} from '../services/roomService'

const Monthly_Rent_Details = () => {
  
  const [searchType, setSearchType] = useState('month-year')

  const [rentDetails, setRentDetails] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [mrdError, setMrdError] = useState('')
  const [mrdErrorTitle, setMrdErrorTitle] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [deletingRent, setDeletingRent] = useState(null)
  const [showDeleteForm, setShowDeleteForm] = useState(false)

    // =========================
  // ANDROID BACK HANDLER
  // =========================

  const {
    registerBackHandler,
    clearBackHandler
  } = useAndroidBack()

  

  // =========================
  // Current Month Rent
  // =========================

  useEffect(() => {

    const currentDate = new Date()

    const currentMonth =
      currentDate.toLocaleString('en-US', {
        month: 'long'
      })

    const currentYear =
      currentDate.getFullYear()

    getMonthlyRentByMonthAndYear(
  currentMonth,
  currentYear.toString()
)
      .then((response) => {

        setRentDetails(response || [])
        setErrorMessage('')

      })
      .catch((error) => {

        console.error(
          'Error fetching current month rent details:',
          error
        )

        setRentDetails([])

        if (
          error.response &&
          error.response.data
        ) {

          setErrorMessage(
            error.response.data
          )

        } else {

          setErrorMessage(
            'Unable to fetch monthly rent details.'
          )

        }

      })

  }, [])


  // =========================
  // Search
  // =========================

  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [roomNo, setRoomNo] = useState('')

  const [rooms, setRooms] = useState([])
  const [students, setStudents] = useState([])


  // =========================
  // Create MRD
  // =========================

  const [useCustomRent, setUseCustomRent] = useState(false)
  const [customRent, setCustomRent] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)

  const [createMonth, setCreateMonth] =
    useState('')

  const [createYear, setCreateYear] =
    useState('')

  const [createRoomNo, setCreateRoomNo] =
    useState('')

  const [createCurrentReading, setCreateCurrentReading] =
    useState('')

  const [createPaymentStatus, setCreatePaymentStatus] =
    useState('Pending')


  // =========================
  // View MRD
  // =========================

  const [viewRent, setViewRent] =
    useState(null)

  const [selectedStudent, setSelectedStudent] =
    useState(null)

  const [activeTab, setActiveTab] =
    useState('overview')


  // =========================
  // Edit MRD
  // =========================

  const [editingRent, setEditingRent] =
    useState(null)

  const [editArrearBill, setEditArrearBill] =
    useState('')

  const [editPaymentStatus, setEditPaymentStatus] =
    useState('Pending')


      // =========================
  // ANDROID BACK HANDLER
  // =========================

  useEffect(() => {

    // Delete Rent popup
    if (showDeleteForm) {

      registerBackHandler(() => {
        setShowDeleteForm(false)
        setDeletingRent(null)
      })

      return () => clearBackHandler()
    }


    // Create Rent popup
    if (showCreateForm) {

      registerBackHandler(() => {
        setShowCreateForm(false)
      })

      return () => clearBackHandler()
    }


    // View Rent popup
    if (viewRent) {

      registerBackHandler(() => {
        setViewRent(null)
        setSelectedStudent(null)
        setActiveTab('overview')
      })

      return () => clearBackHandler()
    }


    // Edit Rent popup
    if (editingRent) {

      registerBackHandler(() => {
        setEditingRent(null)
        setEditArrearBill('')
        setEditPaymentStatus('Pending')
      })

      return () => clearBackHandler()
    }


    // Student popup
    if (selectedStudent) {

      registerBackHandler(() => {
        setSelectedStudent(null)
      })

      return () => clearBackHandler()
    }


    // No popup open
    clearBackHandler()

  }, [
    showDeleteForm,
    showCreateForm,
    viewRent,
    editingRent,
    selectedStudent,
    registerBackHandler,
    clearBackHandler
  ])


  // =========================
  // Get Rooms + Students
  // =========================

  useEffect(() => {

  getRooms()
    .then((result) => {

      console.log(
        'All rooms:',
        result
      )

      setRooms(result || [])

    })
    .catch((error) => {

      console.error(
        'Error fetching rooms:',
        error
      )

    })


  getStudents()
    .then((result) => {

      console.log(
        'All students:',
        result
      )

      setStudents(result || [])

    })
    .catch((error) => {

      console.error(
        'Error fetching students:',
        error
      )

    })

}, [])


  // =========================
  // Occupied Rooms
  // =========================

  const occupiedRooms = rooms.filter(
    (room) =>
      students.some(
        (student) =>
          Number(student.roomNo) ===
          Number(room.roomNo)
      )
  )


  // =========================
  // Reset Create MRD Form
  // =========================

  const resetCreateMRDForm = () => {

    setCreateMonth('')
    setCreateYear('')
    setCreateRoomNo('')
    setCreateCurrentReading('')
    setCreatePaymentStatus('Pending')

    setUseCustomRent(false)
    setCustomRent('')

  }


  // =========================
  // Create Monthly Rent
  // =========================

  const handleCreateMRD = () => {

    // =========================
    // Required Field Check
    // =========================

    if (
      !createMonth ||
      !createYear ||
      !createRoomNo ||
      createCurrentReading === ''
    ) {

      setMrdError(
        'Please fill all required fields'
      )

      return
    }


    // =========================
    // MRD Data
    // =========================

    const mrdData = {

      month: createMonth,

      year: createYear,

      roomNo: Number(createRoomNo),

      currentReading:
        Number(createCurrentReading),

      paymentStatus:
        createPaymentStatus

    }


    // =========================
    // Custom Rent
    // =========================

    if (useCustomRent) {

      if (customRent === '') {

        setMrdError(
          'Please enter custom rent'
        )

        return
      }


      if (Number(customRent) < 0) {

        setMrdError(
          'Custom rent cannot be negative'
        )

        return
      }


      mrdData.rent =
        Number(customRent)

    }


    // =========================
    // Current Reading Validation
    // =========================

    if (
      Number(createCurrentReading) < 0
    ) {

      setMrdError(
        'Current reading cannot be negative'
      )

      return
    }


    console.log(
      'Creating MRD:',
      mrdData
    )


    // =========================
    // Create MRD API
    // =========================

    createMonthlyRentData(mrdData)

  .then((result) => {

    console.log(
      'Monthly rent created:',
      result
    )


        // =========================
        // Success Message
        // =========================

        setSuccessMessage(
          'Monthly rent has been created successfully.'
        )


        // =========================
        // Reset Form
        // =========================

        setCreateMonth('')
        setCreateYear('')
        setCreateRoomNo('')
        setCreateCurrentReading('')
        setCreatePaymentStatus('Pending')

        setUseCustomRent(false)
        setCustomRent('')

        setShowCreateForm(false)

      })

      .catch((error) => {

        console.error(
          'Error creating monthly rent:',
          error
        )


        if (
          error.response &&
          error.response.data
        ) {

          setMrdError(
            error.response.data
          )

        } else {

          setMrdError(
            'Unable to create monthly rent'
          )

        }

      })

  }

 


  // =========================
  // Search MRD
  // =========================

  const handleSearch = () => {


    setMrdError('')

    setMrdErrorTitle('')

    // =========================
    // Month + Year
    // =========================

    if (
      searchType === 'month-year'
    ) {

      if (!month && !year) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select month and year'
  )

  return
}


      if (!month) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select month'
  )

  return
}


      if (!year) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select year'
  )

  return
}


      getMonthlyRentByMonthAndYear(
  month,
  year
)
  .then((result) => {

    setRentDetails(
      result || []
    )

        })

        .catch((error) => {

  console.error(
    'Error fetching monthly rent details:',
    error
  )

  setRentDetails([])

  setMrdErrorTitle(
    'Monthly rent details not found in database'
  )

  if (
    error.response &&
    error.response.data
  ) {

    setMrdError(
      error.response.data
    )

  } else {

    setMrdError(
      'Monthly rent details not found in database.'
    )

  }

})

    }


    // =========================
    // Room + Year
    // =========================

    if (
      searchType === 'room-year'
    ) {

      if (!roomNo && !year) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select room and year'
  )

  return
}


      if (!roomNo) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select room'
  )

  return
}


      if (!year) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select year'
  )

  return
}


      getMonthlyRentByRoomNoAndYear(
  roomNo,
  year
)
  .then((result) => {

    setRentDetails(
      result || []
    )

        })

      .catch((error) => {

  console.error(
    'Error fetching room rent details:',
    error
  )

  setRentDetails([])

  setMrdErrorTitle(
    'Monthly rent details not found in database'
  )

  if (
    error.response &&
    error.response.data
  ) {

    setMrdError(
      error.response.data
    )

  } else {

    setMrdError(
      'Monthly rent details not found in database.'
    )

  }

})  

    }


    // =========================
    // Month + Year + Room
    // =========================

    if (
      searchType === 'month-year-room'
    ) {

      if (
        !month &&
        !year &&
        !roomNo
      ) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select month, year and room'
  )

        return
      }


      if (!month) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select month'
  )

  return
}


    if (!roomNo) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select room'
  )

        return
      }


      if (!year) {

  setMrdErrorTitle(
    'Search Required'
  )

  setMrdError(
    'Please select year'
  )

  return
}



      getMonthlyRentByMonthYearAndRoomNo(
  month,
  year,
  roomNo
)
  .then((result) => {

    setRentDetails(
      result ? [result] : []
    )

        })

      .catch((error) => {

  console.error(
    'Error fetching room monthly rent:',
    error
  )

  setRentDetails([])

  setMrdErrorTitle(
    'Monthly rent details not found in database'
  )

  if (
    error.response &&
    error.response.data
  ) {

    setMrdError(
      error.response.data
    )

  } else {

    setMrdError(
      'Monthly rent details not found in database.'
    )

  }

})  

    }

  }


  // =========================
  // Update MRD
  // =========================

  const handleUpdateMRD = () => {

    if (!editingRent) {
      return
    }


    const updateData = {

      arrearBill:
        Number(editArrearBill),

      paymentStatus:
        editPaymentStatus

    }


    updateMonthlyRentData(
  editingRent.month,
  editingRent.year,
  editingRent.roomNo,
  updateData
)
  .then((updatedRent) => {

    console.log(
      'MRD updated:',
      updatedRent
    )


        // =========================
        // Update Existing Row
        // =========================

        setRentDetails(
          (prevRentDetails) =>
            prevRentDetails.map(
              (rent) =>
                rent.month ===
                  updatedRent.month &&
                rent.year ===
                  updatedRent.year &&
                rent.roomNo ===
                  updatedRent.roomNo
                  ? updatedRent
                  : rent
            )
        )


        // =========================
        // Close Edit Popup
        // =========================

        setEditingRent(null)


        setSuccessMessage(
          'Monthly rent updated successfully'
        )


        setTimeout(() => {

          setSuccessMessage('')

        }, 3000)

      })

      .catch((error) => {

        console.error(
          'Error updating monthly rent details:',
          error
        )

      })

  }


  // =========================
// Delete MRD
// =========================

const handleDeleteMRD = () => {

  if (!deletingRent) {
    return
  }

  deleteMonthlyRentData(
    deletingRent.month,
    deletingRent.year,
    deletingRent.roomNo
  )
    .then(() => {

      setRentDetails(
        (prevRentDetails) =>
          prevRentDetails.filter(
            (rent) =>
              !(
                rent.month === deletingRent.month &&
                String(rent.year) ===
                  String(deletingRent.year) &&
                Number(rent.roomNo) ===
                  Number(deletingRent.roomNo)
              )
          )
      )

      setDeletingRent(null)
      setShowDeleteForm(false)

      setSuccessMessage(
        'Monthly rent deleted successfully.'
      )

      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)

    })
    .catch((error) => {

      console.error(
        'Error deleting monthly rent:',
        error
      )

      setDeletingRent(null)
      setShowDeleteForm(false)

      if (
        error.response &&
        error.response.data
      ) {

        setMrdError(
          error.response.data
        )

      } else {

        setMrdError(
          'Unable to delete monthly rent.'
        )

      }

    })
}


  // =========================
  // Current Year
  // =========================

  const currentYear =
    new Date().getFullYear()


  return (

    <div className="monthly-rent-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="monthly-rent-header">

        <div>

          <h1>
            Monthly Rent
          </h1>

          <p>
            Monthly Rent Details
          </p>

        </div>

      </div>


      {/* =========================
          SUCCESS MESSAGE
          ========================= */}

      {successMessage && (

        <div className="monthly-rent-success">

          ✓ {successMessage}

        </div>

      )}


      {/* =========================
    CREATE / DELETE MONTHLY RENT
    ========================= */}

<div className="monthly-rent-create-section">

  {/* CREATE */}

  <button
    className="create-rent-btn"
    onClick={() => {

      resetCreateMRDForm()

      setMrdError('')

      setShowCreateForm(true)

    }}
  >
    <span className="create-rent-icon">+</span>
    Create Monthly Rent
  </button>


  {/* DELETE */}

  <button
    className="delete-rent-btn"
    onClick={() => {

      if (!rentDetails || rentDetails.length === 0) {

        setMrdError(
          'There is no monthly rent available to delete.'
        )

        return
      }

      setDeletingRent(null)

      setShowDeleteForm(true)

    }}
  >
    <span className="delete-rent-icon">🗑</span>
    Delete Monthly Rent
  </button>

</div>


      {/* =========================
          SEARCH
          ========================= */}

      <div className="monthly-rent-search">


        {/* SEARCH TYPE */}

        <select
          value={searchType}
          onChange={(e) => {

            setSearchType(
              e.target.value
            )

            setMonth('')
            setYear('')
            setRoomNo('')
            setRentDetails([])
            setErrorMessage('')

          }}
        >

          <option value="month-year">
            Month + Year
          </option>

          <option value="room-year">
            Room + Year
          </option>

          <option value="month-year-room">
            Month + Year + Room
          </option>

        </select>


        {/* MONTH */}

        {(
          searchType === 'month-year' ||
          searchType === 'month-year-room'
        ) && (

          <select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
          >

            <option value="">
              Select Month
            </option>

            <option value="January">
              January
            </option>

            <option value="February">
              February
            </option>

            <option value="March">
              March
            </option>

            <option value="April">
              April
            </option>

            <option value="May">
              May
            </option>

            <option value="June">
              June
            </option>

            <option value="July">
              July
            </option>

            <option value="August">
              August
            </option>

            <option value="September">
              September
            </option>

            <option value="October">
              October
            </option>

            <option value="November">
              November
            </option>

            <option value="December">
              December
            </option>

          </select>

        )}


        {/* ROOM */}

        {(
          searchType === 'room-year' ||
          searchType === 'month-year-room'
        ) && (

          <select
            value={roomNo}
            onChange={(e) =>
              setRoomNo(e.target.value)
            }
          >

            <option value="">
              Select Room
            </option>

            {rooms.map((room) => (

              <option
                key={room.roomNo}
                value={room.roomNo}
              >

                Room {room.roomNo}

              </option>

            ))}

          </select>

        )}


        {/* YEAR */}

        <select
          value={year}
          onChange={(e) =>
            setYear(e.target.value)
          }
        >

          <option value="">
            Select Year
          </option>

          {Array.from(
            { length: 66 },
            (_, index) => {

              const yearValue =
                currentYear - 5 + index

              return (

                <option
                  key={yearValue}
                  value={yearValue}
                >

                  {yearValue}

                </option>

              )

            }
          )}

        </select>


        {/* SEARCH BUTTON */}

        <button
          onClick={handleSearch}
        >
          Search
        </button>

      </div>


      {/* ==================================================
          CREATE MONTHLY RENT POPUP
          ================================================== */}

      {showCreateForm && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Create Monthly Rent
                </h2>

                <p className="monthly-rent-modal-subtitle">
                  Generate bill for a new month
                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="monthly-rent-info-list">


              {/* MONTH */}

              <div className="monthly-rent-info-row">

                <label>
                  Month
                </label>

                <select
                  value={createMonth}
                  onChange={(e) =>
                    setCreateMonth(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Month
                  </option>

                  <option value="January">
                    January
                  </option>

                  <option value="February">
                    February
                  </option>

                  <option value="March">
                    March
                  </option>

                  <option value="April">
                    April
                  </option>

                  <option value="May">
                    May
                  </option>

                  <option value="June">
                    June
                  </option>

                  <option value="July">
                    July
                  </option>

                  <option value="August">
                    August
                  </option>

                  <option value="September">
                    September
                  </option>

                  <option value="October">
                    October
                  </option>

                  <option value="November">
                    November
                  </option>

                  <option value="December">
                    December
                  </option>

                </select>

              </div>


              {/* YEAR */}

              <div className="monthly-rent-info-row">

                <label>
                  Year
                </label>

                <select
                  value={createYear}
                  onChange={(e) =>
                    setCreateYear(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Year
                  </option>

                  {Array.from(
                    { length: 62 },
                    (_, index) => {

                      const yearValue =
                        currentYear +
                        index -
                        1

                      return (

                        <option
                          key={yearValue}
                          value={yearValue}
                        >

                          {yearValue}

                        </option>

                      )

                    }
                  )}

                </select>

              </div>


              {/* ROOM */}

              <div className="monthly-rent-info-row">

                <label>
                  Room No
                </label>

                <select
                  value={createRoomNo}
                  onChange={(e) =>
                    setCreateRoomNo(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Room
                  </option>

                  {occupiedRooms.map(
                    (room) => (

                      <option
                        key={room.roomNo}
                        value={room.roomNo}
                      >

                        Room {room.roomNo}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* CURRENT READING */}

              <div className="monthly-rent-info-row">

                <label>
                  Current Reading
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    createCurrentReading
                  }
                  onChange={(e) =>
                    setCreateCurrentReading(
                      e.target.value
                    )
                  }
                  placeholder="Enter current meter reading"
                />

              </div>


              {/* PAYMENT STATUS */}

              <div className="monthly-rent-info-row">

                <label>
                  Payment Status
                </label>

                <select
                  value={
                    createPaymentStatus
                  }
                  onChange={(e) =>
                    setCreatePaymentStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partially Paid">
                    Partially Paid
                  </option>

                </select>

              </div>


              {/* CUSTOM RENT TOGGLE */}

              <div className="monthly-rent-info-row">

                <label>
                  Set Custom Rent
                </label>

                <input
                  type="checkbox"
                  checked={
                    useCustomRent
                  }
                  onChange={(e) => {

                    setUseCustomRent(
                      e.target.checked
                    )

                    if (
                      !e.target.checked
                    ) {

                      setCustomRent('')

                    }

                  }}
                />

              </div>


              {/* CUSTOM RENT */}

              {useCustomRent && (

                <div className="monthly-rent-info-row">

                  <label>
                    Custom Rent
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={customRent}
                    onChange={(e) =>
                      setCustomRent(
                        e.target.value
                      )
                    }
                    placeholder="Enter special monthly rent"
                  />

                </div>

              )}

            </div>


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                Cancel
              </button>

              <button
                className="save-student-btn"
                onClick={
                  handleCreateMRD
                }
              >
                Create Bill
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          RENT TABLE
          ========================= */}

      <div className="monthly-rent-table-container">

        <table className="monthly-rent-table">

          <thead>

            <tr>

              <th>
                Room No
              </th>

              <th>
                Month
              </th>

              <th>
                Rent
              </th>

              <th>
                Light Bill
              </th>

              <th>
                Arrear Bill
              </th>

              <th>
                Total Rent
              </th>

              <th>
                Total Rent Paid
              </th>

              <th>
                Payment Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {rentDetails.map(
              (rent) => (

                <tr
                  key={
                    `${rent.month}-${rent.year}-${rent.roomNo}`
                  }
                >

                  <td>
                    {rent.roomNo}
                  </td>

                  <td>
                    {rent.month}-{rent.year}
                  </td>

                  <td>
                    ₹{rent.rent}
                  </td>

                  <td>
                    ₹{rent.totalLightBill}
                  </td>

                  <td>
                    ₹{rent.arrearBill}
                  </td>

                  <td>
                    ₹{rent.totalRent}
                  </td>

                  <td>
                    ₹{rent.totalRentPaid ?? 0}
                  </td>

                  <td>
                    {
                      rent.paymentStatus ||
                      'Pending'
                    }
                  </td>

                  <td>


                    {/* VIEW */}

                    <button
                      className="view-btn"
                      onClick={() => {

                        getMonthlyRentByMonthYearAndRoomNo(
  rent.month,
  rent.year,
  rent.roomNo
)
  .then((result) => {

    setViewRent(
      result
    )

                            setActiveTab(
                              'overview'
                            )

                          })

                          .catch((error) => {

                            console.error(
                              'Error fetching rent details:',
                              error
                            )

                          })

                      }}
                    >
                      View
                    </button>


                    {/* EDIT */}

                    <button
                      className="edit-btn"
                      onClick={() => {

                        setEditingRent(
                          rent
                        )

                        setEditArrearBill(
                          rent.arrearBill ??
                          0
                        )

                        setEditPaymentStatus(
                          rent.paymentStatus ||
                          'Pending'
                        )

                      }}
                    >
                      Edit
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* =========================
          ERROR MESSAGE
          ========================= */}

      {errorMessage && (

        <div className="monthly-rent-error">

          {errorMessage}

        </div>

      )}


      {/* ==================================================
          VIEW RENT DETAILS POPUP
          ================================================== */}

      {viewRent && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Monthly Rent Details
                </h2>

                <p className="monthly-rent-modal-subtitle">
                  Room {viewRent.roomNo}
                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setViewRent(null)
                }
              >
                ×
              </button>

            </div>


            {/* TABS */}

            <div className="monthly-rent-tabs">

              <button
                className={
                  activeTab === 'overview'
                    ? 'monthly-rent-tab active'
                    : 'monthly-rent-tab'
                }
                onClick={() =>
                  setActiveTab('overview')
                }
              >
                Overview
              </button>


              <button
                className={
                  activeTab === 'students'
                    ? 'monthly-rent-tab active'
                    : 'monthly-rent-tab'
                }
                onClick={() =>
                  setActiveTab('students')
                }
              >
                Students
              </button>


              <button
                className={
                  activeTab === 'rent'
                    ? 'monthly-rent-tab active'
                    : 'monthly-rent-tab'
                }
                onClick={() =>
                  setActiveTab('rent')
                }
              >
                Rent Details
              </button>


              <button
                className={
                  activeTab === 'meter'
                    ? 'monthly-rent-tab active'
                    : 'monthly-rent-tab'
                }
                onClick={() =>
                  setActiveTab('meter')
                }
              >
                Meter Reading
              </button>

            </div>


            {/* =========================
                OVERVIEW
                ========================= */}

            {activeTab === 'overview' && (

              <div className="monthly-rent-tab-content">

                <div className="monthly-rent-overview-grid">


                  {/* MONTH */}

                  <div className="monthly-rent-overview-card">

                    <label>
                      Month
                    </label>

                    <p>
                      {viewRent.month}-
                      {viewRent.year}
                    </p>

                  </div>


                  {/* LIGHT BILL */}

                  <div className="monthly-rent-overview-card">

                    <label>
                      Light Bill
                    </label>

                    <p>
                      ₹{viewRent.totalLightBill}
                    </p>

                  </div>


                  {/* MONTHLY RENT */}

                  <div className="monthly-rent-overview-card">

                    <label>
                      Monthly Rent
                    </label>

                    <p>
                      ₹{viewRent.rent}
                    </p>

                  </div>


                  {/* TOTAL RENT */}

                  <div className="monthly-rent-overview-card">

                    <label>
                      Total Rent
                    </label>

                    <p>
                      ₹{viewRent.totalRent}
                    </p>

                  </div>


                  {/* TOTAL RENT PAID */}

                  <div className="monthly-rent-overview-card">

                    <label>
                      Total Rent Paid
                    </label>

                    <p>
                      ₹{viewRent.totalRentPaid}
                    </p>

                  </div>


                  {/* PAYMENT STATUS */}

                  <div className="monthly-rent-info-row">

                    <label>
                      Payment Status
                    </label>

                    <p>

                      {viewRent.paymentStatus ===
                      'Paid' ? (

                        <span className="payment-paid">
                          ✓ Paid
                        </span>

                      ) : viewRent.paymentStatus ===
                        'Partially Paid' ? (

                        <span className="payment-partial">
                          ◐ Partially Paid
                        </span>

                      ) : (

                        <span className="payment-pending">
                          ⚠ Pending
                        </span>

                      )}

                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =========================
                STUDENTS
                ========================= */}

            {activeTab === 'students' && (

              <div className="monthly-rent-tab-content">

                <h3>
                  Students
                </h3>


                {students.filter(
  (student) =>
    Number(student.roomNo) ===
    Number(viewRent.roomNo)
).length > 0 ? (

  <div className="student-name-list">

    {students
      .filter(
        (student) =>
          Number(student.roomNo) ===
          Number(viewRent.roomNo)
      )
      .map(
        (student) => (

                        <button
                          key={
                            student.studentId
                          }
                          className="student-name-btn"
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                        >

                          {
                            student.studentName
                          }

                        </button>

                      )
                    )}

                  </div>

                ) : (

                  <p>
                    No students found
                  </p>

                )}

              </div>

            )}


            {/* =========================
                RENT DETAILS
                ========================= */}

            {activeTab === 'rent' && (

              <div className="monthly-rent-tab-content">

                <h3>
                  Rent Details
                </h3>


                <div className="monthly-rent-info-list">


                  <div className="monthly-rent-info-row">

                    <label>
                      Monthly Rent
                    </label>

                    <p>
                      ₹{viewRent.rent}
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Arrear Bill
                    </label>

                    <p>
                      ₹{viewRent.arrearBill}
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Light Bill
                    </label>

                    <p>
                      ₹{viewRent.totalLightBill}
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Total Rent
                    </label>

                    <p>
                      ₹{viewRent.totalRent}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =========================
                METER READING
                ========================= */}

            {activeTab === 'meter' && (

              <div className="monthly-rent-tab-content">

                <h3>
                  Meter Reading
                </h3>


                <div className="monthly-rent-info-list">


                  <div className="monthly-rent-info-row">

                    <label>
                      Last Reading
                    </label>

                    <p>
                      {viewRent.lastReading}
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Current Reading
                    </label>

                    <p>
                      {viewRent.currentReading}
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Units Consumed
                    </label>

                    <p>
                      {
                        Number(
                          viewRent.currentReading
                        ) -
                        Number(
                          viewRent.lastReading
                        )
                      }
                    </p>

                  </div>


                  <div className="monthly-rent-info-row">

                    <label>
                      Light Bill
                    </label>

                    <p>
                      ₹{viewRent.totalLightBill}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setViewRent(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          EDIT MONTHLY RENT DETAILS POPUP
          ================================================== */}

      {editingRent && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Edit Monthly Rent
                </h2>

                <p className="monthly-rent-modal-subtitle">

                  Room {editingRent.roomNo}
                  {' • '}
                  {editingRent.month}-
                  {editingRent.year}

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setEditingRent(null)
                }
              >
                ×
              </button>

            </div>


            {/* DETAILS */}

            <div className="monthly-rent-info-list">


              {/* MONTHLY RENT */}

              <div className="monthly-rent-info-row">

                <label>
                  Monthly Rent
                </label>

                <p>
                  ₹{editingRent.rent}
                </p>

              </div>


              {/* LIGHT BILL */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Light Bill
                </label>

                <p>
                  ₹{editingRent.totalLightBill}
                </p>

              </div>


              {/* TOTAL RENT */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Rent
                </label>

                <p>
                  ₹{editingRent.totalRent}
                </p>

              </div>


              {/* TOTAL RENT PAID */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Rent Paid
                </label>

                <p>
                  ₹{editingRent.totalRentPaid}
                </p>

              </div>


              {/* ARREAR BILL */}

              <div className="monthly-rent-info-row">

                <label>
                  Arrear Bill
                </label>

                <input
                  type="number"
                  value={editArrearBill}
                  onChange={(e) =>
                    setEditArrearBill(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* PAYMENT STATUS */}

              <div className="monthly-rent-info-row">

                <label>
                  Payment Status
                </label>

                <select
                  value={
                    editPaymentStatus
                  }
                  onChange={(e) =>
                    setEditPaymentStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partially Paid">
                    Partially Paid
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                </select>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingRent(null)
                }
              >
                Cancel
              </button>


              <button
                className="save-student-btn"
                onClick={
                  handleUpdateMRD
                }
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          STUDENT DETAILS POPUP
          ================================================== */}

      {selectedStudent && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal student-popup">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <h2>
                Student Details
              </h2>


              <button
                className="close-btn"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                ×
              </button>

            </div>


            {/* STUDENT DETAILS */}

            <div className="student-details-popup">


              <div className="student-detail-item">

                <label>
                  Student ID
                </label>

                <p>
                  {selectedStudent.studentId}
                </p>

              </div>


              <div className="student-detail-item">

                <label>
                  Student Name
                </label>

                <p>
                  {selectedStudent.studentName}
                </p>

              </div>


              <div className="student-detail-item">

                <label>
                  Contact No.
                </label>

                <p>
                  {selectedStudent.contactNo}
                </p>

              </div>


              <div className="student-detail-item">

                <label>
                  Father Name
                </label>

                <p>
                  {selectedStudent.fatherName}
                </p>

              </div>


              <div className="student-detail-item">

                <label>
                  Father Contact No.
                </label>

                <p>
                  {selectedStudent.fatherContact}
                </p>

              </div>

            </div>


            {/* CLOSE */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


    {/* ==================================================
    DELETE MONTHLY RENT POPUP
    ================================================== */}

{showDeleteForm && (

  <div className="monthly-rent-modal-overlay">

    <div className="monthly-rent-modal">

      <div className="monthly-rent-modal-header">

        <div>

          <h2>
            Delete Monthly Rent
          </h2>

          <p className="monthly-rent-modal-subtitle">
            Select the monthly rent you want to delete
          </p>

        </div>

        <button
          className="close-btn"
          onClick={() =>
            setShowDeleteForm(false)
          }
        >
          ×
        </button>

      </div>


      <div className="monthly-rent-info-list">

        <div className="monthly-rent-info-row">

          <label>
            Monthly Rent
          </label>

          <select
            value={
              deletingRent
                ? `${deletingRent.month}|${deletingRent.year}|${deletingRent.roomNo}`
                : ''
            }
            onChange={(e) => {

              const [
                selectedMonth,
                selectedYear,
                selectedRoomNo
              ] = e.target.value.split('|')

              const selectedRent =
                rentDetails.find(
                  (rent) =>
                    rent.month === selectedMonth &&
                    String(rent.year) === selectedYear &&
                    String(rent.roomNo) === selectedRoomNo
                )

              setDeletingRent(
                selectedRent || null
              )

            }}
          >

            <option value="">
              Select Monthly Rent
            </option>

            {rentDetails.map(
              (rent) => (

                <option
                  key={`${rent.month}-${rent.year}-${rent.roomNo}`}
                  value={`${rent.month}|${rent.year}|${rent.roomNo}`}
                >

                  Room {rent.roomNo}
                  {' - '}
                  {rent.month}-{rent.year}

                </option>

              )
            )}

          </select>

        </div>

      </div>


      <div className="monthly-rent-modal-buttons">

        <button
          className="cancel-btn"
          onClick={() => {

            setDeletingRent(null)
            setShowDeleteForm(false)

          }}
        >
          Cancel
        </button>


        <button
          className="delete-confirm-btn"
          disabled={!deletingRent}
          onClick={handleDeleteMRD}
        >
          Delete
        </button>

      </div>

    </div>

  </div>

)}


      {/* ==================================================
          MRD ERROR POPUP
          ================================================== */}

      {mrdError &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-confirmation">

              {/* <h2>
                Unable to Create Monthly Rent
              </h2> */}

              <h2>
  {mrdErrorTitle || 'Unable to Create Monthly Rent'}
</h2>



              <p>
                {mrdError}
              </p>

              <div className="delete-buttons">

                <button
                  className="success-ok-btn"
                  onClick={() =>
                    setMrdError('')
                  }
                >
                  OK
                </button>

              </div>

            </div>

          </div>,

          document.body

        )
      }


      {/* ==================================================
          SUCCESS POPUP
          ================================================== */}

      {successMessage &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-success">

              <h2>
                Monthly Rent Created Successfully
              </h2>

              <p>
                {successMessage}
              </p>

              <button
                className="success-ok-btn"
                onClick={() =>
                  setSuccessMessage('')
                }
              >
                OK
              </button>

            </div>

          </div>,

          document.body

        )
      }

    </div>

  )

}


export default Monthly_Rent_Details