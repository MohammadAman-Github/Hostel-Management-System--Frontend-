const PAYMENT_QR_KEY =
  'hms_payment_qr'


// ==================================================
// GET SAVED PAYMENT QR
// ==================================================

export const getSavedPaymentQr = () => {

  const saved =
    localStorage.getItem(
      PAYMENT_QR_KEY
    )


  // ------------------------------------------
  // Nothing saved
  // ------------------------------------------

  if (!saved) {

    return null

  }


  // ------------------------------------------
  // Try new object format
  // ------------------------------------------

  try {

    const parsed =
      JSON.parse(saved)


    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.qr === 'string' &&
      parsed.qr.trim()
    ) {

      return {

        qr:
          parsed.qr,

        name:
          typeof parsed.name === 'string'
            ? parsed.name
            : '',

        upiId:
          typeof parsed.upiId === 'string'
            ? parsed.upiId
            : '',

        note:
          typeof parsed.note === 'string'
            ? parsed.note
            : ''

      }

    }

  } catch {

    // ------------------------------------------
    // Old format
    // ------------------------------------------

    console.log(
      'Using old payment QR storage format.'
    )

  }


  // ==================================================
  // OLD FORMAT COMPATIBILITY
  // ==================================================

  /*
   * Earlier versions stored only the QR image:
   *
   * hms_payment_qr = "data:image/png;base64,..."
   *
   * Keep supporting that format.
   */

  return {

    qr:
      saved,

    name:
      '',

    upiId:
      '',

    note:
      ''

  }

}


// ==================================================
// SAVE PAYMENT QR
// ==================================================

export const savePaymentQr = ({
  qr = '',
  name = '',
  upiId = '',
  note = ''
} = {}) => {

  const paymentData = {

    qr:
      typeof qr === 'string'
        ? qr
        : '',

    name:
      typeof name === 'string'
        ? name.trim()
        : '',

    upiId:
      typeof upiId === 'string'
        ? upiId.trim()
        : '',

    note:
      typeof note === 'string'
        ? note.trim()
        : ''

  }


  // ------------------------------------------
  // Save as JSON
  // ------------------------------------------

  localStorage.setItem(

    PAYMENT_QR_KEY,

    JSON.stringify(
      paymentData
    )

  )

}


// ==================================================
// REMOVE PAYMENT QR
// ==================================================

export const removeSavedPaymentQr = () => {

  localStorage.removeItem(
    PAYMENT_QR_KEY
  )

}