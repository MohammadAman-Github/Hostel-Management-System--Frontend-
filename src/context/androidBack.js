import { useContext } from 'react'
import AndroidBackContext from './AndroidBackContext'

export const useAndroidBack = () => {

  const context = useContext(AndroidBackContext)

  if (!context) {
    throw new Error(
      'useAndroidBack must be used inside AndroidBackHandler'
    )
  }

  return context
}