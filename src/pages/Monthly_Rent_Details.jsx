import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'

import { useAndroidBack } from '../context/useAndroidBack'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import MonthlyRentViewModal from '../components/MonthlyRentViewModal'

import {
  getMonthlyRentByMonthAndYear,
  getMonthlyRentByRoomNoAndYear,
  getMonthlyRentByMonthYearAndRoomNo,
  createMonthlyRentData,
  updateMonthlyRentData,
  deleteMonthlyRentData
} from '../services/monthlyRentService'

import {
  getStudents
} from '../services/studentService'

// Use the existing roomService function that returns all rooms.
import {
  getRooms
} from '../services/roomService'

import paymentQr from '../assets/payment-qr.png'


const Monthly_Rent_Details = () => {

  const navigate = useNavigate()

  const {
    registerBackHandler
  } = useAndroidBack()


  // =========================
  // Search
  // =========================

  const [searchType, setSearchType] =
    useState('month-year')

  const [rentDetails, setRentDetails] =
    useState([])

  const [month, setMonth] =
    useState('')

  const [year, setYear] =
    useState('')

  const [roomNo, setRoomNo] =
    useState('')


  // =========================
  // Rooms + Students
  // =========================

  const [rooms, setRooms] =
    useState([])

  const [students, setStudents] =
    useState([])


  // =========================
  // Messages
  // =========================

  const [errorMessage, setErrorMessage] =
    useState('')

  const [mrdError, setMrdError] =
    useState('')

  const [mrdErrorTitle, setMrdErrorTitle] =
    useState('')

  const [successMessage, setSuccessMessage] =
    useState('')

  const [successTitle, setSuccessTitle] =
    useState('')


  // =========================
  // Delete MRD
  // =========================

  const [deletingRent, setDeletingRent] =
    useState(null)

  const [showDeleteForm, setShowDeleteForm] =
    useState(false)


  // =========================
  // Create MRD
  // =========================

  const [useCustomRent, setUseCustomRent] =
    useState(false)

  const [customRent, setCustomRent] =
    useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)

  const [createMonth, setCreateMonth] =
    useState('')

  const [createYear, setCreateYear] =
    useState('')

  const [createRoomNo, setCreateRoomNo] =
    useState('')

  const [createCurrentReading, setCreateCurrentReading] =
    useState('')

  const [createPaymentStatus, setCreatePaymentStatus] =
    useState('Pending')


  // =========================
  // View MRD
  // =========================

  const [viewRent, setViewRent] =
    useState(null)


  // =========================
  // Edit MRD
  // =========================

  const [editingRent, setEditingRent] =
    useState(null)

  const [editArrearBill, setEditArrearBill] =
    useState('')

  const [editPaymentStatus, setEditPaymentStatus] =
    useState('Pending')


  // ==================================================
  // RENT SHARING
  // ==================================================

  const [rentToShare, setRentToShare] =
    useState(null)

  const [showShareRentPopup, setShowShareRentPopup] =
    useState(false)

  const [showStudentSelectionPopup, setShowStudentSelectionPopup] =
    useState(false)

  const [shareStudents, setShareStudents] =
    useState([])

  const [shareError, setShareError] =
    useState('')


  // =========================
  // Current Year
  // =========================

  const currentYear =
    new Date().getFullYear()


  // ==================================================
  // CURRENT MONTH RENT
  // ==================================================

  useEffect(() => {

    const currentDate =
      new Date()

    const currentMonth =
      currentDate.toLocaleString(
        'en-US',
        {
          month: 'long'
        }
      )

    const currentYear =
      currentDate.getFullYear()


    getMonthlyRentByMonthAndYear(
      currentMonth,
      currentYear
    )
      .then((data) => {

        setRentDetails(
          data || []
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching current month rent details:',
          error
        )

        setRentDetails([])


        if (
          error.response &&
          error.response.data
        ) {

          setErrorMessage(
            error.response.data
          )

        } else {

          setErrorMessage(
            'Unable to fetch monthly rent details.'
          )

        }

      })

  }, [])


  // ==================================================
  // GET ROOMS + STUDENTS
  // ==================================================

  useEffect(() => {

    getRooms()
      .then((result) => {

        console.log(
          'All rooms:',
          result
        )

        setRooms(
          result || []
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching rooms:',
          error
        )

      })


    getStudents()
      .then((result) => {

        console.log(
          'All students:',
          result
        )

        setStudents(
          result || []
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching students:',
          error
        )

      })

  }, [])


  // ==================================================
  // OCCUPIED ROOMS
  // ==================================================

  const occupiedRooms =
    rooms.filter(
      (room) =>
        students.some(
          (student) =>
            Number(student.roomNo) ===
            Number(room.roomNo)
        )
    )


  // ==================================================
  // ANDROID BACK HANDLER
  // ==================================================

  useEffect(() => {

    registerBackHandler(() => {

      // Student selection popup
      if (
        showStudentSelectionPopup
      ) {

        setShowStudentSelectionPopup(
          false
        )

        setShareStudents([])

        setShareError('')

        return true

      }


      // Share popup
      if (
        showShareRentPopup
      ) {

        setShowShareRentPopup(
          false
        )

        setRentToShare(null)

        setShareError('')

        return true

      }


      // View popup
      if (viewRent) {

        setViewRent(null)

        return true

      }


      // Let App.jsx handle page navigation
      return false

    })

  }, [
    viewRent,
    showShareRentPopup,
    showStudentSelectionPopup,
    registerBackHandler
  ])


  // ==================================================
  // RESET CREATE MRD FORM
  // ==================================================

  const resetCreateMRDForm = () => {

    setCreateMonth('')
    setCreateYear('')
    setCreateRoomNo('')
    setCreateCurrentReading('')
    setCreatePaymentStatus('Pending')

    setUseCustomRent(false)
    setCustomRent('')

  }


  // ==================================================
  // FORMAT AMOUNT
  // ==================================================

  const formatAmount = (
    amount
  ) => {

    return Number(
      amount ?? 0
    ).toLocaleString(
      'en-IN'
    )

  }


  // ==================================================
  // GET ACTIVE STUDENTS FOR ROOM
  // ==================================================

  const getActiveStudentsForRoom = (
    selectedRoomNo
  ) => {

    return students.filter(
      (student) =>

        Number(student.roomNo) ===
          Number(selectedRoomNo) &&

        String(
          student.status || 'ACTIVE'
        ).toUpperCase() ===
          'ACTIVE'
    )

  }


  // ==================================================
  // CREATE RENT SHARE MESSAGE
  // ==================================================

  const createRentShareMessage = (
    rent
  ) => {

    let message =
`🏠 Hostel Rent Details

Room No: ${rent.roomNo}
Month: ${rent.month} ${rent.year}

💰 Rent Details
Monthly Rent: ₹${formatAmount(rent.rent)}
Arrear Bill: ₹${formatAmount(rent.arrearBill)}
Light Bill: ₹${formatAmount(rent.totalLightBill)}
Total Rent: ₹${formatAmount(rent.totalRent)}`


    const hasMeterReading =
      rent.lastReading !== null &&
      rent.lastReading !== undefined &&
      rent.lastReading !== '' &&
      rent.currentReading !== null &&
      rent.currentReading !== undefined &&
      rent.currentReading !== ''


    if (hasMeterReading) {

      const unitsConsumed =
        Number(rent.currentReading) -
        Number(rent.lastReading)


      message +=
`

📊 Meter Reading
Last Reading: ${rent.lastReading}
Current Reading: ${rent.currentReading}
Units Consumed: ${unitsConsumed}`

    }


    return message

  }


  // ==================================================
  // COPY TEXT TO CLIPBOARD
  // ==================================================

  const copyToClipboard = async (text) => {

    if (!text) {
      return false
    }

    // Modern Clipboard API
    try {

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {

        await navigator.clipboard.writeText(
          text
        )

        return true

      }

    }
    catch (error) {

      console.warn(
        'Navigator clipboard failed:',
        error
      )

    }


    // Android WebView / older browser fallback
    try {

      const textarea =
        document.createElement('textarea')

      textarea.value = text

      textarea.setAttribute(
        'readonly',
        ''
      )

      textarea.style.position =
        'fixed'

      textarea.style.left =
        '-9999px'

      textarea.style.top =
        '0'

      document.body.appendChild(
        textarea
      )

      textarea.focus()

      textarea.select()

      textarea.setSelectionRange(
        0,
        textarea.value.length
      )

      const copied =
        document.execCommand(
          'copy'
        )

      document.body.removeChild(
        textarea
      )

      return copied

    }
    catch (error) {

      console.warn(
        'Clipboard fallback failed:',
        error
      )

      return false

    }

  }


  // ==================================================
  // NORMALIZE WHATSAPP NUMBER
  // ==================================================

  const normalizeWhatsAppNumber = (
    value
  ) => {

    let number =
      String(
        value || ''
      ).replace(
        /\D/g,
        ''
      )


    // Indian number entered as 10 digits
    if (
      number.length === 10
    ) {

      return `91${number}`

    }


    // Indian number entered as 0XXXXXXXXXX
    if (
      number.length === 11 &&
      number.startsWith('0')
    ) {

      return `91${number.substring(1)}`

    }


    // Already contains country code
    return number

  }


  // ==================================================
  // OPEN WHATSAPP FOR SELECTED STUDENT
  // ==================================================

  const openWhatsAppForStudent = async (
    student,
    rent
  ) => {

    const rawNumber =
      String(
        student?.whatsappNo || ''
      ).trim()


    if (!rawNumber) {

      setShareError(
        `${student?.studentName || 'This student'} does not have a WhatsApp number.`
      )

      return

    }


    const phone =
      normalizeWhatsAppNumber(
        rawNumber
      )


    if (
      !phone ||
      phone.length < 10
    ) {

      setShareError(
        `Invalid WhatsApp number for ${student?.studentName || 'this student'}.`
      )

      return

    }


    const message =
      createRentShareMessage(
        rent
      )


    const encodedMessage =
      encodeURIComponent(
        message
      )


    /*
     * IMPORTANT:
     * The number is copied BEFORE opening WhatsApp.
     * This is useful when the user wants to paste
     * the number manually in WhatsApp search.
     */
    await copyToClipboard(
      rawNumber
    )


    /*
     * whatsapp://send?phone=... directly opens
     * the selected WhatsApp contact and pre-fills
     * the rent message.
     */
    const whatsappUrl =
      Capacitor.getPlatform() === 'android'
        ? `whatsapp://send?phone=${phone}&text=${encodedMessage}`
        : `https://wa.me/${phone}?text=${encodedMessage}`


    // Close all sharing popups
    setShowStudentSelectionPopup(
      false
    )

    setShowShareRentPopup(
      false
    )

    setShareStudents([])

    setShareError('')

    setRentToShare(null)


    /*
     * Give the clipboard operation a moment to
     * complete before handing control to WhatsApp.
     */
    setTimeout(() => {

      window.location.href =
        whatsappUrl

    }, 150)

  }


  // ==================================================
  // WHATSAPP SHARE
  // ==================================================

  const handleWhatsAppShare = () => {

    if (!rentToShare) {
      return
    }


    setShareError('')


    const activeStudents =
      getActiveStudentsForRoom(
        rentToShare.roomNo
      )


    // =========================
    // No Active Student
    // =========================

    if (
      activeStudents.length === 0
    ) {

      setShareError(
        `No active student found in Room ${rentToShare.roomNo}.`
      )

      return

    }


    // ==================================================
    // ONE ACTIVE STUDENT
    // ==================================================

    /*
     * If only one active student is in the room,
     * directly use that student's WhatsApp number.
     */
    if (
      activeStudents.length === 1
    ) {

      const student =
        activeStudents[0]


      if (
        !String(
          student.whatsappNo || ''
        ).trim()
      ) {

        setShareError(
          `${student.studentName} does not have a WhatsApp number.`
        )

        return

      }


      openWhatsAppForStudent(
        student,
        rentToShare
      )

      return

    }


    // ==================================================
    // TWO OR MORE ACTIVE STUDENTS
    // ==================================================

    /*
     * If there are multiple active students,
     * ALWAYS ask the user to select the student.
     *
     * We intentionally show all active students here.
     * If the selected student has no WhatsApp number,
     * we show a clear error instead of silently using
     * their contact number.
     */
    setShareStudents(
      activeStudents
    )

    setShowShareRentPopup(
      false
    )

    setShareError('')

    setShowStudentSelectionPopup(
      true
    )

  }


  // ==================================================
  // BLOB TO BASE64
  // ==================================================

  const blobToBase64 = (
    blob
  ) => {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader()


        reader.onloadend = () => {

          try {

            const base64 =
              reader.result.split(',')[1]

            resolve(base64)

          }
          catch (error) {

            reject(error)

          }

        }


        reader.onerror =
          reject


        reader.readAsDataURL(
          blob
        )

      }
    )

  }


  // ==================================================
  // OTHER APPS SHARE
  // ==================================================

  const handleOtherAppsShare =
    async () => {

      if (!rentToShare) {
        return
      }


      const message =
        createRentShareMessage(
          rentToShare
        )


      try {

        // =========================
        // ANDROID
        // =========================

        if (
          Capacitor.getPlatform() ===
          'android'
        ) {

          const response =
            await fetch(
              paymentQr
            )


          if (!response.ok) {

            throw new Error(
              'Unable to load payment QR.'
            )

          }


          const blob =
            await response.blob()


          const base64 =
            await blobToBase64(
              blob
            )


          const fileName =
            `HMS_Payment_QR_${Date.now()}.png`


          await Filesystem.writeFile({

            path:
              fileName,

            data:
              base64,

            directory:
              Directory.Cache

          })


          const fileUri =
            await Filesystem.getUri({

              path:
                fileName,

              directory:
                Directory.Cache

            })


          setShowShareRentPopup(
            false
          )


          await Share.share({

            title:
              'Hostel Rent Details',

            text:
              message,

            files: [
              fileUri.uri
            ],

            dialogTitle:
              'Share Rent Details'

          })


          setRentToShare(
            null
          )

          return

        }


        // =========================
        // BROWSER
        // =========================

        const response =
          await fetch(
            paymentQr
          )


        const blob =
          await response.blob()


        const file =
          new File(
            [blob],
            'HMS_Payment_QR.png',
            {
              type:
                blob.type ||
                'image/png'
            }
          )


        if (
          navigator.share &&
          (
            !navigator.canShare ||
            navigator.canShare({
              files: [file]
            })
          )
        ) {

          setShowShareRentPopup(
            false
          )


          await navigator.share({

            title:
              'Hostel Rent Details',

            text:
              message,

            files: [
              file
            ]

          })


          setRentToShare(
            null
          )

          return

        }


        // Browser fallback
        await Share.share({

          title:
            'Hostel Rent Details',

          text:
            message,

          url:
            paymentQr

        })


        setShowShareRentPopup(
          false
        )

        setRentToShare(
          null
        )

      }
      catch (error) {

        console.error(
          'Error sharing rent details:',
          error
        )


        setShowShareRentPopup(
          false
        )

        setShareError(
          'Unable to share rent details.'
        )

      }

    }


  // ==================================================
  // CREATE MONTHLY RENT
  // ==================================================

  const handleCreateMRD = () => {

    // =========================
    // Required Field Check
    // =========================

    if (
      !createMonth ||
      !createYear ||
      !createRoomNo ||
      createCurrentReading === ''
    ) {

      setMrdError(
        'Please fill all required fields'
      )

      return

    }


    // =========================
    // MRD Data
    // =========================

    const mrdData = {

      month:
        createMonth,

      year:
        createYear,

      roomNo:
        Number(createRoomNo),

      currentReading:
        Number(createCurrentReading),

      paymentStatus:
        createPaymentStatus

    }


    // =========================
    // Custom Rent
    // =========================

    if (useCustomRent) {

      if (
        customRent === ''
      ) {

        setMrdError(
          'Please enter custom rent'
        )

        return

      }


      if (
        Number(customRent) < 0
      ) {

        setMrdError(
          'Custom rent cannot be negative'
        )

        return

      }


      mrdData.rent =
        Number(customRent)

    }


    // =========================
    // Current Reading Validation
    // =========================

    if (
      Number(createCurrentReading) < 0
    ) {

      setMrdError(
        'Current reading cannot be negative'
      )

      return

    }


    console.log(
      'Creating MRD:',
      mrdData
    )


    // =========================
    // Create MRD
    // =========================

    createMonthlyRentData(
      mrdData
    )

      .then((result) => {

        console.log(
          'Monthly rent created:',
          result
        )


        // ==================================================
        // STORE CREATED RENT IMMEDIATELY FOR SHARING
        // ==================================================

        /*
         * Set this immediately so that the Share Rent Details
         * popup is ready when the user clicks OK on the success
         * popup. Sharing must never affect rent creation.
         */
        setRentToShare(
          result ||
          mrdData
        )


        // ==================================================
        // GET COMPLETE CREATED RENT
        // ==================================================

        getMonthlyRentByMonthYearAndRoomNo(
          createMonth,
          createYear,
          createRoomNo
        )
          .then((createdRent) => {

            if (createdRent) {

              setRentToShare(
                createdRent
              )

            }

          })
          .catch((error) => {

            console.error(
              'Error fetching created rent for sharing:',
              error
            )

            // Keep the already stored rent data.
            // Creation was successful and sharing must
            // never affect creation.

          })


        // =========================
        // Success Message
        // =========================

        setSuccessTitle(
          'Monthly Rent Created Successfully'
        )

        setSuccessMessage(
          'Monthly rent has been created successfully.'
        )


        // =========================
        // Refresh Monthly Rent
        // =========================

        getMonthlyRentByMonthAndYear(
          createMonth,
          createYear
        )
          .then((result) => {

            setRentDetails(
              result || []
            )

          })
          .catch((error) => {

            console.error(
              'Error refreshing monthly rent details:',
              error
            )

          })


        // =========================
        // Reset Form
        // =========================

        resetCreateMRDForm()

        setShowCreateForm(
          false
        )

      })


      .catch((error) => {

        console.error(
          'Error creating monthly rent:',
          error
        )


        if (
          error.response &&
          error.response.data
        ) {

          setMrdError(
            error.response.data
          )

        } else {

          setMrdError(
            'Unable to create monthly rent'
          )

        }

      })

  }


  // ==================================================
  // SEARCH MRD
  // ==================================================

  const handleSearch = () => {

    setErrorMessage('')
    setMrdError('')
    setMrdErrorTitle('')


    // ==================================================
    // MONTH + YEAR
    // ==================================================

    if (
      searchType === 'month-year'
    ) {

      if (
        !month &&
        !year
      ) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select month and year'
        )

        return

      }


      if (!month) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select month'
        )

        return

      }


      if (!year) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select year'
        )

        return

      }


      getMonthlyRentByMonthAndYear(
        month,
        year
      )
        .then((result) => {

          setRentDetails(
            result || []
          )


          if (
            !result ||
            result.length === 0
          ) {

            setMrdErrorTitle(
              'Monthly rent details not found in database'
            )

            setMrdError(
              `Data for --> ${month} - ${year} Not Found`
            )

          } else {

            setMrdError('')
            setMrdErrorTitle('')

          }

        })
        .catch((error) => {

          console.error(
            'Error fetching monthly rent details:',
            error
          )

          setRentDetails([])

          setMrdErrorTitle(
            'Monthly rent details not found in database'
          )


          if (
            error.response &&
            error.response.data
          ) {

            setMrdError(
              error.response.data
            )

          } else {

            setMrdError(
              'Monthly rent details not found in database.'
            )

          }

        })

    }


    // ==================================================
    // ROOM + YEAR
    // ==================================================

    if (
      searchType === 'room-year'
    ) {

      if (
        !roomNo &&
        !year
      ) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select room and year'
        )

        return

      }


      if (!roomNo) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select room'
        )

        return

      }


      if (!year) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select year'
        )

        return

      }


      getMonthlyRentByRoomNoAndYear(
        roomNo,
        year
      )
        .then((result) => {

          setRentDetails(
            result || []
          )


          if (
            !result ||
            result.length === 0
          ) {

            setMrdErrorTitle(
              'Monthly rent details not found in database'
            )

            setMrdError(
              `Data for --> Room ${roomNo} - ${year} Not Found`
            )

          } else {

            setMrdError('')
            setMrdErrorTitle('')

          }

        })
        .catch((error) => {

          console.error(
            'Error fetching room rent details:',
            error
          )

          setRentDetails([])

          setMrdErrorTitle(
            'Monthly rent details not found in database'
          )


          if (
            error.response &&
            error.response.data
          ) {

            setMrdError(
              error.response.data
            )

          } else {

            setMrdError(
              'Monthly rent details not found in database.'
            )

          }

        })

    }


    // ==================================================
    // MONTH + YEAR + ROOM
    // ==================================================

    if (
      searchType === 'month-year-room'
    ) {

      if (
        !month &&
        !year &&
        !roomNo
      ) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select month, year and room'
        )

        return

      }


      if (!month) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select month'
        )

        return

      }


      if (!roomNo) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select room'
        )

        return

      }


      if (!year) {

        setMrdErrorTitle(
          'Search Required'
        )

        setMrdError(
          'Please select year'
        )

        return

      }


      getMonthlyRentByMonthYearAndRoomNo(
        month,
        year,
        roomNo
      )
        .then((result) => {

          setRentDetails(
            result
              ? [result]
              : []
          )


          if (!result) {

            setMrdErrorTitle(
              'Monthly rent details not found in database'
            )

            setMrdError(
              `Data for --> ${month} - Room ${roomNo} - ${year} Not Found`
            )

          } else {

            setMrdError('')
            setMrdErrorTitle('')

          }

        })
        .catch((error) => {

          console.error(
            'Error fetching room monthly rent:',
            error
          )

          setRentDetails([])

          setMrdErrorTitle(
            'Monthly rent details not found in database'
          )


          if (
            error.response &&
            error.response.data
          ) {

            setMrdError(
              error.response.data
            )

          } else {

            setMrdError(
              'Monthly rent details not found in database.'
            )

          }

        })

    }

  }


  // ==================================================
  // UPDATE MRD
  // ==================================================

  const handleUpdateMRD = () => {

    if (!editingRent) {
      return
    }


    const updateData = {

      arrearBill:
        Number(editArrearBill),

      paymentStatus:
        editPaymentStatus

    }


    updateMonthlyRentData(
      editingRent.month,
      editingRent.year,
      editingRent.roomNo,
      updateData
    )
      .then((updatedRent) => {

        console.log(
          'MRD updated:',
          updatedRent
        )


        // =========================
        // Update Existing Row
        // =========================

        setRentDetails(
          (prevRentDetails) =>
            prevRentDetails.map(
              (rent) =>
                rent.month ===
                  updatedRent.month &&
                rent.year ===
                  updatedRent.year &&
                rent.roomNo ===
                  updatedRent.roomNo
                  ? updatedRent
                  : rent
            )
        )


        // =========================
        // Close Edit Popup
        // =========================

        setEditingRent(null)


        setSuccessTitle(
          'Monthly Rent Updated Successfully'
        )

        setSuccessMessage(
          'Monthly rent has been updated successfully'
        )


        setTimeout(() => {

          setSuccessMessage('')

        }, 3000)

      })
      .catch((error) => {

        console.error(
          'Error updating monthly rent details:',
          error
        )

      })

  }


  // ==================================================
  // DELETE MRD
  // ==================================================

  const handleDeleteMRD = () => {

    if (!deletingRent) {
      return
    }


    deleteMonthlyRentData(
      deletingRent.month,
      deletingRent.year,
      deletingRent.roomNo
    )
      .then(() => {

        setRentDetails(
          (prevRentDetails) =>
            prevRentDetails.filter(
              (rent) =>
                !(
                  rent.month ===
                    deletingRent.month &&
                  String(rent.year) ===
                    String(deletingRent.year) &&
                  Number(rent.roomNo) ===
                    Number(deletingRent.roomNo)
                )
            )
        )


        setDeletingRent(null)
        setShowDeleteForm(false)


        setSuccessTitle(
          'Monthly Rent Deleted Successfully'
        )

        setSuccessMessage(
          'Monthly rent has deleted successfully.'
        )


        setTimeout(() => {

          setSuccessMessage('')

        }, 3000)

      })
      .catch((error) => {

        console.error(
          'Error deleting monthly rent:',
          error
        )


        setDeletingRent(null)
        setShowDeleteForm(false)


        if (
          error.response &&
          error.response.data
        ) {

          setMrdError(
            error.response.data
          )

        } else {

          setMrdError(
            'Unable to delete monthly rent.'
          )

        }

      })

  }


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="monthly-rent-page">


      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="monthly-rent-header">

        <div>

          <h1>
            Monthly Rent
          </h1>

          <p>
            Monthly Rent Details
          </p>

        </div>

      </div>


      {/* ==================================================
          SUCCESS MESSAGE
          ================================================== */}

      {successMessage && (

        <div className="monthly-rent-success">

          ✓ {successMessage}

        </div>

      )}


      {/* ==================================================
          CREATE / DELETE MONTHLY RENT
          ================================================== */}

      <div className="monthly-rent-create-section">


        {/* CREATE */}

        <button
          className="create-rent-btn"
          onClick={() => {

            resetCreateMRDForm()

            setMrdError('')

            setMrdErrorTitle('')

            setShowCreateForm(true)

          }}
        >

          <span className="create-rent-icon">
            +
          </span>

          Create Monthly Rent

        </button>


        {/* DELETE */}

        <button
          className="delete-rent-btn"
          onClick={() => {

            if (
              !rentDetails ||
              rentDetails.length === 0
            ) {

              setMrdError(
                'There is no monthly rent available to delete.'
              )

              return

            }


            setDeletingRent(null)

            setShowDeleteForm(true)

          }}
        >

          <span className="delete-rent-icon">
            🗑
          </span>

          Delete Monthly Rent

        </button>

      </div>


      {/* ==================================================
          SEARCH
          ================================================== */}

      <div className="monthly-rent-search">


        {/* SEARCH TYPE */}

        <select
          value={searchType}
          onChange={(e) => {

            setSearchType(
              e.target.value
            )

            setMonth('')
            setYear('')
            setRoomNo('')
            setRentDetails([])
            setErrorMessage('')

          }}
        >

          <option value="month-year">
            Month + Year
          </option>

          <option value="room-year">
            Room + Year
          </option>

          <option value="month-year-room">
            Month + Year + Room
          </option>

        </select>


        {/* MONTH */}

        {(
          searchType === 'month-year' ||
          searchType === 'month-year-room'
        ) && (

          <select
            value={month}
            onChange={(e) =>
              setMonth(
                e.target.value
              )
            }
          >

            <option value="">
              Select Month
            </option>

            <option value="January">
              January
            </option>

            <option value="February">
              February
            </option>

            <option value="March">
              March
            </option>

            <option value="April">
              April
            </option>

            <option value="May">
              May
            </option>

            <option value="June">
              June
            </option>

            <option value="July">
              July
            </option>

            <option value="August">
              August
            </option>

            <option value="September">
              September
            </option>

            <option value="October">
              October
            </option>

            <option value="November">
              November
            </option>

            <option value="December">
              December
            </option>

          </select>

        )}


        {/* ROOM */}

        {(
          searchType === 'room-year' ||
          searchType === 'month-year-room'
        ) && (

          <select
            value={roomNo}
            onChange={(e) =>
              setRoomNo(
                e.target.value
              )
            }
          >

            <option value="">
              Select Room
            </option>

            {rooms.map(
              (room) => (

                <option
                  key={room.roomNo}
                  value={room.roomNo}
                >

                  Room {room.roomNo}

                </option>

              )
            )}

          </select>

        )}


        {/* YEAR */}

        <select
          value={year}
          onChange={(e) =>
            setYear(
              e.target.value
            )
          }
        >

          <option value="">
            Select Year
          </option>

          {Array.from(
            { length: 66 },
            (_, index) => {

              const yearValue =
                currentYear -
                5 +
                index


              return (

                <option
                  key={yearValue}
                  value={yearValue}
                >

                  {yearValue}

                </option>

              )

            }
          )}

        </select>


        {/* SEARCH */}

        <button
          onClick={
            handleSearch
          }
        >
          Search
        </button>

      </div>


      {/* ==================================================
          PAYMENT STATUS TABS
          ================================================== */}

      <div className="monthly-rent-status-tabs">


        {/* PAID */}

        <button
          className="monthly-rent-status-tab paid"
          onClick={() =>
            navigate(
              '/monthly-rent/paid'
            )
          }
        >

          <span className="monthly-rent-status-icon">
            ✓
          </span>

          <span className="monthly-rent-status-title">
            Paid
          </span>

          <span className="monthly-rent-status-count">

            {
              rentDetails.filter(
                (rent) =>
                  (
                    rent.paymentStatus ||
                    'Pending'
                  ) ===
                  'Paid'
              ).length
            }

          </span>

        </button>


        {/* PARTIALLY PAID */}

        <button
          className="monthly-rent-status-tab partially-paid"
          onClick={() =>
            navigate(
              '/monthly-rent/partially-paid'
            )
          }
        >

          <span className="monthly-rent-status-icon">
            ◷
          </span>

          <span className="monthly-rent-status-title">
            Partially Paid
          </span>

          <span className="monthly-rent-status-count">

            {
              rentDetails.filter(
                (rent) =>
                  (
                    rent.paymentStatus ||
                    'Pending'
                  ) ===
                  'Partially Paid'
              ).length
            }

          </span>

        </button>


        {/* PENDING */}

        <button
          className="monthly-rent-status-tab pending"
          onClick={() =>
            navigate(
              '/monthly-rent/pending'
            )
          }
        >

          <span className="monthly-rent-status-icon">
            !
          </span>

          <span className="monthly-rent-status-title">
            Pending
          </span>

          <span className="monthly-rent-status-count">

            {
              rentDetails.filter(
                (rent) =>
                  (
                    rent.paymentStatus ||
                    'Pending'
                  ) ===
                  'Pending'
              ).length
            }

          </span>

        </button>


        {/* TOTAL PAID AMOUNT */}

        <div className="monthly-rent-amount-card">

          <span className="monthly-rent-amount-icon">
            💳
          </span>

          <span className="monthly-rent-amount-title">
            Total Paid Amount
          </span>

          <span className="monthly-rent-amount-value">

            ₹
            {
              rentDetails.reduce(
                (total, rent) =>
                  total +
                  Number(
                    rent.totalRentPaid ?? 0
                  ),
                0
              )
            }

          </span>

        </div>


        {/* TOTAL PENDING AMOUNT */}

        <div className="monthly-rent-amount-card">

          <span className="monthly-rent-amount-icon">
            🕐
          </span>

          <span className="monthly-rent-amount-title">
            Total Pending Amount
          </span>

          <span className="monthly-rent-amount-value">

            ₹
            {
              rentDetails.reduce(
                (total, rent) => {

                  const totalRent =
                    Number(
                      rent.totalRent ?? 0
                    )


                  const totalRentPaid =
                    Number(
                      rent.totalRentPaid ?? 0
                    )


                  const pending =
                    Math.max(
                      totalRent -
                      totalRentPaid,
                      0
                    )


                  return (
                    total +
                    pending
                  )

                },
                0
              )
            }

          </span>

        </div>

      </div>


      {/* ==================================================
          CREATE MONTHLY RENT POPUP
          ================================================== */}

      {showCreateForm && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Create Monthly Rent
                </h2>

                <p className="monthly-rent-modal-subtitle">
                  Generate bill for a new month
                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="monthly-rent-info-list">


              {/* MONTH */}

              <div className="monthly-rent-info-row">

                <label>
                  Month
                </label>

                <select
                  value={
                    createMonth
                  }
                  onChange={(e) =>
                    setCreateMonth(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Month
                  </option>

                  <option value="January">
                    January
                  </option>

                  <option value="February">
                    February
                  </option>

                  <option value="March">
                    March
                  </option>

                  <option value="April">
                    April
                  </option>

                  <option value="May">
                    May
                  </option>

                  <option value="June">
                    June
                  </option>

                  <option value="July">
                    July
                  </option>

                  <option value="August">
                    August
                  </option>

                  <option value="September">
                    September
                  </option>

                  <option value="October">
                    October
                  </option>

                  <option value="November">
                    November
                  </option>

                  <option value="December">
                    December
                  </option>

                </select>

              </div>


              {/* YEAR */}

              <div className="monthly-rent-info-row">

                <label>
                  Year
                </label>

                <select
                  value={
                    createYear
                  }
                  onChange={(e) =>
                    setCreateYear(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Year
                  </option>

                  {Array.from(
                    { length: 62 },
                    (_, index) => {

                      const yearValue =
                        currentYear +
                        index -
                        1


                      return (

                        <option
                          key={yearValue}
                          value={yearValue}
                        >

                          {yearValue}

                        </option>

                      )

                    }
                  )}

                </select>

              </div>


              {/* ROOM */}

              <div className="monthly-rent-info-row">

                <label>
                  Room No
                </label>

                <select
                  value={
                    createRoomNo
                  }
                  onChange={(e) =>
                    setCreateRoomNo(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Room
                  </option>

                  {occupiedRooms.map(
                    (room) => (

                      <option
                        key={room.roomNo}
                        value={room.roomNo}
                      >

                        Room {room.roomNo}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* CURRENT READING */}

              <div className="monthly-rent-info-row">

                <label>
                  Current Reading
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    createCurrentReading
                  }
                  onChange={(e) =>
                    setCreateCurrentReading(
                      e.target.value
                    )
                  }
                  placeholder="Enter current meter reading"
                />

              </div>


              {/* PAYMENT STATUS */}

              <div className="monthly-rent-info-row">

                <label>
                  Payment Status
                </label>

                <select
                  value={
                    createPaymentStatus
                  }
                  onChange={(e) =>
                    setCreatePaymentStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partially Paid">
                    Partially Paid
                  </option>

                </select>

              </div>


              {/* CUSTOM RENT TOGGLE */}

              <div className="monthly-rent-info-row">

                <label>
                  Set Custom Rent
                </label>

                <input
                  type="checkbox"
                  checked={
                    useCustomRent
                  }
                  onChange={(e) => {

                    setUseCustomRent(
                      e.target.checked
                    )


                    if (
                      !e.target.checked
                    ) {

                      setCustomRent('')

                    }

                  }}
                />

              </div>


              {/* CUSTOM RENT */}

              {useCustomRent && (

                <div className="monthly-rent-info-row">

                  <label>
                    Custom Rent
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      customRent
                    }
                    onChange={(e) =>
                      setCustomRent(
                        e.target.value
                      )
                    }
                    placeholder="Enter special monthly rent"
                  />

                </div>

              )}

            </div>


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                Cancel
              </button>


              <button
                className="save-student-btn"
                onClick={
                  handleCreateMRD
                }
              >
                Create Bill
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          RENT TABLE
          ================================================== */}

      <div className="monthly-rent-table-container">

        <table className="monthly-rent-table">

          <thead>

            <tr>

              <th>
                Room No
              </th>

              <th>
                Month
              </th>

              <th>
                Rent
              </th>

              <th>
                Light Bill
              </th>

              <th>
                Arrear Bill
              </th>

              <th>
                Total Rent
              </th>

              <th>
                Total Rent Paid
              </th>

              <th>
                Payment Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {rentDetails.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  style={{
                    textAlign:
                      'center',
                    padding:
                      '30px'
                  }}
                >
                  No monthly rent details found.
                </td>

              </tr>

            ) : (

              rentDetails.map(
                (rent) => (

                  <tr
                    key={
                      `${rent.month}-${rent.year}-${rent.roomNo}`
                    }
                  >

                    <td>
                      {rent.roomNo}
                    </td>

                    <td>

                      {rent.month}

                      <br />

                      {rent.year}

                    </td>

                    <td>
                      ₹{rent.rent}
                    </td>

                    <td>
                      ₹{rent.totalLightBill}
                    </td>

                    <td>
                      ₹{rent.arrearBill}
                    </td>

                    <td>
                      ₹{rent.totalRent}
                    </td>

                    <td>
                      ₹{rent.totalRentPaid ?? 0}
                    </td>

                    <td>
                      {
                        rent.paymentStatus ||
                        'Pending'
                      }
                    </td>

                    <td>


                      {/* VIEW */}

                      <button
                        className="view-btn"
                        onClick={() => {

                          getMonthlyRentByMonthYearAndRoomNo(
                            rent.month,
                            rent.year,
                            rent.roomNo
                          )
                            .then(
                              (result) => {

                                setViewRent(
                                  result
                                )

                              }
                            )
                            .catch(
                              (error) => {

                                console.error(
                                  'Error fetching rent details:',
                                  error
                                )

                              }
                            )

                        }}
                      >
                        View
                      </button>


                      {/* EDIT */}

                      <button
                        className="edit-btn"
                        onClick={() => {

                          setEditingRent(
                            rent
                          )

                          setEditArrearBill(
                            rent.arrearBill ??
                            0
                          )

                          setEditPaymentStatus(
                            rent.paymentStatus ||
                            'Pending'
                          )

                        }}
                      >
                        Edit
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ==================================================
          ERROR MESSAGE
          ================================================== */}

      {errorMessage && (

        <div className="monthly-rent-error">

          {errorMessage}

        </div>

      )}


      {/* ==================================================
          VIEW MRD
          ================================================== */}

      {viewRent && (

        <MonthlyRentViewModal
          rent={
            viewRent
          }
          students={
            students
          }
          onClose={() =>
            setViewRent(null)
          }
        />

      )}


      {/* ==================================================
          EDIT MONTHLY RENT
          ================================================== */}

      {editingRent && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Edit Monthly Rent
                </h2>

                <p className="monthly-rent-modal-subtitle">

                  Room {editingRent.roomNo}

                  {' • '}

                  {editingRent.month}-
                  {editingRent.year}

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setEditingRent(null)
                }
              >
                ×
              </button>

            </div>


            {/* DETAILS */}

            <div className="monthly-rent-info-list">


              {/* MONTHLY RENT */}

              <div className="monthly-rent-info-row">

                <label>
                  Monthly Rent
                </label>

                <p>
                  ₹{editingRent.rent}
                </p>

              </div>


              {/* LIGHT BILL */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Light Bill
                </label>

                <p>
                  ₹{editingRent.totalLightBill}
                </p>

              </div>


              {/* TOTAL RENT */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Rent
                </label>

                <p>
                  ₹{editingRent.totalRent}
                </p>

              </div>


              {/* TOTAL RENT PAID */}

              <div className="monthly-rent-info-row">

                <label>
                  Total Rent Paid
                </label>

                <p>
                  ₹{editingRent.totalRentPaid}
                </p>

              </div>


              {/* ARREAR BILL */}

              <div className="monthly-rent-info-row">

                <label>
                  Arrear Bill
                </label>

                <input
                  type="number"
                  value={
                    editArrearBill
                  }
                  onChange={(e) =>
                    setEditArrearBill(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* PAYMENT STATUS */}

              <div className="monthly-rent-info-row">

                <label>
                  Payment Status
                </label>

                <select
                  value={
                    editPaymentStatus
                  }
                  onChange={(e) =>
                    setEditPaymentStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partially Paid">
                    Partially Paid
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                </select>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingRent(null)
                }
              >
                Cancel
              </button>


              <button
                className="save-student-btn"
                onClick={
                  handleUpdateMRD
                }
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          DELETE MONTHLY RENT
          ================================================== */}

      {showDeleteForm && (

        <div className="monthly-rent-modal-overlay">

          <div className="monthly-rent-modal">


            {/* HEADER */}

            <div className="monthly-rent-modal-header">

              <div>

                <h2>
                  Delete Monthly Rent
                </h2>

                <p className="monthly-rent-modal-subtitle">
                  Select the monthly rent you want to delete
                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setShowDeleteForm(false)
                }
              >
                ×
              </button>

            </div>


            {/* SELECT RENT */}

            <div className="monthly-rent-info-list">

              <div className="monthly-rent-info-row">

                <label>
                  Monthly Rent
                </label>

                <select
                  value={
                    deletingRent
                      ? `${deletingRent.month}|${deletingRent.year}|${deletingRent.roomNo}`
                      : ''
                  }
                  onChange={(e) => {

                    const [
                      selectedMonth,
                      selectedYear,
                      selectedRoomNo
                    ] =
                      e.target.value.split('|')


                    const selectedRent =
                      rentDetails.find(
                        (rent) =>
                          rent.month ===
                            selectedMonth &&
                          String(
                            rent.year
                          ) ===
                            selectedYear &&
                          String(
                            rent.roomNo
                          ) ===
                            selectedRoomNo
                      )


                    setDeletingRent(
                      selectedRent ||
                      null
                    )

                  }}
                >

                  <option value="">
                    Select Monthly Rent
                  </option>

                  {rentDetails.map(
                    (rent) => (

                      <option
                        key={
                          `${rent.month}-${rent.year}-${rent.roomNo}`
                        }
                        value={
                          `${rent.month}|${rent.year}|${rent.roomNo}`
                        }
                      >

                        Room {rent.roomNo}

                        {' - '}

                        {rent.month}-
                        {rent.year}

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="monthly-rent-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => {

                  setDeletingRent(
                    null
                  )

                  setShowDeleteForm(
                    false
                  )

                }}
              >
                Cancel
              </button>


              <button
                className="delete-confirm-btn"
                disabled={
                  !deletingRent
                }
                onClick={
                  handleDeleteMRD
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          MRD ERROR POPUP
          ================================================== */}

      {mrdError &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-confirmation">

              <h2>
                {
                  mrdErrorTitle ||
                  'Unable to Create Monthly Rent'
                }
              </h2>

              <p>
                {mrdError}
              </p>

              <div className="delete-buttons">

                <button
                  className="success-ok-btn"
                  onClick={() =>
                    setMrdError('')
                  }
                >
                  OK
                </button>

              </div>

            </div>

          </div>,

          document.body

        )
      }


      {/* ==================================================
          SUCCESS POPUP
          ================================================== */}

      {successMessage &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-success">

              <h2>
                {successTitle}
              </h2>

              <p>
                {successMessage}
              </p>

              <button
                className="success-ok-btn"
                onClick={() => {

                  setSuccessMessage('')


                  // Only creation has a rent waiting
                  // to be shared.

                  if (
                    rentToShare
                  ) {

                    setShareError('')

                    setShowShareRentPopup(
                      true
                    )

                  }

                }}
              >
                OK
              </button>

            </div>

          </div>,

          document.body

        )
      }


      {/* ==================================================
          SHARE RENT DETAILS POPUP
          ================================================== */}

      {showShareRentPopup &&
        rentToShare &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-confirmation">

              <h2>
                Share Rent Details?
              </h2>

              <p>
                Monthly rent has been created successfully.
                Would you like to share the rent details?
              </p>


              {shareError && (

                <p
                  style={{
                    color: 'red',
                    marginTop: '10px'
                  }}
                >
                  {shareError}
                </p>

              )}


              <div
                className="delete-buttons"
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent:
                    'center',
                  flexWrap: 'wrap',
                  marginTop: '15px'
                }}
              >

                <button
                  className="success-ok-btn"
                  onClick={
                    handleWhatsAppShare
                  }
                >
                  WhatsApp
                </button>


                <button
                  className="success-ok-btn"
                  onClick={
                    handleOtherAppsShare
                  }
                >
                  Other Apps
                </button>


                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowShareRentPopup(
                      false
                    )

                    setRentToShare(
                      null
                    )

                    setShareError('')

                  }}
                >
                  Don't Share
                </button>

              </div>


              <p
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '15px'
                }}
              >
                Other Apps shares the payment QR
                along with the rent details.
              </p>

            </div>

          </div>,

          document.body

        )
      }


      {/* ==================================================
          SELECT STUDENT FOR WHATSAPP
          ================================================== */}

      {showStudentSelectionPopup &&
        rentToShare &&
        createPortal(

          <div className="mrd-message-overlay">

            <div className="delete-confirmation">

              <h2>
                Select Student
              </h2>

              <p>
                Select the student whose WhatsApp
                number should receive the rent details.
              </p>


              {shareError && (

                <p
                  style={{
                    color: 'red',
                    marginTop: '10px'
                  }}
                >
                  {shareError}
                </p>

              )}


              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: '10px',
                  marginTop: '15px'
                }}
              >

                {shareStudents.map(
                  (student) => (

                    <button
                      key={
                        student.studentId ??
                        `${student.roomNo}-${student.studentName}-${student.whatsappNo}`
                      }
                      className="success-ok-btn"
                      style={{
                        width: '100%',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => {

                        setShareError('')

                        openWhatsAppForStudent(
                          student,
                          rentToShare
                        )

                      }}
                    >

                      <strong>
                        {student.studentName}
                      </strong>

                      <span
                        style={{
                          fontSize: '13px'
                        }}
                      >
                        Contact: {
                          student.contactNo ||
                          'Not Available'
                        }
                      </span>

                      <span
                        style={{
                          fontSize: '13px'
                        }}
                      >
                        WhatsApp: {
                          student.whatsappNo
                        }
                      </span>

                    </button>

                  )
                )}

              </div>


              <div
                className="delete-buttons"
                style={{
                  marginTop: '15px'
                }}
              >

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setShowStudentSelectionPopup(
                      false
                    )

                    setShareStudents(
                      []
                    )

                    setShareError('')

                    setRentToShare(
                      null
                    )

                  }}
                >
                  Don't Share
                </button>

              </div>

            </div>

          </div>,

          document.body

        )
      }

    </div>

  )

}


export default Monthly_Rent_Details