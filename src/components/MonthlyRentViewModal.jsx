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
// WHATSAPP ICON
// ==================================================

const WhatsAppIcon = ({ number }) => {

  if (!number) {
    return null
  }

  const normalizeWhatsAppNumber = (value) => {

    const digits =
      String(value || '').replace(/\D/g, '')

    if (!digits) {
      return ''
    }

    if (digits.length === 10) {
      return `91${digits}`
    }

    if (
      digits.length === 11 &&
      digits.startsWith('0')
    ) {
      return `91${digits.slice(1)}`
    }

    return digits
  }

  const openWhatsApp = () => {

    const phone =
      normalizeWhatsAppNumber(number)

    if (!phone) {
      return
    }

    if (
      Capacitor.getPlatform() === 'android'
    ) {

      window.location.href =
        `whatsapp://send?phone=${phone}`

    } else {

      window.open(
        `https://wa.me/${phone}`,
        '_blank'
      )

    }
  }

  return (
    <button
      type="button"
      className="whatsapp-icon-button"
      onClick={openWhatsApp}
      aria-label={`Open WhatsApp for ${number}`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.52 3.48A11.85 11.85 0 0 0 12.07 0
          C5.5 0 .15 5.35.15 11.93
          C.15 14.03.7 16.08 1.74 17.88
          L.05 24l6.26-1.64
          a11.9 11.9 0 0 0 5.76 1.47h.01
          c6.58 0 11.93-5.35 11.93-11.93
          0-3.19-1.24-6.18-3.49-8.42ZM12.08 21.8
          a9.85 9.85 0 0 1-5.03-1.38l-.36-.21
          -3.72.98.99-3.62-.23-.37
          a9.86 9.86 0 0 1-1.51-5.27
          c0-5.45 4.44-9.88 9.89-9.88
          2.64 0 5.12 1.03 6.99 2.9
          a9.82 9.82 0 0 1 2.89 6.99
          c0 5.45-4.44 9.88-9.91 9.88Zm5.42-7.4
          c-.3-.15-1.78-.88-2.06-.98
          -.28-.1-.48-.15-.68.15
          -.2.3-.78.98-.95 1.18
          -.17.2-.35.22-.65.07
          -.3-.15-1.25-.46-2.38-1.47
          -.88-.78-1.47-1.74-1.64-2.04
          -.17-.3-.02-.46.13-.61
          .13-.13.3-.35.45-.52
          .15-.17.2-.3.3-.5
          .1-.2.05-.37-.02-.52
          -.07-.15-.68-1.64-.93-2.24
          -.25-.59-.5-.51-.68-.52
          -.17-.01-.37-.01-.57-.01
          -.2 0-.52.07-.8.37
          -.28.3-1.05 1.03-1.05 2.51
          0 1.48 1.08 2.91 1.23 3.11
          .15.2 2.13 3.25 5.16 4.56
          .72.31 1.28.5 1.72.64
          .72.23 1.38.2 1.9.12
          .58-.09 1.78-.73 2.03-1.43
          .25-.7.25-1.3.17-1.43
          -.07-.12-.27-.2-.57-.35Z"
          fill="currentColor"
        />
      </svg>
    </button>
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

  const [showShareStudentPopup, setShowShareStudentPopup] =
    useState(false)

  const [shareError, setShareError] =
    useState('')





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
  // FORMAT AMOUNT
  // ==================================================

  const formatAmount = (amount) =>
    Number(
      amount ?? 0
    ).toLocaleString(
      'en-IN'
    )





  // ==================================================
  // CREATE RENT SHARE MESSAGE
  // ==================================================

  const createRentShareMessage = () => {

    let message =
`🏠 Hostel Rent Details

Room No: ${rent.roomNo}
Month: ${rent.month} ${rent.year}

💰 Rent Details
Monthly Rent: ₹${formatAmount(rent.rent)}
Arrear Bill: ₹${formatAmount(rent.arrearBill)}
Light Bill: ₹${formatAmount(rent.totalLightBill)}
Total Rent: ₹${formatAmount(rent.totalRent)}`

    const hasMeterReading =
      rent.lastReading !== null &&
      rent.lastReading !== undefined &&
      rent.lastReading !== '' &&
      rent.currentReading !== null &&
      rent.currentReading !== undefined &&
      rent.currentReading !== ''

    if (hasMeterReading) {

      const unitsConsumed =
        Number(rent.currentReading) -
        Number(rent.lastReading)

      message +=
`
📊 Meter Reading
Last Reading: ${rent.lastReading}
Current Reading: ${rent.currentReading}
Units Consumed: ${unitsConsumed}`

    }

    return message
  }





  // ==================================================
  // SHARE RENT DETAILS
  // ==================================================

  const handleShareRentDetails = () => {

    setShareError('')

    const activeStudents =
      students.filter(
        (student) =>
          Number(student.roomNo) ===
            Number(rent.roomNo) &&
          String(
            student.status || 'ACTIVE'
          ).toUpperCase() === 'ACTIVE'
      )

    if (activeStudents.length === 0) {

      setShareError(
        'No active student found in this room.'
      )

      setShowShareStudentPopup(true)

      return
    }

    setShowShareStudentPopup(true)
  }





  // ==================================================
  // SHARE RENT WITH SELECTED STUDENT
  // ==================================================

  const shareRentWithStudent = (student) => {

    const rawNumber =
      String(
        student.whatsappNo || ''
      )

    const whatsappNo =
      rawNumber.replace(
        /\D/g,
        ''
      )

    if (!whatsappNo) {

      setShareError(
        `${student.studentName} does not have a WhatsApp number.`
      )

      return
    }

    let phone = whatsappNo

    if (whatsappNo.length === 10) {

      phone = `91${whatsappNo}`

    } else if (
      whatsappNo.length === 11 &&
      whatsappNo.startsWith('0')
    ) {

      phone =
        `91${whatsappNo.slice(1)}`

    }

    const message =
      createRentShareMessage()

    const encodedMessage =
      encodeURIComponent(message)

    setShowShareStudentPopup(false)
    setShareError('')

    if (
      Capacitor.getPlatform() === 'android'
    ) {

      window.location.href =
        `whatsapp://send?phone=${phone}&text=${encodedMessage}`

    } else {

      window.open(
        `https://wa.me/${phone}?text=${encodedMessage}`,
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

                <div className="monthly-rent-overview-card">

                  <label>
                    Month
                  </label>

                  <p>
                    {rent.month}-{rent.year}
                  </p>

                </div>

                <div className="monthly-rent-overview-card">

                  <label>
                    Light Bill
                  </label>

                  <p>
                    ₹{rent.totalLightBill}
                  </p>

                </div>

                <div className="monthly-rent-overview-card">

                  <label>
                    Monthly Rent
                  </label>

                  <p>
                    ₹{rent.rent}
                  </p>

                </div>

                <div className="monthly-rent-overview-card">

                  <label>
                    Total Rent
                  </label>

                  <p>
                    ₹{rent.totalRent}
                  </p>

                </div>

                <div className="monthly-rent-overview-card">

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

              <div className="student-detail-item">

                <label>
                  WhatsApp No.
                </label>

                <div className="student-phone-row">

                  <p>
                    {selectedStudent.whatsappNo ||
                      'Not Available'}
                  </p>

                  <WhatsAppIcon
                    number={
                      selectedStudent.whatsappNo
                    }
                  />

                </div>

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
          SHARE RENT - SELECT STUDENT POPUP
          ================================================== */}

      {showShareStudentPopup && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal student-popup">

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Select Student
                </h2>

                <p className="monthly-rent-modal-subtitle">
                  Select the student whose WhatsApp
                  should receive the rent details.
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() => {
                  setShowShareStudentPopup(false)
                  setShareError('')
                }}
              >
                ×
              </button>

            </div>





            {shareError && (

              <p
                style={{
                  color: 'red',
                  margin: '15px 0'
                }}
              >
                {shareError}
              </p>

            )}





            <div className="monthly-rent-tab-content">

              {students
                .filter(
                  (student) =>
                    Number(student.roomNo) ===
                      Number(rent.roomNo) &&
                    String(
                      student.status || 'ACTIVE'
                    ).toUpperCase() === 'ACTIVE'
                )
                .map(
                  (student) => (

                    <button
                      key={student.studentId}
                      className="student-name-btn"
                      style={{
                        width: '100%',
                        marginBottom: '10px',
                        textAlign: 'left'
                      }}
                      onClick={() =>
                        shareRentWithStudent(
                          student
                        )
                      }
                    >

                      <strong>
                        {student.studentName}
                      </strong>

                      <br />

                      <small>
                        WhatsApp:{' '}
                        {student.whatsappNo ||
                          'Not Available'}
                      </small>

                    </button>

                  )
                )}

              {students.filter(
                (student) =>
                  Number(student.roomNo) ===
                    Number(rent.roomNo) &&
                  String(
                    student.status || 'ACTIVE'
                  ).toUpperCase() === 'ACTIVE'
              ).length === 0 && (

                <p>
                  No active student found in this room.
                </p>

              )}

            </div>





            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowShareStudentPopup(false)
                  setShareError('')
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}





export default MonthlyRentViewModal
