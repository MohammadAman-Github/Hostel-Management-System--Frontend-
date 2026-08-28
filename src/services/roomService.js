import { Capacitor } from '@capacitor/core'

import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from './api'

import {
  getAllRoomsFromDb,
  createRoomInDb,
  updateRoomInDb,
  deleteRoomInDb
} from '../database/roomsDb.js'


// =========================
// GET ALL ROOMS
// =========================

export const getRooms = async () => {

  if (Capacitor.getPlatform() === 'android') {
    return await getAllRoomsFromDb()
  }

  const response = await getAllRooms()

  return response.data
}


// =========================
// CREATE ROOM
// =========================

export const createRoomData = async (roomData) => {

  if (Capacitor.getPlatform() === 'android') {
    return await createRoomInDb(roomData)
  }

  const response = await createRoom(roomData)

  return response.data
}


// =========================
// UPDATE ROOM
// =========================

export const updateRoomData = async (
  roomNo,
  roomData
) => {

  if (Capacitor.getPlatform() === 'android') {
    return await updateRoomInDb(roomNo, roomData)
  }

  const response = await updateRoom(
    roomNo,
    roomData
  )

  return response.data
}


// =========================
// DELETE ROOM
// =========================

export const deleteRoomData = async (roomNo) => {

  if (Capacitor.getPlatform() === 'android') {

    return await deleteRoomInDb(roomNo)

  }

  const response = await deleteRoom(roomNo)

  return response.data
}