import axios from 'axios'

// const API = axios.create({
//   baseURL: 'http://localhost:8080',
// })

const API = axios.create({
  baseURL: 'http://192.168.1.9:8080',
})

export const getAllStudents = () => {
  return API.get('/hms/allStudents')
}

export const createStudent = (studentData) => {
  return API.post('/hms/studentDetails', studentData)
}

export const updateStudent = (studentId, studentData) => {
  return API.patch(`/hms/student_id/${studentId}`, studentData)
}

export const deleteStudent = (studentId) => {
  return API.delete(`/hms/student_id/${studentId}`)
}

export const studentLeft = (studentId) => {
  return API.patch(`/hms/left_student_id/${studentId}`)
}

// =========================
// Room Detials 
// =========================


export const createRoom = (roomData) => {
  return API.post('/hms/roomDetails', roomData)
}


export const getAllRooms = () => {
  return API.get('/hms/allRooms')
}

export const updateRoom = (roomNo, roomData) => {
  return API.patch(`/hms/roomDetails/${roomNo}`, roomData)
}

export const deleteRoom = (roomNo) => {
  return API.delete(`/hms/roomNo/${roomNo}`)
}

// =========================
// MONTHLY RENT APIs
// =========================

// Get monthly rent details by month and year
export const getMrdByMonthAndYear = (month, year) => {
  return API.get(`/hms/mrd/month/${month}/year/${year}`)
}

// Get monthly rent details by room number and year

export const getMrdByRoomNoAndYear = (roomNo, year) => {
  return API.get(`/hms/mrd/room_no/${roomNo}/year/${year}`)
}

export const getMrdByMonthYearAndRoomNo = (month, year, roomNo) => {
  return API.get(`/hms/mrd/month/${month}/year/${year}/room_no/${roomNo}`)
}

// update payment status api
export const updatePaymentStatus = (month, year, roomNo, paymentStatus) => {
  return API.patch(
    `/hms/mrd/month/${month}/year/${year}/room_no/${roomNo}/payment_status`,
    {
      paymentStatus: paymentStatus
    }
  )
}

// Create monthly rent details
export const createMonthlyRent = (mrdData) => {
  return API.post(
    '/hms/monthly_rent_details',
    mrdData
  )
}

// Update monthly rent details
export const updateMRD = (month, year, roomNo, updateData) => {
  return API.patch(
    `/hms/mrd/month/${month}/year/${year}/room_no/${roomNo}`,
    updateData
  )
}

// Delete monthly rent details
export const deleteMRD = (month, year, roomNo) => {
  return API.delete(
    `/hms/mrd/month/${month}/year/${year}/room_no/${roomNo}`
  )
}


// =========================
// STUDENT PDF APIs
// =========================



export const uploadStudentPdf = (studentId, file) => {
  const formData = new FormData()
  formData.append('file', file)

  return API.post(
    `/hms/student_id/${studentId}/pdf`,
    formData
  )
}

export const updateStudentPdf = (studentId, file) => {
  const formData = new FormData()
  formData.append('file', file)

  return API.put(
    `/hms/${studentId}/pdf`,
    formData
  )
}

export const getStudentPdf = (studentId) => {
  return API.get(
    `/hms/student_id/${studentId}/pdf`,
    {
      responseType: 'blob'
    }
  )
}