import { Capacitor } from '@capacitor/core'

import {
  getMrdByMonthAndYear,
  getMrdByRoomNoAndYear,
  getMrdByMonthYearAndRoomNo,
  createMonthlyRent,
  updateMRD,
  deleteMRD
} from './api'

import {
  getMrdByMonthAndYearFromDb,
  getMrdByRoomNoAndYearFromDb,
  getMrdByMonthYearAndRoomNoFromDb,
  createMonthlyRentInDb,
  updateMRDInDb,
  deleteMRDInDb
} from '../database/monthlyRentDb.js'


// ==================================================
// GET MRD BY MONTH + YEAR
// ==================================================

export const getMonthlyRentByMonthAndYear = async (
  month,
  year
) => {

  if (Capacitor.getPlatform() === 'android') {

    const result =
      await getMrdByMonthAndYearFromDb(
        month,
        year
      )

    return result || []
  }

  const response =
    await getMrdByMonthAndYear(
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

  if (Capacitor.getPlatform() === 'android') {

    const result =
      await getMrdByRoomNoAndYearFromDb(
        roomNo,
        year
      )

    return result || []
  }

  const response =
    await getMrdByRoomNoAndYear(
      roomNo,
      year
    )

  return response.data || []
}


// ==================================================
// GET MRD BY MONTH + YEAR + ROOM
// ==================================================

export const getMonthlyRentByMonthYearAndRoomNo =
  async (
    month,
    year,
    roomNo
  ) => {

    if (Capacitor.getPlatform() === 'android') {

      return await getMrdByMonthYearAndRoomNoFromDb(
        month,
        year,
        roomNo
      )
    }

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

  if (Capacitor.getPlatform() === 'android') {

    return await createMonthlyRentInDb(
      mrdData
    )
  }

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

  if (Capacitor.getPlatform() === 'android') {

    return await updateMRDInDb(
      month,
      year,
      roomNo,
      updateData
    )
  }

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

  if (Capacitor.getPlatform() === 'android') {

    return await deleteMRDInDb(
      month,
      year,
      roomNo
    )
  }

  const response =
    await deleteMRD(
      month,
      year,
      roomNo
    )

  return response.data
}