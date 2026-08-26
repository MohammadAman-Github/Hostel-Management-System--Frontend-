import {
  getMrdByMonthAndYear,
  getMrdByRoomNoAndYear,
  getMrdByMonthYearAndRoomNo,
  createMonthlyRent,
  updateMRD,
  deleteMRD
} from './api'


// ==================================================
// GET MRD BY MONTH + YEAR
// ==================================================

export const getMonthlyRentByMonthAndYear = async (
  month,
  year
) => {

  const response = await getMrdByMonthAndYear(
    month,
    year
  )

  return response.data || []
}


// ==================================================
// GET MRD BY ROOM + YEAR
// ==================================================

export const getMonthlyRentByRoomNoAndYear = async (
  roomNo,
  year
) => {

  const response = await getMrdByRoomNoAndYear(
    roomNo,
    year
  )

  return response.data || []
}


// ==================================================
// GET MRD BY MONTH + YEAR + ROOM
// ==================================================

export const getMonthlyRentByMonthYearAndRoomNo = async (
  month,
  year,
  roomNo
) => {

  const response =
    await getMrdByMonthYearAndRoomNo(
      month,
      year,
      roomNo
    )

  return response.data || null
}


// ==================================================
// CREATE MONTHLY RENT
// ==================================================

export const createMonthlyRentData = async (
  mrdData
) => {

  const response =
    await createMonthlyRent(
      mrdData
    )

  return response.data
}


// ==================================================
// UPDATE MRD
// ==================================================

export const updateMonthlyRentData = async (
  month,
  year,
  roomNo,
  updateData
) => {

  const response =
    await updateMRD(
      month,
      year,
      roomNo,
      updateData
    )

  return response.data
}


// ==================================================
// DELETE MRD
// ==================================================

export const deleteMonthlyRentData = async (
  month,
  year,
  roomNo
) => {

  const response =
    await deleteMRD(
      month,
      year,
      roomNo
    )

  return response.data
}