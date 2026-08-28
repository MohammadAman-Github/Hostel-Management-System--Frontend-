import { useContext } from 'react'
import AndroidBackContext from './AndroidBackContext'

export const useAndroidBack = () => {
  return useContext(AndroidBackContext)
}