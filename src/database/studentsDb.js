import { getDatabase } from './database.js'

import {
  updateRoomOccupancyInDb
} from './roomsDb.js'


// =========================
// GET ALL STUDENTS
// =========================

export const getAllStudentsFromDb = async () => {

  const db = getDatabase()

  const result = await db.query(`
    SELECT
      student_id AS studentId,
      student_name AS studentName,
      contact_no AS contactNo,
      aadhar_no AS aadharNo,
      father_name AS fatherName,
      father_contact AS fatherContact,
      address_line_1 AS addressLine1,
      address_line_2 AS addressLine2,
      city,
      state,
      pincode,
      room_no AS roomNo,
      joining_date AS joiningDate,
      leaving_date AS leavingDate,
      status
    FROM students
    ORDER BY room_no ASC, student_id ASC
  `)

  return result.values || []
}


// =========================
// GET STUDENT BY ID
// =========================

export const getStudentByIdFromDb = async (studentId) => {

  const db = getDatabase()

  const result = await db.query(
    `
    SELECT
      student_id AS studentId,
      student_name AS studentName,
      contact_no AS contactNo,
      aadhar_no AS aadharNo,
      father_name AS fatherName,
      father_contact AS fatherContact,
      address_line_1 AS addressLine1,
      address_line_2 AS addressLine2,
      city,
      state,
      pincode,
      room_no AS roomNo,
      joining_date AS joiningDate,
      leaving_date AS leavingDate,
      status
    FROM students
    WHERE student_id = ?
    `,
    [studentId]
  )

  return result.values?.[0] || null
}


// =========================
// CREATE STUDENT
// =========================

export const createStudentInDb = async (studentData) => {

  const db = getDatabase()

  await db.run(
    `
    INSERT INTO students (
      student_name,
      contact_no,
      aadhar_no,
      father_name,
      father_contact,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      room_no,
      joining_date,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      studentData.studentName,
      studentData.contactNo,
      studentData.aadharNo,
      studentData.fatherName,
      studentData.fatherContact,
      studentData.addressLine1,
      studentData.addressLine2,
      studentData.city,
      studentData.state,
      studentData.pincode,
      Number(studentData.roomNo),
      studentData.joiningDate,
      'ACTIVE'
    ]
  )

  // Update occupancy of new room
  await updateRoomOccupancyInDb(
    Number(studentData.roomNo)
  )

  const result = await db.query(`
    SELECT
      student_id AS studentId,
      student_name AS studentName,
      contact_no AS contactNo,
      aadhar_no AS aadharNo,
      father_name AS fatherName,
      father_contact AS fatherContact,
      address_line_1 AS addressLine1,
      address_line_2 AS addressLine2,
      city,
      state,
      pincode,
      room_no AS roomNo,
      joining_date AS joiningDate,
      leaving_date AS leavingDate,
      status
    FROM students
    ORDER BY student_id DESC
    LIMIT 1
  `)

  return result.values?.[0] || null
}


// =========================
// UPDATE STUDENT
// =========================

export const updateStudentInDb = async (
  studentId,
  studentData
) => {

  const db = getDatabase()

  // Get old student data BEFORE update
  const oldStudent =
    await getStudentByIdFromDb(studentId)

  if (!oldStudent) {
    throw new Error('Student not found')
  }

  const oldRoomNo = oldStudent.roomNo
  const newRoomNo = Number(studentData.roomNo)


  // Update student
  await db.run(
    `
    UPDATE students
    SET
      student_name = ?,
      contact_no = ?,
      aadhar_no = ?,
      father_name = ?,
      father_contact = ?,
      address_line_1 = ?,
      address_line_2 = ?,
      city = ?,
      state = ?,
      pincode = ?,
      room_no = ?,
      joining_date = ?
    WHERE student_id = ?
    `,
    [
      studentData.studentName,
      studentData.contactNo,
      studentData.aadharNo,
      studentData.fatherName,
      studentData.fatherContact,
      studentData.addressLine1,
      studentData.addressLine2,
      studentData.city,
      studentData.state,
      studentData.pincode,
      newRoomNo,
      studentData.joiningDate,
      studentId
    ]
  )


  // =========================
  // UPDATE ROOM OCCUPANCY
  // =========================

  if (
    oldRoomNo !== null &&
    Number(oldRoomNo) !== newRoomNo
  ) {

    // Old room
    await updateRoomOccupancyInDb(
      Number(oldRoomNo)
    )

    // New room
    await updateRoomOccupancyInDb(
      newRoomNo
    )

  } else {

    // Same room
    await updateRoomOccupancyInDb(
      newRoomNo
    )

  }


  return await getStudentByIdFromDb(studentId)
}


// =========================
// DELETE STUDENT
// =========================

export const deleteStudentInDb = async (studentId) => {

  const db = getDatabase()

  const student =
    await getStudentByIdFromDb(studentId)

  if (!student) {
    throw new Error('Student not found')
  }

  const oldRoomNo = student.roomNo


  await db.run(
    `
    DELETE FROM students
    WHERE student_id = ?
    `,
    [studentId]
  )


  // Update old room occupancy
  if (oldRoomNo !== null) {

    await updateRoomOccupancyInDb(
      Number(oldRoomNo)
    )

  }


  return true
}


// =========================
// MARK STUDENT LEFT
// =========================

export const studentLeftInDb = async (studentId) => {

  const db = getDatabase()

  // Get room BEFORE setting room_no to NULL
  const student =
    await getStudentByIdFromDb(studentId)

  if (!student) {
    throw new Error('Student not found')
  }

  const oldRoomNo = student.roomNo


  await db.run(
    `
    UPDATE students
    SET
      room_no = NULL,
      leaving_date = date('now'),
      status = 'LEFT'
    WHERE student_id = ?
    `,
    [studentId]
  )


  // Update old room occupancy
  if (oldRoomNo !== null) {

    await updateRoomOccupancyInDb(
      Number(oldRoomNo)
    )

  }


  return await getStudentByIdFromDb(studentId)
}