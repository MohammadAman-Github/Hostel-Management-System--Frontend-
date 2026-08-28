import { Capacitor } from '@capacitor/core'

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  studentLeft,
  getStudentPdf,
  uploadStudentPdf,
  updateStudentPdf
} from './api'

import {
  getAllStudentsFromDb,
  createStudentInDb,
  updateStudentInDb,
  deleteStudentInDb,
  studentLeftInDb
} from '../database/studentsDb.js'


// =========================
// GET ALL STUDENTS
// =========================

export const getStudents = async () => {

  if (Capacitor.getPlatform() === 'android') {

    return await getAllStudentsFromDb()

  }

  const response =
    await getAllStudents()

  return response.data
}


// =========================
// CREATE STUDENT
// =========================

export const createStudentData = async (
  studentData
) => {

  if (Capacitor.getPlatform() === 'android') {

    return await createStudentInDb(
      studentData
    )

  }

  const response =
    await createStudent(
      studentData
    )

  return response.data
}


// =========================
// UPDATE STUDENT
// =========================

export const updateStudentData = async (
  studentId,
  studentData
) => {

  if (Capacitor.getPlatform() === 'android') {

    return await updateStudentInDb(
      studentId,
      studentData
    )

  }

  const response =
    await updateStudent(
      studentId,
      studentData
    )

  return response.data
}


// =========================
// DELETE STUDENT
// =========================

export const deleteStudentData = async (
  studentId
) => {

  if (Capacitor.getPlatform() === 'android') {

    return await deleteStudentInDb(
      studentId
    )

  }

  const response =
    await deleteStudent(
      studentId
    )

  return response.data
}


// =========================
// STUDENT LEFT
// =========================

export const studentLeftData = async (
  studentId
) => {

  if (Capacitor.getPlatform() === 'android') {

    return await studentLeftInDb(
      studentId
    )

  }

  const response =
    await studentLeft(
      studentId
    )

  return response.data
}


// =========================
// UPLOAD STUDENT PDF
// =========================

export const uploadStudentPdfData = async (
  studentId,
  file
) => {

  const response =
    await uploadStudentPdf(
      studentId,
      file
    )

  return response.data
}


// =========================
// UPDATE STUDENT PDF
// =========================

export const updateStudentPdfData = async (
  studentId,
  file
) => {

  const response =
    await updateStudentPdf(
      studentId,
      file
    )

  return response.data
}


// =========================
// GET STUDENT PDF
// =========================

export const getStudentPdfData = async (
  studentId
) => {

  const response =
    await getStudentPdf(
      studentId
    )

  return response.data
}