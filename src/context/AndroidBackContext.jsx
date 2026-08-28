import { createContext, useRef } from 'react'

const AndroidBackContext = createContext(null)

export const AndroidBackProvider = ({ children }) => {

  const backHandlerRef = useRef(null)

  const registerBackHandler = (handler) => {
    backHandlerRef.current = handler
  }

  const clearBackHandler = () => {
    backHandlerRef.current = null
  }

  const handleAndroidBack = () => {

    if (backHandlerRef.current) {
      backHandlerRef.current()
      backHandlerRef.current = null
      return true
    }

    return false
  }

  return (
    <AndroidBackContext.Provider
      value={{
        registerBackHandler,
        clearBackHandler,
        handleAndroidBack
      }}
    >
      {children}
    </AndroidBackContext.Provider>
  )
}

export default AndroidBackContext