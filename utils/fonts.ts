import { Lalezar, Roboto, Roboto_Mono } from 'next/font/google'

export const lalezar = Lalezar({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const robotoFlex = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
