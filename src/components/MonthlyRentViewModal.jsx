import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'

import { getStudents } from '../services/studentService'



// ==================================================
// PHONE ICON
// ==================================================

const PhoneIcon = ({ number }) => {

  const isAndroid =
    Capacitor.getPlatform() === 'android'

  const icon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 16.92V20C22 20.55 21.55 21 21 21
        C10.51 21 3 13.49 3 3
        C3 2.45 3.45 2 4 2H7.08
        C7.58 2 8 2.36 8.08 2.85
        C8.17 3.5 8.35 4.14 8.61 4.75
        C8.74 5.06 8.66 5.42 8.42 5.66
        L6.96 7.12
        C8.23 9.63 10.37 11.77 12.88 13.04
        L14.34 11.58
        C14.58 11.34 14.94 11.26 15.25 11.39
        C15.86 11.65 16.5 11.83 17.15 11.92
        C17.64 12 18 12.42 18 12.92V16
        C18 16.55 17.55 17 17 17
        C16.45 17 16 16.55 16 16
        V14.78
        C15.62 14.68 15.24 14.55 14.88 14.39
        L13.39 15.88
        C13.1 16.17 12.66 16.25 12.29 16.08
        C8.47 14.34 5.66 11.53 3.92 7.71
        C3.75 7.34 3.83 6.9 4.12 6.61
        L5.61 5.12
        C5.45 4.76 5.32 4.38 5.22 4
        H4.02
        C4.01 12.29 10.71 18.99 19 18.98
        V17.78
        C18.62 17.68 18.24 17.55 17.88 17.39
        L16.39 18.88
        C16.1 19.17 15.66 19.25 15.29 19.08
        C11.47 17.34 8.66 14.53 6.92 10.71
        C6.75 10.34 6.83 9.9 7.12 9.61
        L8.61 8.12
        C8.45 7.76 8.32 7.38 8.22 7
        H7.02
        C7.01 15.29 13.71 21.99 22 21.98
        V16.92Z"
        fill="currentColor"
      />
    </svg>
  )

  if (!number) {
    return null
  }

  if (isAndroid) {

    return (
      <button
        type="button"
        className="phone-icon-button"
        onClick={() => {
          window.location.href = `tel:${number}`
        }}
        aria-label={`Call ${number}`}
      >
        {icon}
      </button>
    )

  }

  return (
    <span
      className="phone-icon-disabled"
      aria-hidden="true"
    >
      {icon}
    </span>
  )
}



// ==================================================
// MONTHLY RENT VIEW MODAL
// ==================================================

