import { useState } from 'react'

import { Capacitor } from '@capacitor/core'

import {
  Filesystem,
  Directory
} from '@capacitor/filesystem'

import { Share } from '@capacitor/share'

import {
  getSavedPaymentQr
} from '../utils/paymentQrStorage'

import paymentQr from '../assets/payment-qr.png'


const PaymentQR = () => {

  // ==================================================
  // PAYMENT QR
  // ==================================================

  const savedPaymentQr =
    getSavedPaymentQr()


  const [paymentQrImage] =
    useState(
      savedPaymentQr?.qr ||
      paymentQr
    )


  const paymentQrName =
    savedPaymentQr?.name ||
    ''


  const paymentQrUpiId =
    savedPaymentQr?.upiId ||
    ''


  const paymentQrNote =
    savedPaymentQr?.note ||
    ''


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


        if (
          navigator.canShare &&
          navigator.canShare({
            files:
              [file]
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


        await navigator.share({

          title:
            'Payment QR',

          text:
            'Scan this QR code to make a payment.'

        })


        return

      }


      // ==================================================
      // SHARING NOT SUPPORTED
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

    <div className="page-container payment-qr-page">


      {/* ==================================================
          MAIN PAYMENT QR CONTAINER
          ================================================== */}

      <div className="payment-qr-layout">


        {/* ==================================================
            LEFT SIDE
            ================================================== */}

        <div className="payment-qr-info">


          {/* ==================================================
              TITLE
              ================================================== */}

          <div className="payment-qr-heading">

            <div className="payment-qr-heading-icon">
              ▦
            </div>


            <div>

              <h1>
                Payment QR
              </h1>


              <p>
                Scan this QR code to make a payment
              </p>

            </div>

          </div>


          {/* ==================================================
              PAYMENT DETAILS
              ================================================== */}

          {
            (
              paymentQrName ||
              paymentQrUpiId ||
              paymentQrNote
            ) && (

              <div className="payment-qr-page-details">


                {/* ==========================================
                    NAME
                    ========================================== */}

                {paymentQrName && (

                  <div className="payment-qr-page-detail">

                    <span className="payment-qr-detail-icon">
                      👤
                    </span>


                    <div>

                      <span className="payment-qr-detail-label">
                        Name
                      </span>


                      <strong>
                        {paymentQrName}
                      </strong>

                    </div>

                  </div>

                )}


                {/* ==========================================
                    UPI ID
                    ========================================== */}

                {paymentQrUpiId && (

                  <div className="payment-qr-page-detail">

                    <span className="payment-qr-detail-icon">
                      ▣
                    </span>


                    <div>

                      <span className="payment-qr-detail-label">
                        UPI ID
                      </span>


                      <strong>
                        {paymentQrUpiId}
                      </strong>

                    </div>

                  </div>

                )}


                {/* ==========================================
                    NOTE
                    ========================================== */}

                {paymentQrNote && (

                  <div className="payment-qr-page-detail">

                    <span className="payment-qr-detail-icon">
                      ⓘ
                    </span>


                    <div>

                      <span className="payment-qr-detail-label">
                        Note
                      </span>


                      <strong>
                        {paymentQrNote}
                      </strong>

                    </div>

                  </div>

                )}

              </div>

            )
          }

        </div>


        {/* ==================================================
            RIGHT SIDE
            ================================================== */}

        <div className="payment-qr-display">


          {/* ==================================================
              QR CARD
              ================================================== */}

          <div className="payment-qr-image-card">

            <h2>
              Payment QR
            </h2>


            <img
              src={paymentQrImage}
              alt="Payment QR"
              className="payment-qr-page-image"
            />

          </div>


          {/* ==================================================
              SHARE BUTTON
              ================================================== */}

          <button
            type="button"
            className="share-qr-button"
            onClick={handleShareQr}
          >

            📤 Share QR

          </button>

        </div>

      </div>

    </div>

  )

}


export default PaymentQR