import { getDatabase } from './database.js'


// ==================================================
// GET MRD BY MONTH + YEAR
// ==================================================

export const getMrdByMonthAndYearFromDb = async (
  month,
  year
) => {

  const db = getDatabase()

  const result = await db.query(
    `
    SELECT
      id,
      month,
      year,
      room_no AS roomNo,
      rent,
      last_reading AS lastReading,
      current_reading AS currentReading,
      total_light_bill AS totalLightBill,
      arrear_bill AS arrearBill,
      total_rent AS totalRent,
      total_rent_paid AS totalRentPaid,
      payment_status AS paymentStatus
    FROM monthly_rent_details
    WHERE month = ?
      AND year = ?
    ORDER BY room_no
    `,
    [
      month,
      year
    ]
  )

  return result.values || []
}


// ==================================================
// GET MRD BY ROOM + YEAR
// ==================================================

export const getMrdByRoomNoAndYearFromDb = async (
  roomNo,
  year
) => {

  const db = getDatabase()

  const result = await db.query(
    `
    SELECT
      id,
      month,
      year,
      room_no AS roomNo,
      rent,
      last_reading AS lastReading,
      current_reading AS currentReading,
      total_light_bill AS totalLightBill,
      arrear_bill AS arrearBill,
      total_rent AS totalRent,
      total_rent_paid AS totalRentPaid,
      payment_status AS paymentStatus
    FROM monthly_rent_details
    WHERE room_no = ?
      AND year = ?
    ORDER BY
      CASE month
        WHEN 'January' THEN 1
        WHEN 'February' THEN 2
        WHEN 'March' THEN 3
        WHEN 'April' THEN 4
        WHEN 'May' THEN 5
        WHEN 'June' THEN 6
        WHEN 'July' THEN 7
        WHEN 'August' THEN 8
        WHEN 'September' THEN 9
        WHEN 'October' THEN 10
        WHEN 'November' THEN 11
        WHEN 'December' THEN 12
      END
    `,
    [
      roomNo,
      year
    ]
  )

  return result.values || []
}


// ==================================================
// GET MRD BY MONTH + YEAR + ROOM
// ==================================================

export const getMrdByMonthYearAndRoomNoFromDb = async (
  month,
  year,
  roomNo
) => {

  const db = getDatabase()

  const result = await db.query(
    `
    SELECT
      id,
      month,
      year,
      room_no AS roomNo,
      rent,
      last_reading AS lastReading,
      current_reading AS currentReading,
      total_light_bill AS totalLightBill,
      arrear_bill AS arrearBill,
      total_rent AS totalRent,
      total_rent_paid AS totalRentPaid,
      payment_status AS paymentStatus
    FROM monthly_rent_details
    WHERE month = ?
      AND year = ?
      AND room_no = ?
    `,
    [
      month,
      year,
      roomNo
    ]
  )

  return result.values?.[0] || null
}


// ==================================================
// CREATE MONTHLY RENT
// ==================================================

