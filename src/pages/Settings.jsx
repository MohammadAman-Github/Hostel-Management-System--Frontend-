import { useState, useRef } from 'react'

import { Capacitor } from '@capacitor/core'
import {
  Filesystem,
  Directory
} from '@capacitor/filesystem'

import { Share } from '@capacitor/share'

import {
  getSavedPaymentQr,
  savePaymentQr
} from '../utils/paymentQrStorage'

import {
  decodePaymentQr
} from '../utils/paymentQrDecoder'

import paymentQr from '../assets/payment-qr.png'

import {
  exportDatabase,
  importDatabase
} from '../database/database'


const Settings = () => {

  // ==================================================
  // INITIAL PAYMENT QR
  // ==================================================

  const savedPaymentQr =
    getSavedPaymentQr()


  const [paymentQrImage, setPaymentQrImage] =
    useState(
      savedPaymentQr?.qr ||
      paymentQr
    )


  // ==================================================
  // PAYMENT DETAILS
  // ==================================================

  const [paymentQrName, setPaymentQrName] =
    useState(
      savedPaymentQr?.name ||
      ''
    )


  const [paymentQrUpiId, setPaymentQrUpiId] =
    useState(
      savedPaymentQr?.upiId ||
      ''
    )


  const [paymentQrNote, setPaymentQrNote] =
    useState(
      savedPaymentQr?.note ||
      ''
    )


  // ==================================================
  // DETECTED QR DATA
  // ==================================================

  const [detectedQrData, setDetectedQrData] =
    useState({
      name: '',
      upiId: '',
      note: ''
    })


  // ==================================================
  // STATES
  // ==================================================

  const [backupLoading, setBackupLoading] =
    useState(false)


  const [restoreLoading, setRestoreLoading] =
    useState(false)


  const [message, setMessage] =
    useState('')


  const [qrReading, setQrReading] =
    useState(false)


  // ==================================================
  // FILE INPUT REFERENCES
  // ==================================================

  const fileInputRef =
    useRef(null)


  const paymentQrInputRef =
    useRef(null)


  // ==================================================
  // BACKUP
  // ==================================================

  const handleBackup = async () => {

    try {

      setBackupLoading(true)
      setMessage('')


      console.log(
        'SETTINGS: Creating database backup...'
      )


      const backup =
        await exportDatabase()


      const jsonString =
        JSON.stringify(
          backup,
          null,
          2
        )


      // ==================================================
      // ANDROID
      // ==================================================

      if (
        Capacitor.isNativePlatform()
      ) {

        // ------------------------------------------
        // Create backup directory if required
        // ------------------------------------------

        try {

          await Filesystem.stat({

            path: 'hms',

            directory:
              Directory.Documents

          })

        } catch {

          await Filesystem.mkdir({

            path: 'hms',

            directory:
              Directory.Documents

          })

        }


        // ------------------------------------------
        // Backup file
        // ------------------------------------------

        await Filesystem.writeFile({

          path:
            'hms/HMS_Backup.json',

          data:
            jsonString,

          directory:
            Directory.Documents,

          encoding:
            'utf8'

        })


        setMessage(
          'Backup created successfully.'
        )

        return

      }


      // ==================================================
      // BROWSER
      // ==================================================

      const blob =
        new Blob(
          [jsonString],
          {
            type:
              'application/json'
          }
        )


      const url =
        URL.createObjectURL(blob)


      const link =
        document.createElement('a')


      link.href =
        url

      link.download =
        'HMS_Backup.json'


      document.body.appendChild(
        link
      )


      link.click()


      document.body.removeChild(
        link
      )


      URL.revokeObjectURL(
        url
      )


      setMessage(
        'Backup created successfully.'
      )

    } catch (error) {

      console.error(
        'SETTINGS: Backup failed:',
        error
      )


      setMessage(
        `Backup failed: ${
          error?.message ||
          'Unknown error'
        }`
      )

    } finally {

      setBackupLoading(false)

    }

  }


  // ==================================================
  // EXPORT DATA
  // ==================================================

  const handleExportBackup = async () => {

    try {

      setBackupLoading(true)
      setMessage('')


      console.log(
        'SETTINGS: Creating backup for export...'
      )


      const backup =
        await exportDatabase()


      const jsonString =
        JSON.stringify(
          backup,
          null,
          2
        )


      // ==================================================
      // ANDROID
      // ==================================================

      if (
        Capacitor.isNativePlatform()
      ) {

        const fileName =
          'HMS_Backup.json'


        await Filesystem.writeFile({

          path:
            fileName,

          data:
            jsonString,

          directory:
            Directory.Cache,

          encoding:
            'utf8'

        })


        const fileUri =
          await Filesystem.getUri({

            path:
              fileName,

            directory:
              Directory.Cache

          })


        await Share.share({

          title:
            'HMS Database Backup',

          text:
            'HMS database backup',

          url:
            fileUri.uri,

          dialogTitle:
            'Share HMS Backup'

        })


        setMessage(
          'Backup ready to share.'
        )

        return

      }


      // ==================================================
      // BROWSER
      // ==================================================

      const blob =
        new Blob(
          [jsonString],
          {
            type:
              'application/json'
          }
        )


      const url =
        URL.createObjectURL(blob)


      const link =
        document.createElement('a')


      link.href =
        url

      link.download =
        'HMS_Backup.json'


      document.body.appendChild(
        link
      )


      link.click()


      document.body.removeChild(
        link
      )


      URL.revokeObjectURL(
        url
      )


      setMessage(
        'Backup exported successfully.'
      )

    } catch (error) {

      console.error(
        'SETTINGS: Export failed:',
        error
      )


      setMessage(
        `Export failed: ${
          error?.message ||
          'Unknown error'
        }`
      )

    } finally {

      setBackupLoading(false)

    }

  }


  // ==================================================
  // RESTORE AUTOMATIC BACKUP
  // ==================================================

  const handleRestore = async () => {

    try {

      setRestoreLoading(true)
      setMessage('')


      // ==================================================
      // ANDROID
      // ==================================================

      if (
        Capacitor.isNativePlatform()
      ) {

        const backupFile =
          await Filesystem.readFile({

            path:
              'hms/HMS_Backup.json',

            directory:
              Directory.Documents,

            encoding:
              'utf8'

          })


        const backupData =
          JSON.parse(
            backupFile.data
          )


        const confirmed =
          window.confirm(
            'Restore the HMS backup?\n\n' +
            'This will replace all current HMS data.'
          )


        if (!confirmed) {

          return

        }


        console.log(
          'SETTINGS: Restoring automatic backup...'
        )


        await importDatabase(
          backupData
        )


        setMessage(
          'Database restored successfully. Please reopen the page.'
        )

        return

      }


      // ==================================================
      // BROWSER
      // ==================================================

      fileInputRef.current?.click()

    } catch (error) {

      console.error(
        'SETTINGS: Restore failed:',
        error
      )


      setMessage(
        `Restore failed: ${
          error?.message ||
          'No valid HMS backup found.'
        }`
      )

    } finally {

      setRestoreLoading(false)

    }

  }


  // ==================================================
  // IMPORT DATA
  // ==================================================

  const handleImport = () => {

    setMessage('')

    fileInputRef.current?.click()

  }


  // ==================================================
  // IMPORT FILE
  // ==================================================

  const handleImportFile = async (event) => {

    const file =
      event.target.files?.[0]


    if (!file) {

      return

    }


    try {

      setRestoreLoading(true)
      setMessage('')


      // ------------------------------------------
      // Validate file type
      // ------------------------------------------

      if (
        !file.name
          .toLowerCase()
          .endsWith('.json')
      ) {

        throw new Error(
          'Please select a valid HMS backup JSON file.'
        )

      }


      console.log(
        'SETTINGS: Importing file:',
        file.name
      )


      // ------------------------------------------
      // Read file
      // ------------------------------------------

      const text =
        await file.text()


      if (!text) {

        throw new Error(
          'Selected backup file is empty.'
        )

      }


      // ------------------------------------------
      // Parse JSON
      // ------------------------------------------

      let backupData


      try {

        backupData =
          JSON.parse(text)

      } catch {

        throw new Error(
          'The selected file is not a valid JSON backup.'
        )

      }


      // ------------------------------------------
      // Validate HMS backup
      // ------------------------------------------

      if (
        !backupData ||
        backupData.database !== 'hms' ||
        !Array.isArray(
          backupData.tables
        )
      ) {

        throw new Error(
          'This is not a valid HMS database backup.'
        )

      }


      // ------------------------------------------
      // Confirm
      // ------------------------------------------

      const confirmed =
        window.confirm(
          'Import this HMS backup?\n\n' +
          'This will replace all current HMS data.'
        )


      if (!confirmed) {

        return

      }


      // ------------------------------------------
      // Restore
      // ------------------------------------------

      console.log(
        'SETTINGS: Restoring imported backup...'
      )


      await importDatabase(
        backupData
      )


      setMessage(
        'Data imported and restored successfully. Please reopen the page.'
      )

    } catch (error) {

      console.error(
        'SETTINGS: Import failed:',
        error
      )


      setMessage(
        `Import failed: ${
          error?.message ||
          'Invalid HMS backup file.'
        }`
      )

    } finally {

      setRestoreLoading(false)

      event.target.value = ''

    }

  }


  // ==================================================
  // REPLACE PAYMENT QR
  // ==================================================

  const handleReplaceQr = async (event) => {

    const file =
      event.target.files?.[0]


    if (!file) {

      return

    }


    // ------------------------------------------
    // Validate image
    // ------------------------------------------

    if (
      !file.type.startsWith('image/')
    ) {

      setMessage(
        'Please select a valid QR image.'
      )

      event.target.value = ''

      return

    }


    // Save current image before processing
    const previousQrImage =
      paymentQrImage


    try {

      setQrReading(true)

      setMessage(
        'Reading payment QR...'
      )


      // ==================================================
      // READ IMAGE
      // ==================================================

      const qrData =
        await new Promise(
          (resolve, reject) => {

            const reader =
              new FileReader()


            reader.onload = () => {

              resolve(
                reader.result
              )

            }


            reader.onerror = () => {

              reject(
                new Error(
                  'Failed to read image.'
                )
              )

            }


            reader.readAsDataURL(
              file
            )

          }
        )


      // ==================================================
      // DECODE QR
      // ==================================================

      const decodedData =
        await decodePaymentQr(
          qrData
        )


      console.log(
        'SETTINGS: Decoded QR data:',
        decodedData
      )


      // ==================================================
      // UPDATE IMAGE
      // ==================================================

      setPaymentQrImage(
        qrData
      )


      // ==================================================
      // CLEAR OLD DETAILS
      // ==================================================

      setPaymentQrName('')

      setPaymentQrUpiId('')

      setPaymentQrNote('')


      // ==================================================
      // SAVE DETECTED DETAILS TEMPORARILY
      // ==================================================

      setDetectedQrData({

        name:
          decodedData?.name ||
          '',

        upiId:
          decodedData?.upiId ||
          '',

        note:
          decodedData?.note ||
          ''

      })


      // ==================================================
      // RESULT MESSAGE
      // ==================================================

      const hasDetectedData =
        Boolean(
          decodedData?.name ||
          decodedData?.upiId ||
          decodedData?.note
        )


      if (hasDetectedData) {

        setMessage(
          'QR detected. You can change any payment detail before saving.'
        )

      } else {

        setMessage(
          'QR selected. No payment details were detected. You can enter them manually.'
        )

      }

    } catch (error) {

      console.error(
        'SETTINGS: QR reading failed:',
        error
      )


      // Restore previous image
      setPaymentQrImage(
        previousQrImage
      )


      setDetectedQrData({

        name: '',
        upiId: '',
        note: ''

      })


      setMessage(
        'Failed to read the selected QR image.'
      )

    } finally {

      setQrReading(false)

      event.target.value = ''

    }

  }


  // ==================================================
  // SAVE PAYMENT QR + DETAILS
  // ==================================================

  const handleSavePaymentQr = () => {

    // ------------------------------------------
    // Manual values have priority
    // ------------------------------------------

    const finalName =
      paymentQrName.trim() ||
      detectedQrData.name.trim()


    const finalUpiId =
      paymentQrUpiId.trim() ||
      detectedQrData.upiId.trim()


    const finalNote =
      paymentQrNote.trim() ||
      detectedQrData.note.trim()


    // ------------------------------------------
    // Save
    // ------------------------------------------

    savePaymentQr({

      qr:
        paymentQrImage,

      name:
        finalName,

      upiId:
        finalUpiId,

      note:
        finalNote

    })


    // ------------------------------------------
    // Update UI
    // ------------------------------------------

    setPaymentQrName(
      finalName
    )


    setPaymentQrUpiId(
      finalUpiId
    )


    setPaymentQrNote(
      finalNote
    )


    setDetectedQrData({

      name: '',
      upiId: '',
      note: ''

    })


    setMessage(
      'Payment QR and details saved successfully.'
    )

  }


  // ==================================================
  // SHARE PAYMENT QR
  // ==================================================

  const handleShareQr = async () => {

    try {

      // ==================================================
      // ANDROID
      // ==================================================

      if (
        Capacitor.isNativePlatform()
      ) {

        const response =
          await fetch(
            paymentQrImage
          )


        const blob =
          await response.blob()


        const reader =
          new FileReader()


        reader.onloadend =
          async () => {

            try {

              const base64Data =
                reader.result
                  .split(',')[1]


              const mimeType =
                blob.type ||
                'image/png'


              const extension =
                mimeType === 'image/jpeg'
                  ? 'jpg'
                  : 'png'


              const fileName =
                `payment-qr.${extension}`


              await Filesystem.writeFile({

                path:
                  fileName,

                data:
                  base64Data,

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


              await Share.share({

                title:
                  'Payment QR',

                text:
                  'Payment QR Code',

                files:
                  [
                    fileUri.uri
                  ],

                dialogTitle:
                  'Share Payment QR'

              })

            } catch (error) {

              console.error(
                'QR sharing failed:',
                error
              )

            }

          }


        reader.readAsDataURL(
          blob
        )


        return

      }


      // ==================================================
      // BROWSER
      // ==================================================

      if (
        navigator.share
      ) {

        const response =
          await fetch(
            paymentQrImage
          )


        const blob =
          await response.blob()


        const file =
          new File(
            [blob],
            'payment-qr.png',
            {
              type:
                blob.type ||
                'image/png'
            }
          )


        // ------------------------------------------
        // File sharing
        // ------------------------------------------

        if (
          navigator.canShare &&
          navigator.canShare({
            files: [file]
          })
        ) {

          await navigator.share({

            title:
              'Payment QR',

            text:
              'Payment QR Code',

            files:
              [file]

          })


          return

        }


        // ------------------------------------------
        // Text-only browser sharing
        // ------------------------------------------

        await navigator.share({

          title:
            'Payment QR',

          text:
            'Scan this QR code to make a payment.'

        })


        return

      }


      // ==================================================
      // NOT SUPPORTED
      // ==================================================

      alert(
        'Sharing is not supported on this device.'
      )

    } catch (error) {

      console.error(
        'QR sharing failed:',
        error
      )

    }

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="page-container settings-page">

      <h1>
        Settings
      </h1>


      <p className="settings-subtitle">
        Manage your application data
      </p>


      {/* ==================================================
          DATA MANAGEMENT
          ================================================== */}

      <div className="settings-section">

        <h2>
          Data Management
        </h2>


        {/* Hidden backup/import file picker */}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          style={{
            display: 'none'
          }}
        />


        <div className="settings-options">


          {/* =====================================
              BACKUP
          ====================================== */}

          <div className="settings-option">

            <button
              className="data-button backup-button"
              onClick={handleBackup}
              disabled={
                backupLoading ||
                restoreLoading
              }
            >

              <span className="data-button-icon">
                💾
              </span>


              <span className="data-button-text">

                {backupLoading
                  ? 'Creating Backup...'
                  : 'Backup'}

              </span>

            </button>


            <p className="data-description">
              Creates a backup of your current HMS data
              and saves it automatically to your device.
            </p>

          </div>


          {/* =====================================
              RESTORE
          ====================================== */}

          <div className="settings-option">

            <button
              className="data-button restore-button"
              onClick={handleRestore}
              disabled={
                backupLoading ||
                restoreLoading
              }
            >

              <span className="data-button-icon">
                ♻️
              </span>


              <span className="data-button-text">

                {restoreLoading
                  ? 'Restoring...'
                  : 'Restore'}

              </span>

            </button>


            <p className="data-description">
              Restores your HMS data from the backup
              saved on your device.
            </p>

          </div>


          {/* =====================================
              EXPORT
          ====================================== */}

          {Capacitor.isNativePlatform() && (

            <div className="settings-option">

              <button
                className="data-button export-button"
                onClick={handleExportBackup}
                disabled={
                  backupLoading ||
                  restoreLoading
                }
              >

                <span className="data-button-icon">
                  📤
                </span>


                <span className="data-button-text">

                  {backupLoading
                    ? 'Preparing Export...'
                    : 'Export Data'}

                </span>

              </button>


              <p className="data-description">
                Exports your HMS data as a backup file
                so you can save or share it to your
                desired location.
              </p>

            </div>

          )}


          {/* =====================================
              IMPORT & RESTORE
          ====================================== */}

          {Capacitor.isNativePlatform() && (

            <div className="settings-option">

              <button
                className="data-button import-button"
                onClick={handleImport}
                disabled={
                  backupLoading ||
                  restoreLoading
                }
              >

                <span className="data-button-icon">
                  📥
                </span>


                <span className="data-button-text">

                  {restoreLoading
                    ? 'Importing...'
                    : 'Import & Restore Backup'}

                </span>

              </button>


              <p className="data-description">
                Imports a backup from your desired
                location and restores the data to HMS.
              </p>

            </div>

          )}

        </div>


        {/* ==================================================
            MESSAGE
            ================================================== */}

        {message && (

          <p className="settings-message">
            {message}
          </p>

        )}

      </div>


      {/* ==================================================
          PAYMENT QR
          ================================================== */}

      <div className="settings-section payment-qr-section">

        <h2>
          Payment QR
        </h2>


        <div className="payment-qr-container">


          {/* ==================================================
              QR IMAGE
              ================================================== */}

          <img
            src={paymentQrImage}
            alt="Payment QR"
            className="payment-qr-image"
          />


          {/* ==================================================
              QR FILE PICKER
              ================================================== */}

          <input
            ref={paymentQrInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style={{
              display: 'none'
            }}
            onChange={handleReplaceQr}
          />


          {/* ==================================================
              PAYMENT DETAILS FORM
              ================================================== */}

          <div className="payment-qr-details-form">

            <p className="payment-qr-form-help">
              Payment details are optional. If you leave
              a field blank, HMS will use that information
              from the QR code when available.
            </p>


            {/* =====================================
                NAME
            ====================================== */}

            <div className="payment-qr-field">

              <label>
                Name
              </label>


              <input
                type="text"
                value={paymentQrName}
                onChange={(event) =>
                  setPaymentQrName(
                    event.target.value
                  )
                }
                placeholder={
                  detectedQrData.name ||
                  'Enter name (optional)'
                }
              />

            </div>


            {/* =====================================
                UPI ID
            ====================================== */}

            <div className="payment-qr-field">

              <label>
                UPI ID
              </label>


              <input
                type="text"
                value={paymentQrUpiId}
                onChange={(event) =>
                  setPaymentQrUpiId(
                    event.target.value
                  )
                }
                placeholder={
                  detectedQrData.upiId ||
                  'Enter UPI ID (optional)'
                }
              />

            </div>


            {/* =====================================
                PAYMENT NOTE
            ====================================== */}

            <div className="payment-qr-field">

              <label>
                Payment Note
              </label>


              <input
                type="text"
                value={paymentQrNote}
                onChange={(event) =>
                  setPaymentQrNote(
                    event.target.value
                  )
                }
                placeholder={
                  detectedQrData.note ||
                  'Enter payment note (optional)'
                }
              />

            </div>

          </div>


          {/* ==================================================
              PAYMENT QR BUTTONS
              ================================================== */}

          <div className="payment-qr-buttons">


            {/* SHARE */}

            <button
              className="share-qr-button"
              onClick={handleShareQr}
            >
              📤 Share QR
            </button>


            {/* REPLACE */}

            <button
              className="replace-qr-button"
              onClick={() =>
                paymentQrInputRef.current?.click()
              }
              disabled={qrReading}
            >

              {qrReading
                ? '🔍 Reading QR...'
                : '🔄 Replace QR'}

            </button>


            {/* SAVE */}

            <button
              className="save-qr-button"
              onClick={handleSavePaymentQr}
              disabled={qrReading}
            >
              💾 Save QR Details
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}


export default Settings