const MonthlyRentViewModal = ({
  rent,
  onClose
}) => {

  const [activeTab, setActiveTab] =
    useState('overview')

  const [students, setStudents] =
    useState([])

  const [selectedStudent, setSelectedStudent] =
    useState(null)



  // ==================================================
  // GET STUDENTS
  // ==================================================

  useEffect(() => {

    if (!rent) {
      return
    }

    getStudents()
      .then((result) => {

        const roomStudents =
          (result || []).filter(
            (student) =>
              Number(student.roomNo) ===
              Number(rent.roomNo)
          )

        setStudents(roomStudents)

      })
      .catch((error) => {

        console.error(
          'Error fetching students:',
          error
        )

        setStudents([])

      })

  }, [rent])



  // ==================================================
  // SHARE RENT DETAILS
  // ==================================================

  const handleShareRentDetails = () => {

    // ----------------------------------------------
    // FORMAT AMOUNT
    // ----------------------------------------------

    const formatAmount = (amount) =>
      Number(amount ?? 0).toLocaleString('en-IN')



    // ----------------------------------------------
    // CHECK METER READINGS
    // ----------------------------------------------

    const hasMeterReading =
      rent.lastReading !== null &&
      rent.lastReading !== undefined &&
      rent.currentReading !== null &&
      rent.currentReading !== undefined



    // ----------------------------------------------
    // CALCULATE UNITS
    // ----------------------------------------------

    const unitsConsumed =
      hasMeterReading
        ? Number(rent.currentReading) -
          Number(rent.lastReading)
        : null



    // ----------------------------------------------
    // RENT DETAILS
    // ----------------------------------------------

    let rentMessage = `🏠 Hostel Rent Details

Room No: ${rent.roomNo}
Month: ${rent.month} ${rent.year}

💰 Rent Details
Monthly Rent: ₹${formatAmount(rent.rent)}
Arrear Bill: ₹${formatAmount(rent.arrearBill)}
Light Bill: ₹${formatAmount(rent.totalLightBill)}
Total Rent: ₹${formatAmount(rent.totalRent)}`



    // ----------------------------------------------
    // METER DETAILS
    // ----------------------------------------------

    if (hasMeterReading) {

      rentMessage += `

📊 Meter Reading
Last Reading: ${rent.lastReading}
Current Reading: ${rent.currentReading}
Units Consumed: ${unitsConsumed}`

    }



    // ----------------------------------------------
    // OPEN WHATSAPP
    // ----------------------------------------------

    const encodedMessage =
      encodeURIComponent(rentMessage)



    if (
      Capacitor.getPlatform() === 'android'
    ) {

      window.location.href =
        `whatsapp://send?text=${encodedMessage}`

    } else {

      window.open(
        `https://wa.me/?text=${encodedMessage}`,
        '_blank'
      )

    }

  }



  if (!rent) {
    return null
  }



  return (
    <>
      {/* ==================================================
          VIEW RENT DETAILS POPUP
          ================================================== */}

      <div className="monthly-rent-modal-overlay">

        <div className="monthly-rent-modal">

          {/* =========================
              MODAL HEADER
              ========================= */}

          <div className="monthly-rent-modal-header">

            <div>

              <h2>
                Monthly Rent Details
              </h2>

              <p className="monthly-rent-modal-subtitle">
                Room {rent.roomNo}
              </p>

            </div>

            <button
              className="close-btn"
              onClick={onClose}
            >
              ×
            </button>

          </div>



          {/* =========================
              TABS
              ========================= */}

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



          {/* ==================================================
              OVERVIEW TAB
              ================================================== */}

          {activeTab === 'overview' && (

            <div className="monthly-rent-tab-content">

              <div className="monthly-rent-overview-grid">

                {/* Month */}

                <div className="monthly-rent-overview-card">

                  <label>
                    Month
                  </label>

                  <p>
                    {rent.month}-{rent.year}
                  </p>

                </div>



                {/* Light Bill */}

                <div className="monthly-rent-overview-card">

                  <label>
                    Light Bill
                  </label>

                  <p>
                    ₹{rent.totalLightBill}
                  </p>

                </div>



                {/* Monthly Rent */}

                <div className="monthly-rent-overview-card">

                  <label>
                    Monthly Rent
                  </label>

                  <p>
                    ₹{rent.rent}
                  </p>

                </div>



                {/* Total Rent */}

                <div className="monthly-rent-overview-card">

                  <label>
                    Total Rent
                  </label>

                  <p>
                    ₹{rent.totalRent}
                  </p>

                </div>



                {/* Total Rent Paid */}

                <div className="monthly-rent-overview-card">

                  <label>
                    Total Rent Paid
                  </label>

                  <p>
                    ₹{rent.totalRentPaid ?? 0}
                  </p>

                </div>



                {/* Payment Status */}

                <div className="monthly-rent-info-row">

                  <label>
                    Payment Status
                  </label>

                  <p>

                    {rent.paymentStatus === 'Paid' ? (

                      <span className="payment-paid">
                        ✓ Paid
                      </span>

                    ) : rent.paymentStatus === 'Partially Paid' ? (

                      <span className="payment-partial">
                        ◷ Partially Paid
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



          {/* ==================================================
              STUDENTS TAB
              ================================================== */}

          {activeTab === 'students' && (

            <div className="monthly-rent-tab-content">

              <h3>
                Students
              </h3>



              {students.length > 0 ? (

                <div className="student-name-list">

                  {students.map(
                    (student) => (

                      <button
                        key={student.studentId}
                        className="student-name-btn"
                        onClick={() =>
                          setSelectedStudent(
                            student
                          )
                        }
                      >
                        {student.studentName}
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



          {/* ==================================================
              RENT DETAILS TAB
              ================================================== */}

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
                    ₹{rent.rent}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Arrear Bill
                  </label>

                  <p>
                    ₹{rent.arrearBill}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Light Bill
                  </label>

                  <p>
                    ₹{rent.totalLightBill}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Total Rent
                  </label>

                  <p>
                    ₹{rent.totalRent}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Total Rent Paid
                  </label>

                  <p>
                    ₹{rent.totalRentPaid ?? 0}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Payment Status
                  </label>

                  <p>
                    {rent.paymentStatus || 'Pending'}
                  </p>

                </div>

              </div>

            </div>

          )}



          {/* ==================================================
              METER READING TAB
              ================================================== */}

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
                    {rent.lastReading}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Current Reading
                  </label>

                  <p>
                    {rent.currentReading}
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Units Consumed
                  </label>

                  <p>
                    {
                      Number(rent.currentReading) -
                      Number(rent.lastReading)
                    }
                  </p>

                </div>



                <div className="monthly-rent-info-row">

                  <label>
                    Light Bill
                  </label>

                  <p>
                    ₹{rent.totalLightBill}
                  </p>

                </div>

              </div>

            </div>

          )}



          {/* ==================================================
              MODAL BUTTONS
              ================================================== */}

          <div className="monthly-rent-modal-buttons">

            <button
              className="share-rent-btn"
              onClick={handleShareRentDetails}
            >
              Share Rent Details
            </button>



            <button
              className="cancel-btn"
              onClick={onClose}
            >
              Close
            </button>

          </div>

        </div>

      </div>



      {/* ==================================================
          STUDENT DETAILS POPUP
          ================================================== */}

      {selectedStudent && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal student-popup">

            {/* =========================
                HEADER
                ========================= */}

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



            {/* =========================
                STUDENT DETAILS
                ========================= */}

            <div className="student-details-popup">

              {/* Student ID */}

              <div className="student-detail-item">

                <label>
                  Student ID
                </label>

                <p>
                  {selectedStudent.studentId}
                </p>

              </div>



              {/* Student Name */}

              <div className="student-detail-item">

                <label>
                  Student Name
                </label>

                <p>
                  {selectedStudent.studentName}
                </p>

              </div>



              {/* Contact No. */}

              <div className="student-detail-item">

                <label>
                  Contact No.
                </label>

                <div className="student-phone-row">

                  <p>
                    {selectedStudent.contactNo}
                  </p>

                  <PhoneIcon
                    number={
                      selectedStudent.contactNo
                    }
                  />

                </div>

              </div>



              {/* Father Name */}

              <div className="student-detail-item">

                <label>
                  Father Name
                </label>

                <p>
                  {selectedStudent.fatherName}
                </p>

              </div>



              {/* Father Contact No. */}

              <div className="student-detail-item">

                <label>
                  Father Contact No.
                </label>

                <div className="student-phone-row">

                  <p>
                    {selectedStudent.fatherContact}
                  </p>

                  <PhoneIcon
                    number={
                      selectedStudent.fatherContact
                    }
                  />

                </div>

              </div>

            </div>



            {/* =========================
                CLOSE
                ========================= */}

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

    </>
  )
}



export default MonthlyRentViewModal