export const createMonthlyRentInDb = async (
  mrdData
) => {

  const db = getDatabase()

  const month = mrdData.month
  const year = String(mrdData.year)
  const roomNo = Number(mrdData.roomNo)
  const currentReading = Number(
    mrdData.currentReading
  )

  // ==================================================
  // CHECK DUPLICATE MRD
  // ==================================================

  const existing = await db.query(
    `
    SELECT id
    FROM monthly_rent_details
    WHERE month = ?
      AND year = ?
      AND room_no = ?
    `,
    [
      month,
      year,
      roomNo
    ]
  )

  if (existing.values?.length > 0) {

    throw new Error(
      'Monthly rent already exists for this room, month and year.'
    )

  }


  // ==================================================
  // GET ROOM DETAILS
  // ==================================================

  const roomResult = await db.query(
    `
    SELECT
      monthly_rent AS monthlyRent,
      light_bill AS lightBill,
      lastMeterReading,
      arrearBill
    FROM room_details
    WHERE room_no = ?
    `,
    [roomNo]
  )

  if (!roomResult.values?.length) {

    throw new Error(
      `Room ${roomNo} not found.`
    )

  }

  const room = roomResult.values[0]


  // ==================================================
  // GET LAST METER READING
  // ==================================================

  let lastReading =
    Number(room.lastMeterReading) || 0


  // ==================================================
  // GET PREVIOUS MONTH MRD
  // ==================================================

  const previousMrd = await getPreviousMrd(
    db,
    month,
    year,
    roomNo
  )

  if (previousMrd) {

    lastReading =
      Number(previousMrd.currentReading) || lastReading

  }


  // ==================================================
  // CALCULATE UNITS
  // ==================================================

  const totalUnits =
    currentReading - lastReading


  if (totalUnits < 0) {

    throw new Error(
      'Current reading cannot be less than last reading.'
    )

  }


  // ==================================================
  // LIGHT BILL
  // ==================================================


  /*
   * Your existing backend logic uses:
   *
   * totalUnits × 10
   *
   * We therefore keep the same calculation here.
   */

  /*
 * Your existing backend logic uses:
 *
 * totalUnits × 10
 */

   const lightBill = totalUnits * 10


  // ==================================================
  // RENT
  // ==================================================

  let rent =
    Number(room.monthlyRent) || 0


  if (
    mrdData.rent !== undefined &&
    mrdData.rent !== null &&
    mrdData.rent !== ''
  ) {

    rent = Number(mrdData.rent)

  }


  // ==================================================
  // ARREAR BILL
  // ==================================================

  const arrearBill =
    Number(room.arrearBill) || 0


  // ==================================================
  // TOTAL RENT
  // ==================================================

  const totalRent =
    rent +
    lightBill +
    arrearBill


  // ==================================================
  // TOTAL RENT PAID
  // ==================================================

  let totalRentPaid = 0

  if (mrdData.totalRentPaid !== undefined) {

    totalRentPaid =
      Number(mrdData.totalRentPaid) || 0

  }


  // ==================================================
  // PAYMENT STATUS
  // ==================================================

  const paymentStatus =
    mrdData.paymentStatus || 'Pending'


  // ==================================================
  // INSERT
  // ==================================================

  await db.run(
    `
    INSERT INTO monthly_rent_details (
      month,
      year,
      room_no,
      rent,
      last_reading,
      current_reading,
      total_light_bill,
      arrear_bill,
      total_rent,
      total_rent_paid,
      payment_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      month,
      year,
      roomNo,
      rent,
      lastReading,
      currentReading,
      lightBill,
      arrearBill,
      totalRent,
      totalRentPaid,
      paymentStatus
    ]
  )


  // ==================================================
  // RETURN CREATED MRD
  // ==================================================

  return await getMrdByMonthYearAndRoomNoFromDb(
    month,
    year,
    roomNo
  )
}


// ==================================================
// GET PREVIOUS MRD
// ==================================================

const getPreviousMrd = async (
  db,
  month,
  year,
  roomNo
) => {

  const monthNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  }

  const currentMonthNumber =
    monthNumber[month]

  const currentYear =
    Number(year)


  if (!currentMonthNumber) {
    return null
  }


  // ==================================================
  // PREVIOUS MONTH IN SAME YEAR
  // ==================================================

  if (currentMonthNumber > 1) {

    const previousMonth =
      Object.keys(monthNumber).find(
        (key) =>
          monthNumber[key] ===
          currentMonthNumber - 1
      )

    const result = await db.query(
      `
      SELECT
        current_reading AS currentReading
      FROM monthly_rent_details
      WHERE month = ?
        AND year = ?
        AND room_no = ?
      `,
      [
        previousMonth,
        String(currentYear),
        roomNo
      ]
    )

    if (result.values?.length > 0) {

      return result.values[0]

    }

  }


  // ==================================================
  // DECEMBER → JANUARY
  // ==================================================

  if (currentMonthNumber === 1) {

    const result = await db.query(
      `
      SELECT
        current_reading AS currentReading
      FROM monthly_rent_details
      WHERE month = 'December'
        AND year = ?
        AND room_no = ?
      `,
      [
        String(currentYear - 1),
        roomNo
      ]
    )

    if (result.values?.length > 0) {

      return result.values[0]

    }

  }


  return null
}


// ==================================================
// UPDATE MRD
// ==================================================

export const updateMRDInDb = async (
  month,
  year,
  roomNo,
  updateData
) => {

  const db = getDatabase()


  // ==================================================
  // GET EXISTING MRD
  // ==================================================

  const existing =
    await getMrdByMonthYearAndRoomNoFromDb(
      month,
      year,
      roomNo
    )

  if (!existing) {

    throw new Error(
      'Monthly rent details not found.'
    )

  }


  // ==================================================
  // ARREAR BILL
  // ==================================================

  const arrearBill =
    updateData.arrearBill !== undefined &&
    updateData.arrearBill !== null
      ? Number(updateData.arrearBill)
      : Number(existing.arrearBill) || 0


  if (arrearBill < 0) {

    throw new Error(
      'Arrear bill cannot be negative.'
    )

  }


  // ==================================================
  // PAYMENT STATUS
  // ==================================================

  const paymentStatus =
    updateData.paymentStatus ||
    existing.paymentStatus ||
    'Pending'


  // ==================================================
  // TOTAL LIGHT BILL
  // ==================================================

  const totalUnits =
    Number(existing.currentReading || 0) -
    Number(existing.lastReading || 0)

  const totalLightBill =
    totalUnits * 10


  // ==================================================
  // TOTAL RENT
  // ==================================================

  /*
   * IMPORTANT:
   *
   * Keep the existing total rent.
   *
   * Arrear bill is already part of the
   * payment calculation and should NOT
   * be added to totalRent again during edit.
   *
   * This matches the existing backend logic.
   */

  const totalRent =
    Number(existing.totalRent) || 0


  // ==================================================
  // TOTAL RENT PAID
  // ==================================================

  /*
   * Same logic as backend:
   *
   * Total Rent Paid =
   * Total Rent - Arrear Bill
   */

  const totalRentPaid =
    totalRent - arrearBill


  // ==================================================
  // UPDATE
  // ==================================================

  await db.run(
    `
    UPDATE monthly_rent_details
    SET
      arrear_bill = ?,
      total_rent = ?,
      total_rent_paid = ?,
      total_light_bill = ?,
      payment_status = ?
    WHERE month = ?
      AND year = ?
      AND room_no = ?
    `,
    [
      arrearBill,
      totalRent,
      totalRentPaid,
      totalLightBill,
      paymentStatus,
      month,
      String(year),
      Number(roomNo)
    ]
  )


  // ==================================================
  // RETURN UPDATED MRD
  // ==================================================

  return await getMrdByMonthYearAndRoomNoFromDb(
    month,
    year,
    roomNo
  )
}

// ==================================================
// DELETE MRD
// ==================================================

export const deleteMRDInDb = async (
  month,
  year,
  roomNo
) => {

  const db = getDatabase()

  // ==================================================
  // GET EXISTING MRD
  // ==================================================

  const existing =
    await getMrdByMonthYearAndRoomNoFromDb(
      month,
      year,
      roomNo
    )

  if (!existing) {
    throw new Error(
      'Monthly rent details not found.'
    )
  }


  // ==================================================
  // DELETE MRD
  // ==================================================

  await db.run(
    `
    DELETE FROM monthly_rent_details
    WHERE month = ?
      AND year = ?
      AND room_no = ?
    `,
    [
      month,
      String(year),
      Number(roomNo)
    ]
  )


  // ==================================================
  // FIND LATEST REMAINING MRD
  // ==================================================

  const remaining = await db.query(
    `
    SELECT
      current_reading AS currentReading,
      arrear_bill AS arrearBill
    FROM monthly_rent_details
    WHERE room_no = ?
    ORDER BY
      CAST(year AS INTEGER) DESC,
      CASE month
        WHEN 'January' THEN 1
        WHEN 'February' THEN 2
        WHEN 'March' THEN 3
        WHEN 'April' THEN 4
        WHEN 'May' THEN 5
        WHEN 'June' THEN 6
        WHEN 'July' THEN 7
        WHEN 'August' THEN 8
        WHEN 'September' THEN 9
        WHEN 'October' THEN 10
        WHEN 'November' THEN 11
        WHEN 'December' THEN 12
      END DESC
    LIMIT 1
    `,
    [Number(roomNo)]
  )


  // ==================================================
  // UPDATE ROOM DETAILS
  // ==================================================

  if (remaining.values?.length > 0) {

    const latestMrd = remaining.values[0]

    await db.run(
      `
      UPDATE room_details
      SET
        lastMeterReading = ?,
        arrearBill = ?
      WHERE room_no = ?
      `,
      [
        Number(latestMrd.currentReading) || 0,
        Number(latestMrd.arrearBill) || 0,
        Number(roomNo)
      ]
    )

  } else {

    // ==================================================
    // NO MRD REMAINING
    // ==================================================
    //
    // There is no remaining MRD from which we can
    // determine the previous meter/arrear values.
    //
    // For now, reset these values to 0.
    //

    await db.run(
      `
      UPDATE room_details
      SET
        lastMeterReading = 0,
        arrearBill = 0
      WHERE room_no = ?
      `,
      [
        Number(roomNo)
      ]
    )
  }


  // ==================================================
  // RETURN SUCCESS
  // ==================================================

  return {
    message: `Monthly rent for Room ${roomNo}, ${month} ${year} deleted successfully.`
  }
}