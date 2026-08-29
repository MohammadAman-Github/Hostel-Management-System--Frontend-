import { Filesystem, Directory } from '@capacitor/filesystem'


// ==================================================
// PDF DIRECTORY
// ==================================================

const PDF_DIRECTORY = 'student-pdfs'


// ==================================================
// ENSURE PDF DIRECTORY EXISTS
// ==================================================

const ensurePdfDirectory = async () => {

  try {

    await Filesystem.mkdir({
      path: PDF_DIRECTORY,
      directory: Directory.Data,
      recursive: true
    })

  } catch {

    // Directory already exists
    console.log(
      'Student PDF directory already exists'
    )
  }
}


// ==================================================
// GET PDF FILE PATH
// ==================================================

const getPdfPath = (studentId) => {

  return `${PDF_DIRECTORY}/student_${studentId}.pdf`

}


// ==================================================
// FILE → BASE64
// ==================================================

const fileToBase64 = (file) => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader()

    reader.onload = () => {

      try {

        const result = reader.result

        const base64 =
          result.split(',')[1]

        resolve(base64)

      } catch (error) {

        reject(error)

      }
    }

    reader.onerror = () => {

      reject(
        new Error('Failed to read PDF file')
      )

    }

    reader.readAsDataURL(file)

  })
}


// ==================================================
// SAVE STUDENT PDF
// ==================================================

export const uploadStudentPdfInDb = async (
  studentId,
  file
) => {

  if (!file) {
    throw new Error('PDF file is required')
  }

  await ensurePdfDirectory()

  const base64 =
    await fileToBase64(file)

  const path =
    getPdfPath(studentId)


  await Filesystem.writeFile({

    path,

    data: base64,

    directory: Directory.Data

  })


  console.log(
    `Student PDF saved locally: ${studentId}`
  )


  return {
    studentId,
    path,
    fileName: file.name,
    size: file.size,
    type: file.type
  }
}


// ==================================================
// UPDATE STUDENT PDF
// ==================================================

export const updateStudentPdfInDb = async (
  studentId,
  file
) => {

  if (!file) {
    throw new Error('PDF file is required')
  }

  await ensurePdfDirectory()

  const base64 =
    await fileToBase64(file)

  const path =
    getPdfPath(studentId)


  await Filesystem.writeFile({

    path,

    data: base64,

    directory: Directory.Data

  })


  console.log(
    `Student PDF updated locally: ${studentId}`
  )


  return {
    studentId,
    path,
    fileName: file.name,
    size: file.size,
    type: file.type
  }
}


// ==================================================
// GET STUDENT PDF
// ==================================================

export const getStudentPdfFromDb = async (
  studentId
) => {

  const path =
    getPdfPath(studentId)


  try {

    const result =
      await Filesystem.readFile({

        path,

        directory: Directory.Data

      })


    console.log(
      `Student PDF loaded locally: ${studentId}`
    )


    return result.data

  } catch {

    console.log(
      `No local PDF found for student: ${studentId}`
    )

    return null
  }
}


// ==================================================
// DELETE STUDENT PDF
// ==================================================

export const deleteStudentPdfFromDb = async (
  studentId
) => {

  const path =
    getPdfPath(studentId)


  try {

    await Filesystem.deleteFile({

      path,

      directory: Directory.Data

    })


    console.log(
      `Student PDF deleted locally: ${studentId}`
    )

  } catch {

    console.log(
      `No local PDF to delete for student: ${studentId}`
    )
  }


  return true
}

// ==================================================
// CHECK STUDENT PDF EXISTS
// ==================================================

export const studentPdfExistsInDb = async (
  studentId
) => {

  const path =
    getPdfPath(studentId)

  try {

    await Filesystem.stat({
      path,
      directory: Directory.Data
    })

    return true

  } catch {

    return false

  }
}