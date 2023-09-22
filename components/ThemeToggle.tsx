import { useTheme } from 'next-themes'
import { IconButton } from './shared/Button'
import { useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'

const ThemeToggle = () => {
  const { setTheme } = useTheme()
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const handleToggleTheme = (isDark: boolean) => {
    setIsDarkTheme(!isDark)
    if (isDark) {
      setTheme('Light')
    } else {
      setTheme('Dark')
    }
  }

  return (
    <IconButton onClick={() => handleToggleTheme(isDarkTheme)} size="large">
      {isDarkTheme ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </IconButton>
  )
}

export default ThemeToggle
