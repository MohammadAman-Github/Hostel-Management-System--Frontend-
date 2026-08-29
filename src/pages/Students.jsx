import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'


import { useAndroidBack } from '../context/useAndroidBack'

import { getRooms } from '../services/roomService.js'

import {
  getStudents,
  createStudentData,
  updateStudentData,
  deleteStudentData,
  studentLeftData,
  uploadStudentPdfData,
  updateStudentPdfData,
  getStudentPdfData,
  studentPdfExists
} from '../services/studentService.js'

import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { FileOpener } from '@capacitor-community/file-opener'

const Students = () => {


  const {
  registerBackHandler,
  clearBackHandler
} = useAndroidBack()


  // ==================================================
  // STUDENTS
  // ==================================================

  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentView, setStudentView] = useState('active')
  const [activeSearch, setActiveSearch] = useState('')
  const [leftSearch, setLeftSearch] = useState('')


  // ==================================================
  // ADD / EDIT FORM
  // ==================================================

  const [showAddForm, setShowAddForm] = useState(false)

  const [studentForm, setStudentForm] = useState({
    studentName: '',
    roomNo: '',
    contactNo: '',
    aadharNo: '',
    fatherName: '',
    fatherContact: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    joiningDate: ''
  })

  const [errors, setErrors] = useState({})
  const [editingStudent, setEditingStudent] = useState(null)


  // ==================================================
  // DELETE
  // ==================================================

  const [studentToDelete, setStudentToDelete] = useState(null)
  const [showDeleteStudent, setShowDeleteStudent] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(null)


  // ==================================================
  // STUDENT PDF
  // ==================================================

  const [selectedPdfFile, setSelectedPdfFile] = useState(null)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfMessage, setPdfMessage] = useState('')
  const [pdfViewing, setPdfViewing] = useState(false)


  // ==================================================
  // MARK STUDENT LEFT
  // ==================================================

  const [studentToLeft, setStudentToLeft] = useState(null)


  // ==================================================
  // ROOMS
  // ==================================================

  const [rooms, setRooms] = useState([])

  const [androidPdfExists, setAndroidPdfExists] = useState(false)

 useEffect(() => {

  const checkStudentPdf = async () => {

    if (!selectedStudent) {
      setAndroidPdfExists(false)
      return
    }

    if (
      Capacitor.getPlatform() !== 'android'
    ) {
      return
    }

    try {

      const exists =
        await studentPdfExists(
          selectedStudent.studentId
        )

      setAndroidPdfExists(exists)

    } catch (error) {

      console.error(
        'Error checking student PDF:',
        error
      )

      setAndroidPdfExists(false)

    }
  }

  checkStudentPdf()

}, [selectedStudent])



  // ==================================================
// ANDROID BACK BUTTON
// ==================================================

