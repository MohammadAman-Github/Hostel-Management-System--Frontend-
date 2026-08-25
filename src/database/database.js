import { Capacitor } from '@capacitor/core'
import {
  CapacitorSQLite,
  SQLiteConnection
} from '@capacitor-community/sqlite'

const sqlite = new SQLiteConnection(CapacitorSQLite)

let db = null

const DB_NAME = 'hostelhub'

export const initDatabase = async () => {

  if (Capacitor.getPlatform() === 'web') {

    console.log('SQLite is not running on web')

    return
  }

  try {

    console.log('INITIALIZING SQLITE DATABASE')

    /*
     * Create connection
     */
    db = await sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      1,
      false
    )

    console.log('SQLite connection created')

    /*
     * IMPORTANT:
     * Open database BEFORE doing anything with it.
     */
    console.log('OPENING DATABASE...')

    await db.open()

    console.log('DATABASE OPENED SUCCESSFULLY')

    /*
     * Create Room table
     */
    console.log('BEFORE ROOM TABLE CREATE')

    const result = await db.execute(`
      CREATE TABLE IF NOT EXISTS room_details (
        room_no INTEGER PRIMARY KEY,
        room_type TEXT,
        floor INTEGER,
        beds INTEGER,
        tables INTEGER,
        chairs INTEGER,
        coolers TEXT,
        monthly_rent INTEGER,
        light_bill TEXT,
        lastMeterReading INTEGER,
        arrearBill INTEGER,
        security_amount INTEGER,
        security_amount_status TEXT,
        occupancy_status TEXT
      );
    `)

    console.log('AFTER ROOM TABLE CREATE')

console.log(
  'ROOM TABLE RESULT:',
  JSON.stringify(result)
)


/*
 * Create Students table
 */
console.log('BEFORE STUDENTS TABLE CREATE')

await db.execute(`
  CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    aadhar_no TEXT NOT NULL,
    father_name TEXT NOT NULL,
    father_contact TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    room_no INTEGER,
    joining_date TEXT NOT NULL,
    leaving_date TEXT,
    status TEXT NOT NULL
  );
`)

console.log('AFTER STUDENTS TABLE CREATE')

console.log('STUDENTS TABLE CREATED')

/*
 * Create Monthly Rent Details table
 */

console.log('BEFORE MONTHLY RENT TABLE CREATE')

await db.execute(`
  CREATE TABLE IF NOT EXISTS monthly_rent_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    month TEXT NOT NULL,
    year TEXT NOT NULL,
    room_no INTEGER NOT NULL,

    rent INTEGER NOT NULL,
    last_reading INTEGER NOT NULL,
    current_reading INTEGER NOT NULL,

    total_light_bill INTEGER NOT NULL,
    arrear_bill INTEGER NOT NULL DEFAULT 0,

    total_rent INTEGER NOT NULL,
    total_rent_paid INTEGER DEFAULT 0,

    payment_status TEXT NOT NULL,

    UNIQUE(month, year, room_no),

    FOREIGN KEY (room_no)
      REFERENCES room_details(room_no)
);
`)

console.log('AFTER MONTHLY RENT TABLE CREATE')

console.log('MONTHLY RENT DETAILS TABLE CREATED')

console.log('SQLITE DATABASE INITIALIZATION COMPLETE')

  } catch (error) {

    console.error(
      'DATABASE INITIALIZATION ERROR:',
      error
    )

    db = null

    throw error
  }
}


export const getDatabase = () => {

  if (!db) {

    throw new Error(
      'SQLite database has not been initialized'
    )
  }

  return db
}
