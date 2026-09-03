import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  getMonthlyRentByMonthAndYear,
  getMonthlyRentByMonthYearAndRoomNo
} from '../services/monthlyRentService'

import MonthlyRentViewModal from '../components/MonthlyRentViewModal'


const MonthlyRentStatus = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [rentDetails, setRentDetails] = useState([])
  const [viewRent, setViewRent] = useState(null)

  let paymentStatus = ''
  let pageTitle = ''

  if (location.pathname === '/monthly-rent/paid') {
    paymentStatus = 'Paid'
    pageTitle = 'Paid Rooms'
  }

  if (location.pathname === '/monthly-rent/partially-paid') {
    paymentStatus = 'Partially Paid'
    pageTitle = 'Partially Paid Rooms'
  }

  if (location.pathname === '/monthly-rent/pending') {
    paymentStatus = 'Pending'
    pageTitle = 'Pending Rooms'
  }


  useEffect(() => {

    const currentDate = new Date()

    const currentMonth =
      currentDate.toLocaleString('en-US', {
        month: 'long'
      })

    const currentYear =
      currentDate.getFullYear()

    getMonthlyRentByMonthAndYear(
      currentMonth,
      currentYear
    )
      .then((data) => {

        const filteredData =
          (data || []).filter(
            (rent) =>
              (rent.paymentStatus || 'Pending') ===
              paymentStatus
          )

        setRentDetails(filteredData)

      })
      .catch((error) => {

        console.error(
          'Error fetching payment status rooms:',
          error
        )

        setRentDetails([])

      })

  }, [paymentStatus])


  return (

    <div className="monthly-rent-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="monthly-rent-header">

        <div>

          <h1>
            {pageTitle}
          </h1>

          <p>
            Current Month Monthly Rent
          </p>

        </div>


        <button
          className="cancel-btn"
          onClick={() => navigate('/monthly-rent')}
        >
          ← Back to Monthly Rent
        </button>

      </div>


      {/* =========================
          TABLE
          ========================= */}

      <div className="monthly-rent-table-container">

        <table className="monthly-rent-table">

          <thead>

            <tr>

              <th>Room No</th>
              <th>Month</th>
              <th>Rent</th>
              <th>Light Bill</th>
              <th>Arrear Bill</th>
              <th>Total Rent</th>
              <th>Total Rent Paid</th>
              <th>Payment Status</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {rentDetails.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  style={{
                    textAlign: 'center',
                    padding: '30px'
                  }}
                >
                  No {pageTitle.toLowerCase()} found.
                </td>

              </tr>

            ) : (

              rentDetails.map((rent) => (

                <tr
                  key={`${rent.month}-${rent.year}-${rent.roomNo}`}
                >

                  <td>
                    {rent.roomNo}
                  </td>


                  <td>
                    {rent.month} -
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
                    {rent.paymentStatus || 'Pending'}
                  </td>


                  <td className="monthly-rent-action-cell">

                    <button
                      className="view-btn"
                      onClick={async () => {

                        try {

                          const data =
  await getMonthlyRentByMonthYearAndRoomNo(
    rent.month,
    rent.year,
    rent.roomNo
  )

                          setViewRent(data)

                        } catch (error) {

                          console.error(
                            'Error fetching monthly rent details:',
                            error
                          )

                        }

                      }}
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* =========================
          SHARED VIEW POPUP
          ========================= */}

      {viewRent && (

        <MonthlyRentViewModal
  rent={viewRent}
  onClose={() => setViewRent(null)}
/>

      )}

    </div>

  )
}


export default MonthlyRentStatus