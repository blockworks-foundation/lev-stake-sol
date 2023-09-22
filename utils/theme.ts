import { ThemeData } from 'types'
import { lalezar, robotoFlex, robotoMono } from './fonts'

export const breakpoints = {
  sm: 640,
  // => @media (min-width: 640px) { ... }

  md: 768,
  // => @media (min-width: 768px) { ... }

  lg: 1024,
  // => @media (min-width: 1024px) { ... }

  xl: 1280,
  // => @media (min-width: 1280px) { ... }

  '2xl': 1536,
  // => @media (min-width: 1536px) { ... }

  '3xl': 1792,
  // => @media (min-width: 1792px) { ... }
}

type Theme = {
  [key: string]: ThemeData
}

export const themeData: Theme = {
  default: {
    fonts: {
      body: robotoFlex,
      display: lalezar,
      mono: robotoMono,
    },
    logoPath: '/logos/boost.png',
  },
}
