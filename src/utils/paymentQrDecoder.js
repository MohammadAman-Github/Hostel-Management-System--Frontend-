import jsQR from 'jsqr'


// ==================================================
// DECODE PAYMENT QR IMAGE
// ==================================================

export const decodePaymentQr = (
  imageSource
) => {

  return new Promise((resolve) => {

    const image =
      new Image()


    // ------------------------------------------
    // IMAGE LOADED
    // ------------------------------------------

    image.onload = () => {

      try {

        const canvas =
          document.createElement('canvas')


        const context =
          canvas.getContext(
            '2d',
            {
              willReadFrequently: true
            }
          )


        if (!context) {

          resolve(null)

          return

        }


        // ------------------------------------------
        // LIMIT VERY LARGE IMAGES
        // ------------------------------------------

        const maxSize = 1600


        const originalWidth =
          image.naturalWidth


        const originalHeight =
          image.naturalHeight


        const scale =
          Math.min(
            1,
            maxSize /
              Math.max(
                originalWidth,
                originalHeight
              )
          )


        canvas.width =
          Math.max(
            1,
            Math.floor(
              originalWidth * scale
            )
          )


        canvas.height =
          Math.max(
            1,
            Math.floor(
              originalHeight * scale
            )
          )


        // ------------------------------------------
        // DRAW IMAGE
        // ------------------------------------------

        context.drawImage(

          image,

          0,
          0,

          canvas.width,
          canvas.height

        )


        // ------------------------------------------
        // READ IMAGE DATA
        // ------------------------------------------

        const imageData =
          context.getImageData(

            0,
            0,

            canvas.width,
            canvas.height

          )


        // ------------------------------------------
        // DECODE QR
        // ------------------------------------------

        const qrCode =
          jsQR(

            imageData.data,

            imageData.width,

            imageData.height

          )


        // ------------------------------------------
        // QR NOT FOUND
        // ------------------------------------------

        if (
          !qrCode ||
          !qrCode.data
        ) {

          resolve(null)

          return

        }


        console.log(
          'QR decoded successfully:',
          qrCode.data
        )


        // ------------------------------------------
        // PARSE QR CONTENT
        // ------------------------------------------

        const paymentData =
          parsePaymentQrData(
            qrCode.data
          )


        resolve(
          paymentData
        )

      } catch (error) {

        console.error(
          'QR decoding failed:',
          error
        )


        resolve(null)

      }

    }


    // ------------------------------------------
    // IMAGE LOAD ERROR
    // ------------------------------------------

    image.onerror = () => {

      console.error(
        'Failed to load QR image.'
      )


      resolve(null)

    }


    // ------------------------------------------
    // LOAD IMAGE
    // ------------------------------------------

    image.src =
      imageSource

  })

}


// ==================================================
// PARSE PAYMENT QR DATA
// ==================================================

const parsePaymentQrData = (
  qrData
) => {

  const result = {

    name:
      '',

    upiId:
      '',

    note:
      ''

  }


  // ------------------------------------------
  // INVALID DATA
  // ------------------------------------------

  if (
    !qrData ||
    typeof qrData !== 'string'
  ) {

    return result

  }


  const cleanQrData =
    qrData.trim()


  if (!cleanQrData) {

    return result

  }


  // ------------------------------------------
  // LOG RAW QR DATA
  // ------------------------------------------

  console.log(
    'Payment QR data:',
    cleanQrData
  )


  // ==================================================
  // UPI QR
  // ==================================================

  if (
    cleanQrData
      .toLowerCase()
      .startsWith('upi://')
  ) {

    try {

      /*
       * Example:
       *
       * upi://pay?
       * pa=9721093146@idfcfirst&
       * pn=Mohammad%20Aman&
       * tn=Payment
       */

      const questionMarkIndex =
        cleanQrData.indexOf('?')


      if (
        questionMarkIndex === -1
      ) {

        return result

      }


      const queryString =
        cleanQrData.substring(
          questionMarkIndex + 1
        )


      const params =
        new URLSearchParams(
          queryString
        )


      // ------------------------------------------
      // UPI ID
      // ------------------------------------------

      result.upiId =
        params.get('pa') ||
        ''


      // ------------------------------------------
      // NAME
      // ------------------------------------------

      result.name =
        params.get('pn') ||
        ''


      // ------------------------------------------
      // PAYMENT NOTE
      // ------------------------------------------

      result.note =
        params.get('tn') ||
        ''


      // ------------------------------------------
      // CLEAN VALUES
      // ------------------------------------------

      result.name =
        result.name.trim()


      result.upiId =
        result.upiId.trim()


      result.note =
        result.note.trim()


      console.log(
        'Parsed payment QR:',
        result
      )

    } catch (error) {

      console.error(
        'Failed to parse UPI QR:',
        error
      )

    }

  }


  // ------------------------------------------
  // RETURN RESULT
  // ------------------------------------------

  return result

}