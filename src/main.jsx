import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { initDatabase } from './database/database.js'


const startApp = async () => {

  try {

    await initDatabase()

    console.log('Database initialization completed')

  } catch (error) {

    console.error(
      'Database initialization failed:',
      error
    )

  }


  ReactDOM.createRoot(
    document.getElementById('root')
  ).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

}


startApp()