useEffect(() => {

  // ==========================================
  // DELETE SUCCESS
  // ==========================================

  if (deleteSuccess) {

    registerBackHandler(() => {
      setDeleteSuccess(null)
    })

    return () => clearBackHandler()
  }


  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  if (showDeleteConfirmation) {

    registerBackHandler(() => {

      setShowDeleteConfirmation(false)
      setStudentToDelete(null)

    })

    return () => clearBackHandler()
  }


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  if (showDeleteStudent) {

    registerBackHandler(() => {

      setShowDeleteStudent(false)
      setStudentToDelete(null)

    })

    return () => clearBackHandler()
  }


  // ==========================================
  // STUDENT LEFT
  // ==========================================

  if (studentToLeft) {

    registerBackHandler(() => {
      setStudentToLeft(null)
    })

    return () => clearBackHandler()
  }


  // ==========================================
  // VIEW STUDENT
  // ==========================================

  if (selectedStudent) {

    registerBackHandler(() => {
      setSelectedStudent(null)
    })

    return () => clearBackHandler()
  }


  // ==========================================
  // ADD / EDIT STUDENT
  // ==========================================

  if (showAddForm || editingStudent) {

    registerBackHandler(() => {

      setShowAddForm(false)
      setEditingStudent(null)

    })

    return () => clearBackHandler()
  }


  // ==========================================
  // NO POPUP
  // ==========================================

  clearBackHandler()

}, [
  deleteSuccess,
  showDeleteConfirmation,
  showDeleteStudent,
  studentToLeft,
  selectedStudent,
  showAddForm,
  editingStudent,
  registerBackHandler,
  clearBackHandler
])



  // ==================================================
  // LOAD STUDENTS AND ROOMS
  // ==================================================

  useEffect(() => {

    getStudents()
      .then((students) => {

        console.log(
          'Students:',
          students
        )

        setStudents(students)

      })
      .catch((error) => {

        console.error(
          'Error fetching students:',
          error
        )

      })


    getRooms()
      .then((rooms) => {

        console.log(
          'Rooms for student dropdown:',
          rooms
        )

        setRooms(rooms)

      })
      .catch((error) => {

        console.error(
          'Error fetching rooms:',
          error
        )

      })

  }, [])


  // ==================================================
  // HANDLE FORM INPUT
  // ==================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setStudentForm({
      ...studentForm,
      [name]: value
    })


    const newErrors = {
      ...errors
    }


    if (
      name === 'studentName' &&
      value.trim() !== ''
    ) {
      delete newErrors.studentName
    }


    if (
      name === 'roomNo' &&
      value.trim() !== ''
    ) {
      delete newErrors.roomNo
    }


    if (
      name === 'contactNo' &&
      /^\d{10}$/.test(value)
    ) {
      delete newErrors.contactNo
    }


    if (
      name === 'aadharNo' &&
      /^\d{12}$/.test(value)
    ) {
      delete newErrors.aadharNo
    }


    if (
      name === 'fatherName' &&
      value.trim() !== ''
    ) {
      delete newErrors.fatherName
    }


    if (
      name === 'fatherContact' &&
      /^\d{10}$/.test(value)
    ) {
      delete newErrors.fatherContact
    }


    if (
      name === 'addressLine1' &&
      value.trim() !== ''
    ) {
      delete newErrors.addressLine1
    }


    if (
      name === 'city' &&
      value.trim() !== ''
    ) {
      delete newErrors.city
    }


    if (
      name === 'state' &&
      value.trim() !== ''
    ) {
      delete newErrors.state
    }


    if (
      name === 'pincode' &&
      /^\d{6}$/.test(value)
    ) {
      delete newErrors.pincode
    }


    if (
      name === 'joiningDate' &&
      value !== ''
    ) {
      delete newErrors.joiningDate
    }


    setErrors(newErrors)
  }


  // ==================================================
  // VALIDATE FORM
  // ==================================================

  const validateForm = () => {

    const newErrors = {}


    if (!studentForm.studentName.trim()) {

      newErrors.studentName =
        'Student name is required.'
    }


    if (!studentForm.roomNo) {

      newErrors.roomNo =
        'Room number is required.'
    }


    if (!studentForm.contactNo) {

      newErrors.contactNo =
        'Contact number is required.'

    } else if (
      !/^\d{10}$/.test(
        studentForm.contactNo
      )
    ) {

      newErrors.contactNo =
        'Contact number must contain 10 digits.'
    }


    if (!studentForm.aadharNo) {

      newErrors.aadharNo =
        'Aadhaar number is required.'

    } else if (
      !/^\d{12}$/.test(
        studentForm.aadharNo
      )
    ) {

      newErrors.aadharNo =
        'Aadhaar number must contain 12 digits.'
    }


    if (!studentForm.fatherName.trim()) {

      newErrors.fatherName =
        "Father's name is required."
    }


    if (!studentForm.fatherContact) {

      newErrors.fatherContact =
        "Father's contact number is required."

    } else if (
      !/^\d{10}$/.test(
        studentForm.fatherContact
      )
    ) {

      newErrors.fatherContact =
        "Father's contact number must contain 10 digits."
    }


    if (!studentForm.addressLine1.trim()) {

      newErrors.addressLine1 =
        'Address Line 1 is required.'
    }


    if (!studentForm.city.trim()) {

      newErrors.city =
        'City is required.'
    }


    if (!studentForm.state.trim()) {

      newErrors.state =
        'State is required.'
    }


    if (!studentForm.pincode) {

      newErrors.pincode =
        'Pincode is required.'

    } else if (
      !/^\d{6}$/.test(
        studentForm.pincode
      )
    ) {

      newErrors.pincode =
        'Pincode must contain 6 digits.'
    }


    if (!studentForm.joiningDate) {

      newErrors.joiningDate =
        'Joining date is required.'
    }


    setErrors(newErrors)

    return (
      Object.keys(newErrors).length === 0
    )
  }


  // ==================================================
  // RESET FORM
  // ==================================================

  const resetStudentForm = () => {

    setStudentForm({
      studentName: '',
      roomNo: '',
      contactNo: '',
      aadharNo: '',
      fatherName: '',
      fatherContact: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      joiningDate: ''
    })

    setErrors({})
  }


  // ==================================================
  // SAVE / UPDATE STUDENT
  // ==================================================

  const handleSaveStudent = async () => {

    if (!validateForm()) {
      return
    }


    try {

      // ==================================================
      // UPDATE STUDENT
      // ==================================================

      if (editingStudent) {

        const updatedStudent =
          await updateStudentData(
            editingStudent.studentId,
            studentForm
          )


        console.log(
          'Student updated:',
          updatedStudent
        )


        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.studentId ===
            editingStudent.studentId
              ? updatedStudent
              : student
          )
        )


        // ----------------------------------------------
        // REPLACE PDF IF NEW PDF SELECTED
        // ----------------------------------------------

        if (selectedPdfFile) {

          console.log(
            'NEW PDF SELECTED FOR UPDATE:',
            selectedPdfFile.name
          )


          await handleStudentPdfUpload(
            updatedStudent,
            true
          )

        } else {

          console.log(
            'NO NEW PDF SELECTED'
          )

        }


        setEditingStudent(null)
        setShowAddForm(false)
        resetStudentForm()
        setSelectedPdfFile(null)
        setPdfMessage('')

        return
      }


      // ==================================================
      // CREATE STUDENT
      // ==================================================

      const createdStudent =
        await createStudentData(
          studentForm
        )


      console.log(
        'Student created:',
        createdStudent
      )


      setStudents((prevStudents) => [
        ...prevStudents,
        createdStudent
      ])


      // ----------------------------------------------
      // SAVE PDF IF SELECTED
      // ----------------------------------------------

      if (selectedPdfFile) {

        await handleStudentPdfUpload(
          createdStudent,
          false
        )

      }


      setShowAddForm(false)
      resetStudentForm()
      setSelectedPdfFile(null)
      setPdfMessage('')


    } catch (error) {

      console.error(
        editingStudent
          ? 'Error updating student:'
          : 'Error creating student:',
        error
      )

    }
  }


  // ==================================================
  // ADD STUDENT
  // ==================================================

  const handleAddStudent = () => {

    setEditingStudent(null)
    setSelectedPdfFile(null)
    setPdfMessage('')
    resetStudentForm()
    setShowAddForm(true)

  }


  // ==================================================
  // DELETE STUDENT
  // ==================================================

  const handleDeleteStudent = () => {

    if (!studentToDelete) {
      return
    }


    const studentId =
      studentToDelete.studentId

    const studentName =
      studentToDelete.studentName


    deleteStudentData(studentId)
      .then((response) => {

        console.log(
          'Student deleted:',
          response
        )


        setStudents((prevStudents) =>
          prevStudents.filter(
            (student) =>
              student.studentId !== studentId
          )
        )


        setStudentToDelete(null)
        setShowDeleteConfirmation(false)


        setDeleteSuccess({
          name: studentName,
          id: studentId
        })

      })
      .catch((error) => {

        console.error(
          'Error deleting student:',
          error
        )

      })
  }


  // ==================================================
  // VIEW STUDENT PDF
  // ==================================================

  const handleViewStudentPdf = async (
  studentId
) => {

  try {

    setPdfViewing(true)
    setPdfMessage('')

    // ==================================================
    // ANDROID
    // ==================================================

    if (
  Capacitor.getPlatform() === 'android'
) {

  const pdfBase64 =
    await getStudentPdfData(
      studentId
    )

  if (!pdfBase64) {

    throw new Error(
      'PDF data was not received.'
    )

  }

  const fileName =
    `student_${studentId}.pdf`

  await Filesystem.writeFile({

    path: fileName,

    data: pdfBase64,

    directory: Directory.Cache

  })


  const fileUri =
    await Filesystem.getUri({

      path: fileName,

      directory: Directory.Cache

    })


  console.log(
    'PDF URI:',
    fileUri.uri
  )


  await FileOpener.open({

    filePath: fileUri.uri,

    contentType: 'application/pdf',

    openWithDefault: true

  })


  return
}


    // ==================================================
    // WEB
    // ==================================================

    const pdfBlob =
      await getStudentPdfData(
        studentId
      )

    if (!pdfBlob) {

      throw new Error(
        'PDF data was not received.'
      )

    }

    const pdfUrl =
      URL.createObjectURL(
        pdfBlob
      )

    const newWindow =
      window.open(
        pdfUrl,
        '_blank'
      )

    if (!newWindow) {

      window.location.href =
        pdfUrl

    }

    setTimeout(() => {

      URL.revokeObjectURL(
        pdfUrl
      )

    }, 60000)

  } catch (error) {

    console.error(
      'Error opening student PDF:',
      error
    )

    setPdfMessage(
      error?.message ||
      'Unable to open student PDF.'
    )

  } finally {

    setPdfViewing(false)

  }

}


  // ==================================================
  // UPLOAD / UPDATE STUDENT PDF
  // ==================================================

  const handleStudentPdfUpload = async (
    student,
    replace = false
  ) => {

    if (!selectedPdfFile) {

      setPdfMessage(
        'Please select a PDF file.'
      )

      return
    }


    if (
      selectedPdfFile.type !==
        'application/pdf' &&
      !selectedPdfFile.name
        ?.toLowerCase()
        ?.endsWith('.pdf')
    ) {

      setPdfMessage(
        'Only PDF files are allowed.'
      )

      return
    }


    try {

      setPdfUploading(true)
      setPdfMessage('')


      console.log(
        '========== PDF UPLOAD =========='
      )

      console.log(
        'Student ID:',
        student.studentId
      )

      console.log(
        'Replace:',
        replace
      )

      console.log(
        'Selected PDF:',
        selectedPdfFile
      )

      console.log(
        'PDF name:',
        selectedPdfFile?.name
      )

      console.log(
        'PDF size:',
        selectedPdfFile?.size
      )

      console.log(
        '================================'
      )


      let pdfPath


      // ==================================================
      // REPLACE EXISTING PDF
      // ==================================================

      if (replace) {

        pdfPath =
          await updateStudentPdfData(
            student.studentId,
            selectedPdfFile
          )

      }

      // ==================================================
      // SAVE NEW PDF
      // ==================================================

      else {

        pdfPath =
          await uploadStudentPdfData(
            student.studentId,
            selectedPdfFile
          )

      }


      console.log(
        'PDF saved path:',
        pdfPath
      )


      // ==================================================
      // UPDATE STUDENT STATE
      // ==================================================

      setStudents((prevStudents) =>
        prevStudents.map((item) =>
          item.studentId ===
          student.studentId
            ? {
                ...item,
                pdfPath: pdfPath
              }
            : item
        )
      )


      if (
        selectedStudent &&
        selectedStudent.studentId ===
          student.studentId
      ) {

        setSelectedStudent({
          ...selectedStudent,
          pdfPath: pdfPath
        })

      }


      setSelectedPdfFile(null)

      if (
  Capacitor.getPlatform() === 'android'
) {

  setAndroidPdfExists(true)

}


      setPdfMessage(
        replace
          ? 'PDF replaced successfully.'
          : 'PDF uploaded successfully.'
      )


    } catch (error) {

      console.error(
        'PDF upload error:',
        error
      )


      setPdfMessage(
        error?.response?.data ||
        error?.message ||
        'Unable to upload PDF.'
      )


      throw error


    } finally {

      setPdfUploading(false)

    }
  }


  // ==================================================
  // MARK STUDENT LEFT
  // ==================================================

  const handleStudentLeft = () => {

    if (!studentToLeft) {
      return
    }


    const studentId =
      studentToLeft.studentId


    studentLeftData(studentId)
      .then((updatedStudent) => {

        console.log(
          'Student marked as left:',
          updatedStudent
        )


        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.studentId === studentId
              ? updatedStudent
              : student
          )
        )


        setStudentToLeft(null)

      })
      .catch((error) => {

        console.error(
          'Error marking student as left:',
          error
        )

      })
  }


  // ==================================================
  // EDIT STUDENT
  // ==================================================

  const handleEditStudent = (student) => {

    console.log(
      'Editing student:',
      student
    )


    setSelectedPdfFile(null)
    setPdfMessage('')
    setEditingStudent(student)


    setStudentForm({

      studentName:
        student.studentName || '',

      roomNo:
        student.roomNo || '',

      contactNo:
        student.contactNo || '',

      aadharNo:
        student.aadharNo || '',

      fatherName:
        student.fatherName || '',

      fatherContact:
        student.fatherContact || '',

      addressLine1:
        student.addressLine1 || '',

      addressLine2:
        student.addressLine2 || '',

      city:
        student.city || '',

      state:
        student.state || '',

      pincode:
        student.pincode || '',

      joiningDate:
        student.joiningDate || ''

    })


    setErrors({})
  }


  // ==================================================
  // BODY SCROLL LOCK
  // ==================================================

  useEffect(() => {

    if (
      selectedStudent ||
      showAddForm ||
      editingStudent ||
      studentToLeft ||
      showDeleteStudent ||
      showDeleteConfirmation ||
      deleteSuccess
    ) {

      document.body.style.overflow =
        'hidden'

    } else {

      document.body.style.overflow =
        ''

    }


    return () => {

      document.body.style.overflow =
        ''

    }

  }, [
    selectedStudent,
    showAddForm,
    editingStudent,
    studentToLeft,
    showDeleteStudent,
    showDeleteConfirmation,
    deleteSuccess
  ])


  // ==================================================
  // ACTIVE / LEFT STUDENTS
  // ==================================================

  const activeStudents =
    students.filter(
      (student) =>
        student.status
          ?.toUpperCase() === 'ACTIVE'
    )


  const leftStudents =
    students.filter(
      (student) =>
        student.status
          ?.toUpperCase() === 'LEFT'
    )


  // ==================================================
  // ACTIVE SEARCH
  // ==================================================

  const filteredActiveStudents =
    activeStudents.filter((student) => {

      const searchValue =
        activeSearch
          .toLowerCase()
          .trim()


      return (

        student.studentName
          ?.toLowerCase()
          .includes(searchValue) ||

        student.contactNo
          ?.toString()
          .includes(searchValue) ||

        student.roomNo
          ?.toString()
          .includes(searchValue)

      )

    })


  // ==================================================
  // LEFT SEARCH
  // ==================================================

  const filteredLeftStudents =
    leftStudents.filter((student) => {

      const searchValue =
        leftSearch
          .toLowerCase()
          .trim()


      return (

        student.studentName
          ?.toLowerCase()
          .includes(searchValue) ||

        student.contactNo
          ?.toString()
          .includes(searchValue) ||

        student.studentId
          ?.toString()
          .includes(searchValue)

      )

    })


  // ==================================================
  // DISPLAYED STUDENTS
  // ==================================================

  const displayedStudents =
    studentView === 'active'
      ? filteredActiveStudents
      : filteredLeftStudents


  // ==================================================
  // JSX
  // ==================================================

  return (

    <div className="students-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="students-header">

        <div>

          <h1>

            {studentView === 'active'
              ? 'Active Students'
              : 'Left Students'}

          </h1>


          <p>

            {studentView === 'active'
              ? `Active Students: ${activeStudents.length}`
              : `Left Students: ${leftStudents.length}`}

          </p>

        </div>


        {studentView === 'active' && (

          <div className="student-header-buttons">

            <button
              className="add-student-btn"
              onClick={handleAddStudent}
            >
              + Add Student
            </button>

          </div>

        )}

      </div>


      {/* ==================================================
          LEFT STUDENT HEADER
          ================================================== */}

      {studentView === 'left' && (

        <div className="left-student-header">

          <button
            className="delete-student-header-btn"
            onClick={() => {

              setStudentToDelete(null)
              setShowDeleteStudent(true)

            }}
          >
            🗑 Delete Student
          </button>

        </div>

      )}


      {/* ==================================================
          ACTIVE / LEFT TABS
          ================================================== */}

      <div className="student-view-toggle">

        <button
          className={
            studentView === 'active'
              ? 'student-view-btn active'
              : 'student-view-btn'
          }
          onClick={() => {

            setStudentView('active')
            setActiveSearch('')

          }}
        >
          Active Students
        </button>


        <button
          className={
            studentView === 'left'
              ? 'student-view-btn active'
              : 'student-view-btn'
          }
          onClick={() => {

            setStudentView('left')
            setLeftSearch('')

          }}
        >
          Left Students
        </button>

      </div>


      {/* ==================================================
          SEARCH
          ================================================== */}

      <div className="student-search">

        <input
          type="text"
          placeholder={
            studentView === 'active'
              ? 'Search by name, contact no. or room no.'
              : 'Search by name, contact no. or student ID.'
          }
          value={
            studentView === 'active'
              ? activeSearch
              : leftSearch
          }
          onChange={(e) => {

            if (
              studentView === 'active'
            ) {

              setActiveSearch(
                e.target.value
              )

            } else {

              setLeftSearch(
                e.target.value
              )

            }

          }}
        />

      </div>


      {/* ==================================================
          STUDENTS TABLE
          ================================================== */}

      <div className="student-table-container">

        <table className="student-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>

              <th>
                {studentView === 'active'
                  ? 'Room'
                  : 'Leaving Date'}
              </th>

              <th>
                Joining Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {displayedStudents.length > 0 ? (

              displayedStudents.map(
                (student) => (

                  <tr
                    key={student.studentId}
                  >

                    <td>
                      {student.studentId}
                    </td>

                    <td>
                      {student.studentName}
                    </td>

                    <td>
                      {student.contactNo}
                    </td>


                    <td>

                      {studentView === 'active'
                        ? student.roomNo
                        : (
                          student.leavingDate ||
                          '-'
                        )}

                    </td>


                    <td>
                      {student.joiningDate}
                    </td>


                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedStudent(
                            student
                          )
                        }
                      >
                        View
                      </button>


                      {studentView === 'active' && (

                        <>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEditStudent(
                                student
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="left-btn"
                            onClick={() =>
                              setStudentToLeft(
                                student
                              )
                            }
                          >
                            Left
                          </button>

                        </>

                      )}

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center'
                  }}
                >

                  {studentView === 'active'
                    ? 'No active students found.'
                    : 'No left students found.'}

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* ==================================================
          ADD / EDIT STUDENT MODAL
          ================================================== */}

      {(showAddForm || editingStudent) &&
        createPortal(

          <div className="modal-overlay">

            <div className="add-student-form">


              <div className="add-student-form-header">

                <h2>

                  {editingStudent
                    ? 'Edit Student'
                    : 'Add Student'}

                </h2>


                <button
                  className="close-btn"
                  onClick={() => {

                    setShowAddForm(false)
                    setEditingStudent(null)
                    setErrors({})
                    setSelectedPdfFile(null)
                    setPdfMessage('')

                  }}
                >
                  ×
                </button>

              </div>


              <div className="student-form-grid">


                {/* STUDENT NAME */}

                <div>

                  <label>
                    Student Name
                  </label>

                  <input
                    type="text"
                    name="studentName"
                    value={
                      studentForm.studentName
                    }
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                  />

                  {errors.studentName && (

                    <p className="form-error">
                      {errors.studentName}
                    </p>

                  )}

                </div>


                {/* ROOM */}

                <div>

                  <label>
                    Room No
                  </label>

                  <select
                    name="roomNo"
                    value={
                      studentForm.roomNo
                    }
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Room
                    </option>


                    {rooms.length > 0 ? (

                      rooms.map((room) => (

                        <option
                          key={room.roomNo}
                          value={room.roomNo}
                        >
                          Room {room.roomNo}
                        </option>

                      ))

                    ) : (

                      <option disabled>
                        No rooms available
                      </option>

                    )}

                  </select>


                  {errors.roomNo && (

                    <p className="form-error">
                      {errors.roomNo}
                    </p>

                  )}

                </div>


                {/* CONTACT */}

                <div>

                  <label>
                    Contact No
                  </label>

                  <input
                    type="text"
                    name="contactNo"
                    value={
                      studentForm.contactNo
                    }
                    onChange={handleChange}
                    placeholder="Enter 10-digit contact number"
                  />

                  {errors.contactNo && (

                    <p className="form-error">
                      {errors.contactNo}
                    </p>

                  )}

                </div>


                {/* AADHAAR */}

                <div>

                  <label>
                    Aadhaar No
                  </label>

                  <input
                    type="text"
                    name="aadharNo"
                    value={
                      studentForm.aadharNo
                    }
                    onChange={handleChange}
                    placeholder="Enter 12 Digit Aadhar number"
                  />

                  {errors.aadharNo && (

                    <p className="form-error">
                      {errors.aadharNo}
                    </p>

                  )}

                </div>


                {/* FATHER NAME */}

                <div>

                  <label>
                    Father's Name
                  </label>

                  <input
                    type="text"
                    name="fatherName"
                    value={
                      studentForm.fatherName
                    }
                    onChange={handleChange}
                    placeholder="Enter Father's name"
                  />

                  {errors.fatherName && (

                    <p className="form-error">
                      {errors.fatherName}
                    </p>

                  )}

                </div>


                {/* FATHER CONTACT */}

                <div>

                  <label>
                    Father's Contact
                  </label>

                  <input
                    type="text"
                    name="fatherContact"
                    value={
                      studentForm.fatherContact
                    }
                    onChange={handleChange}
                    placeholder="Enter Father's contact number"
                  />

                  {errors.fatherContact && (

                    <p className="form-error">
                      {errors.fatherContact}
                    </p>

                  )}

                </div>


                {/* ADDRESS 1 */}

                <div>

                  <label>
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    name="addressLine1"
                    value={
                      studentForm.addressLine1
                    }
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                  />

                  {errors.addressLine1 && (

                    <p className="form-error">
                      {errors.addressLine1}
                    </p>

                  )}

                </div>


                {/* ADDRESS 2 */}

                <div>

                  <label>
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    name="addressLine2"
                    value={
                      studentForm.addressLine2
                    }
                    onChange={handleChange}
                    placeholder="Enter address line 2"
                  />

                </div>


                {/* CITY */}

                <div>

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      studentForm.city
                    }
                    onChange={handleChange}
                    placeholder="Enter city"
                  />

                  {errors.city && (

                    <p className="form-error">
                      {errors.city}
                    </p>

                  )}

                </div>


                {/* STATE */}

                <div>

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      studentForm.state
                    }
                    onChange={handleChange}
                    placeholder="Enter state"
                  />

                  {errors.state && (

                    <p className="form-error">
                      {errors.state}
                    </p>

                  )}

                </div>


                {/* PINCODE */}

                <div>

                  <label>
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      studentForm.pincode
                    }
                    onChange={handleChange}
                    placeholder="Enter pincode"
                  />

                  {errors.pincode && (

                    <p className="form-error">
                      {errors.pincode}
                    </p>

                  )}

                </div>


                {/* JOINING DATE */}

                <div>

                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={
                      studentForm.joiningDate
                    }
                    onChange={handleChange}
                  />

                  {errors.joiningDate && (

                    <p className="form-error">
                      {errors.joiningDate}
                    </p>

                  )}

                </div>


                {/* ==================================================
                    STUDENT PDF
                    ================================================== */}

                <div>

                  <label>
                    Student PDF
                  </label>


                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0] ||
                        null


                      if (
                        file &&
                        file.type !==
                          'application/pdf' &&
                        !file.name
                          ?.toLowerCase()
                          ?.endsWith('.pdf')
                      ) {

                        setSelectedPdfFile(
                          null
                        )

                        setPdfMessage(
                          'Only PDF files are allowed.'
                        )

                        return

                      }


                      setSelectedPdfFile(
                        file
                      )

                      setPdfMessage('')

                    }}
                    disabled={
                      pdfUploading
                    }
                  />


                  {pdfUploading && (

                    <p>
                      Saving PDF...
                    </p>

                  )}


                  {editingStudent?.pdfPath && (

                    <small>

                      Existing PDF found.
                      Select a new PDF to replace it.

                    </small>

                  )}


                  {pdfMessage && (

                    <p className="form-error">
                      {pdfMessage}
                    </p>

                  )}

                </div>

              </div>


              {/* ==================================================
                  FORM BUTTONS
                  ================================================== */}

              <div className="student-form-buttons">

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowAddForm(false)
                    setEditingStudent(null)
                    setErrors({})
                    setSelectedPdfFile(null)
                    setPdfMessage('')

                  }}
                  disabled={pdfUploading}
                >
                  Cancel
                </button>


                <button
                  className="save-student-btn"
                  onClick={handleSaveStudent}
                  disabled={pdfUploading}
                >

                  {editingStudent
                    ? 'Update Student'
                    : 'Save Student'}

                </button>

              </div>

            </div>

          </div>,

          document.body

        )}


      {/* ==================================================
          VIEW STUDENT MODAL
          ================================================== */}

      {selectedStudent &&
        createPortal(

          <div className="modal-overlay">

            <div className="student-details">


              <div className="student-details-header">

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


              <div className="student-details-grid">


                <div>
                  <strong>
                    Student ID
                  </strong>

                  <p>
                    {selectedStudent.studentId}
                  </p>
                </div>


                <div>
                  <strong>
                    Name
                  </strong>

                  <p>
                    {selectedStudent.studentName}
                  </p>
                </div>


                <div>
                  <strong>
                    Contact
                  </strong>

                  <p>
                    {selectedStudent.contactNo}
                  </p>
                </div>


                <div>
                  <strong>
                    Aadhaar
                  </strong>

                  <p>
                    {selectedStudent.aadharNo}
                  </p>
                </div>


                <div>
                  <strong>
                    Father's Name
                  </strong>

                  <p>
                    {selectedStudent.fatherName}
                  </p>
                </div>


                <div>
                  <strong>
                    Father's Contact
                  </strong>

                  <p>
                    {selectedStudent.fatherContact}
                  </p>
                </div>


                <div>
                  <strong>
                    Address
                  </strong>

                  <p>
                    {selectedStudent.addressLine1}
                  </p>
                </div>


                <div>
                  <strong>
                    Address 2
                  </strong>

                  <p>
                    {selectedStudent.addressLine2}
                  </p>
                </div>


                <div>
                  <strong>
                    City
                  </strong>

                  <p>
                    {selectedStudent.city}
                  </p>
                </div>


                <div>
                  <strong>
                    State
                  </strong>

                  <p>
                    {selectedStudent.state}
                  </p>
                </div>


                <div>
                  <strong>
                    Pincode
                  </strong>

                  <p>
                    {selectedStudent.pincode}
                  </p>
                </div>


                <div>
                  <strong>
                    Room
                  </strong>

                  <p>
                    {selectedStudent.roomNo ??
                      'Student Left'}
                  </p>
                </div>


                <div>
                  <strong>
                    Joining Date
                  </strong>

                  <p>
                    {selectedStudent.joiningDate}
                  </p>
                </div>


                <div>
                  <strong>
                    Status
                  </strong>

                  <p>
                    {selectedStudent.status}
                  </p>
                </div>


                <div>
                  <strong>
                    Leaving Date
                  </strong>

                  <p>
                    {
                      selectedStudent.leavingDate ||
                      'Still staying'
                    }
                  </p>
                </div>


                {/* ==================================================
                    PDF VIEW
                    ================================================== */}

                <div>

                  <strong>
                    PDF
                  </strong>


                  {(
  Capacitor.getPlatform() === 'android'
    ? androidPdfExists
    : selectedStudent.pdfPath
) ? (

  <button
    className="view-btn"
    onClick={() =>
      handleViewStudentPdf(
        selectedStudent.studentId
      )
    }
    disabled={
      pdfViewing
    }
  >

    {pdfViewing
      ? 'Opening PDF...'
      : 'View PDF'}

  </button>

) : (

  <p>
    No PDF uploaded
  </p>

)}


                  {pdfMessage && (

                    <p className="form-error">
                      {pdfMessage}
                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>,

          document.body

        )}


      {/* ==================================================
          STUDENT LEFT CONFIRMATION
          ================================================== */}

      {studentToLeft &&
        createPortal(

          <div className="modal-overlay">

            <div className="delete-confirmation">

              <h2>
                Student Leaving Hostel?
              </h2>


              <p>

                Are you sure you want to mark{' '}

                <strong>
                  {studentToLeft.studentName}
                </strong>

                {' '}as left the hostel?

              </p>


              <p className="delete-warning">

                The student's record will be preserved.

              </p>


              <div className="delete-buttons">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setStudentToLeft(null)
                  }
                >
                  Cancel
                </button>


                <button
                  className="confirm-delete-btn"
                  onClick={handleStudentLeft}
                >
                  Yes, Student Left
                </button>

              </div>

            </div>

          </div>,

          document.body

        )}


      {/* ==================================================
          SELECT STUDENT TO DELETE
          ================================================== */}

      {showDeleteStudent &&
        createPortal(

          <div className="modal-overlay">

            <div className="delete-student-selection">


              <div className="delete-student-selection-header">

                <h2>
                  Delete Student
                </h2>


                <button
                  className="close-btn"
                  onClick={() => {

                    setShowDeleteStudent(false)
                    setStudentToDelete(null)

                  }}
                >
                  ×
                </button>

              </div>


              <div className="delete-student-selection-body">

                <label>
                  Select Student
                </label>


                <select
                  value={
                    studentToDelete?.studentId ||
                    ''
                  }
                  onChange={(e) => {

                    const selectedId =
                      Number(
                        e.target.value
                      )


                    const student =
                      leftStudents.find(
                        (student) =>
                          student.studentId ===
                          selectedId
                      )


                    setStudentToDelete(
                      student || null
                    )

                  }}
                >

                  <option value="">
                    Select Student
                  </option>


                  {leftStudents.map(
                    (student) => (

                      <option
                        key={
                          student.studentId
                        }
                        value={
                          student.studentId
                        }
                      >

                        {student.studentName}
                        {' - ID '}
                        {student.studentId}

                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="student-form-buttons">

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowDeleteStudent(false)
                    setStudentToDelete(null)

                  }}
                >
                  Cancel
                </button>


                <button
                  className="confirm-delete-btn"
                  disabled={
                    !studentToDelete
                  }
                  onClick={() => {

                    setShowDeleteStudent(false)
                    setShowDeleteConfirmation(true)

                  }}
                >
                  Continue
                </button>

              </div>

            </div>

          </div>,

          document.body

        )}


      {/* ==================================================
          DELETE CONFIRMATION
          ================================================== */}

      {showDeleteConfirmation &&
        studentToDelete &&
        createPortal(

          <div className="modal-overlay">

            <div className="delete-confirmation">

              <h2>
                Delete Student?
              </h2>


              <p>

                Are you sure you want to delete{' '}

                <strong>
                  {studentToDelete.studentName}
                </strong>

                ?

              </p>


              <p className="delete-warning">

                This action cannot be undone.

              </p>


              <div className="delete-buttons">

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowDeleteConfirmation(false)
                    setStudentToDelete(null)

                  }}
                >
                  Cancel
                </button>


                <button
                  className="confirm-delete-btn"
                  onClick={handleDeleteStudent}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>,

          document.body

        )}


      {/* ==================================================
          DELETE SUCCESS
          ================================================== */}

      {deleteSuccess &&
        createPortal(

          <div className="modal-overlay">

            <div className="delete-success">

              <h2>
                Student Deleted Successfully
              </h2>


              <p>

                <strong>
                  {deleteSuccess.name}
                </strong>

                {' '}with Student ID{' '}

                <strong>
                  {deleteSuccess.id}
                </strong>

                {' '}has been deleted.

              </p>


              <button
                className="success-ok-btn"
                onClick={() =>
                  setDeleteSuccess(null)
                }
              >
                OK
              </button>

            </div>

          </div>,

          document.body

        )}

    </div>

  )
}


export default Students