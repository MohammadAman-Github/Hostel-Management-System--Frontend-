import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from './api'


// =========================
// GET ALL ROOMS
// =========================

export const getRooms = async () => {

  const response = await getAllRooms()

  return response.data
}


// =========================
// CREATE ROOM
// =========================

export const createRoomData = async (roomData) => {

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

  const response =
    await updateRoom(
      roomNo,
      roomData
    )

  return response.data
}


// =========================
// DELETE ROOM
// =========================

export const deleteRoomData = async (roomNo) => {

  const response =
    await deleteRoom(roomNo)

  return response.data
}