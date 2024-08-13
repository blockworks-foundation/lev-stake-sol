import { useEffect, useState } from 'react'

const useOnlineStatus = () => {
  const [online, isOnline] = useState(true)

  const setOnline = () => {
    isOnline(true)
  }
  const setOffline = () => {
    isOnline(false)
  }

  useEffect(() => {
    if (navigator) {
      isOnline(navigator.onLine)
    }
  }, [])

  // Register the event listeners
  useEffect(() => {
    window.addEventListener('offline', setOffline)
    window.addEventListener('online', setOnline)

    // cleanup if we unmount
    return () => {
      window.removeEventListener('offline', setOffline)
      window.removeEventListener('online', setOnline)
    }
  }, [])

  return online
}

export default useOnlineStatus
