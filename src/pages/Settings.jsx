import { useState, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

import {
  exportDatabase,
  importDatabase
} from '../database/database'


const Settings = () => {

  const [backupLoading, setBackupLoading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [restoreLoading, setRestoreLoading] =
    useState(false)

  const fileInputRef =
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


      // ------------------------------------------
      // ANDROID
      // ------------------------------------------

      if (Capacitor.isNativePlatform()) {

        // ------------------------------------------
        // Create backup directory
        // ------------------------------------------

        try {

          await Filesystem.stat({
            path: 'hms',
            directory: Directory.Documents
          })

          console.log(
            'SETTINGS: Backup directory already exists'
          )

        } catch {

          await Filesystem.mkdir({
            path: 'hms',
            directory: Directory.Documents
          })

          console.log(
            'SETTINGS: Backup directory created'
          )

        }


        // ------------------------------------------
        // Backup filename
        // ------------------------------------------

        const fileName =
          'hms/HMS_Backup.json'


        // ------------------------------------------
        // Save backup
        // ------------------------------------------

        await Filesystem.writeFile({

          path:
            fileName,

          data:
            jsonString,

          directory:
            Directory.Documents,

          encoding:
            'utf8'

        })


        console.log(
          'SETTINGS: Backup saved:',
          fileName
        )


        setMessage(
          'Backup created successfully.'
        )

        return

      }


      // ------------------------------------------
      // BROWSER
      // Same behavior as Export Data
      // ------------------------------------------

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

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      URL.revokeObjectURL(url)


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


      // ------------------------------------------
      // Android
      // ------------------------------------------

      if (Capacitor.isNativePlatform()) {

        const backup =
          await exportDatabase()

        const jsonString =
          JSON.stringify(
            backup,
            null,
            2
          )

        const fileName =
          'HMS_Backup.json'


        // ------------------------------------------
        // Save temporary export file
        // ------------------------------------------

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


        // ------------------------------------------
        // Get file URI
        // ------------------------------------------

        const fileUri =
          await Filesystem.getUri({

            path:
              fileName,

            directory:
              Directory.Cache

          })


        console.log(
          'SETTINGS: Export file created:',
          fileUri.uri
        )


        // ------------------------------------------
        // Share file
        // ------------------------------------------

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


      // ------------------------------------------
      // Browser
      // ------------------------------------------

      const backup =
        await exportDatabase()

      const jsonString =
        JSON.stringify(
          backup,
          null,
          2
        )

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

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      URL.revokeObjectURL(url)


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


      // ------------------------------------------
      // ANDROID
      // ------------------------------------------

      if (Capacitor.isNativePlatform()) {

        // ------------------------------------------
        // Read automatic backup
        // ------------------------------------------

        const backupFile =
          await Filesystem.readFile({

            path:
              'hms/HMS_Backup.json',

            directory:
              Directory.Documents,

            encoding:
              'utf8'

          })


        // ------------------------------------------
        // Parse backup
        // ------------------------------------------

        const backupData =
          JSON.parse(
            backupFile.data
          )


        // ------------------------------------------
        // Confirm restore
        // ------------------------------------------

        const confirmed =
          window.confirm(
            'Restore the HMS backup?\n\n' +
            'This will replace all current HMS data.'
          )


        if (!confirmed) {

          return

        }


        // ------------------------------------------
        // Restore database
        // ------------------------------------------

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


      // ------------------------------------------
      // BROWSER
      // Same behavior as Import & Restore
      // ------------------------------------------

      console.log(
        'SETTINGS: Opening backup file picker...'
      )

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

    console.log(
      'SETTINGS: Opening file picker...'
    )

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
      // Check file type
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
      // Validate backup
      // ------------------------------------------

      if (
        !backupData ||
        backupData.database !== 'hms' ||
        !Array.isArray(backupData.tables)
      ) {

        throw new Error(
          'This is not a valid HMS database backup.'
        )

      }


      // ------------------------------------------
      // Confirm import
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
      // Restore imported database
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


      <div className="settings-section">

        <h2>
          Data Management
        </h2>


        {/* Hidden file picker */}

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


        {/* =====================================
            MESSAGE
        ====================================== */}

        {message && (

          <p className="settings-message">
            {message}
          </p>

        )}

      </div>

    </div>

  )

}


export default Settings