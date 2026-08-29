import { getDatabase } from './database.js'

// =========================
// GET ALL ROOMS
// =========================

export const getAllRoomsFromDb = async () => {

  const db = getDatabase()

  const result = await db.query(`
    SELECT
      room_no AS roomNo,
      room_type AS roomType,
      floor,
      beds,
      tables,
      chairs,
      coolers,
      monthly_rent AS monthlyRent,
      light_bill AS lightBill,
      lastMeterReading,
      arrearBill,
      security_amount AS securityAmount,
      security_amount_status AS securityAmountStatus,
      occupancy_status AS occupancyStatus
    FROM room_details
    ORDER BY room_no
  `)

  return result.values || []
}


// =========================
// GET ROOM BY ROOM NUMBER
// =========================

export const getRoomByNoFromDb = async (roomNo) => {

  const db = getDatabase()

  const result = await db.query(
    `
    SELECT
      room_no AS roomNo,
      room_type AS roomType,
      floor,
      beds,
      tables,
      chairs,
      coolers,
      monthly_rent AS monthlyRent,
      light_bill AS lightBill,
      lastMeterReading,
      arrearBill,
      security_amount AS securityAmount,
      security_amount_status AS securityAmountStatus,
      occupancy_status AS occupancyStatus
    FROM room_details
    WHERE room_no = ?
    `,
    [roomNo]
  )

  return result.values?.[0] || null
}


// =========================
// CREATE ROOM
// =========================

export const createRoomInDb = async (roomData) => {

  console.log('CREATE ROOM START')
  console.log('Room data:', roomData)

  const db = getDatabase()

  console.log('DATABASE OBJECT:', db)

  try {

    const isOpen = await db.isDBOpen()

    console.log('DATABASE OPEN:', isOpen)

    if (!isOpen) {
      throw new Error('SQLite database is not open')
    }

    console.log('RUNNING INSERT...')

    await db.run(
      `
      INSERT INTO room_details (
        room_no,
        room_type,
        floor,
        beds,
        tables,
        chairs,
        coolers,
        monthly_rent,
        light_bill,
        security_amount,
        security_amount_status,
        occupancy_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        roomData.roomNo,
        roomData.roomType,
        roomData.floor,
        roomData.beds,
        roomData.tables,
        roomData.chairs,
        roomData.coolers,
        roomData.monthlyRent,
        roomData.lightBill,
        roomData.securityAmount,
        roomData.securityAmountStatus,
        roomData.occupancyStatus || 'VACANT'
      ]
    )

    console.log('INSERT SUCCESS')

    return await getRoomByNoFromDb(
      roomData.roomNo
    )

  } catch (error) {

    console.error(
      'CREATE ROOM SQLITE ERROR:',
      error
    )

    throw error
  }
}


// =========================
// UPDATE ROOM
// =========================

export const updateRoomInDb = async (
  roomNo,
  roomData
) => {

  const db = getDatabase()

  await db.run(
    `
    UPDATE room_details
    SET
      room_type = ?,
      floor = ?,
      beds = ?,
      tables = ?,
      chairs = ?,
      coolers = ?,
      monthly_rent = ?,
      light_bill = ?,
      security_amount = ?,
      security_amount_status = ?,
      lastMeterReading = ?,
      arrearBill = ?
    WHERE room_no = ?
    `,
    [
      roomData.roomType,
      roomData.floor,
      roomData.beds,
      roomData.tables,
      roomData.chairs,
      roomData.coolers,
      roomData.monthlyRent,
      roomData.lightBill,
      roomData.securityAmount,
      roomData.securityAmountStatus,
      Number(roomData.lastMeterReading),
      Number(roomData.arrearBill),
      roomNo
    ]
  )

  return await getRoomByNoFromDb(roomNo)
}


// =========================
// DELETE ROOM
// =========================

export const deleteRoomInDb = async (roomNo) => {

  const db = getDatabase()

  await db.run(
    `
    DELETE FROM room_details
    WHERE room_no = ?
    `,
    [roomNo]
  )

  return true
}


// =========================
// UPDATE ROOM OCCUPANCY
// =========================

export const updateRoomOccupancyInDb = async (roomNo) => {

  const db = getDatabase()

  const roomNumber = Number(roomNo)


  // =========================
  // COUNT ACTIVE STUDENTS
  // =========================

  const studentResult = await db.query(
    `
    SELECT COUNT(*) AS activeStudents
    FROM students
    WHERE room_no = ?
      AND status = 'ACTIVE'
    `,
    [roomNumber]
  )

  const activeStudents =
    Number(
      studentResult.values?.[0]?.activeStudents
    ) || 0


  // =========================
  // GET TOTAL BEDS
  // =========================

  const roomResult = await db.query(
    `
    SELECT beds
    FROM room_details
    WHERE room_no = ?
    `,
    [roomNumber]
  )


  // Room doesn't exist
  if (!roomResult.values?.length) {
    return null
  }


  const totalBeds =
    Number(roomResult.values[0].beds) || 0


  // =========================
  // DETERMINE OCCUPANCY
  // =========================

  let occupancyStatus

  if (activeStudents === 0) {

    occupancyStatus = 'VACANT'

  } else if (activeStudents < totalBeds) {

    occupancyStatus = 'PARTIALLY OCCUPIED'

  } else {

    occupancyStatus = 'OCCUPIED'

  }


  // =========================
  // UPDATE ROOM
  // =========================

  await db.run(
    `
    UPDATE room_details
    SET occupancy_status = ?
    WHERE room_no = ?
    `,
    [
      occupancyStatus,
      roomNumber
    ]
  )


  console.log(
    `Room ${roomNumber} occupancy updated:`,
    {
      activeStudents,
      totalBeds,
      occupancyStatus
    }
  )


  return occupancyStatus
}