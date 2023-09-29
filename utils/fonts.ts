import { Nunito } from 'next/font/google'

export const nunitoDisplay = Nunito({
  weight: '900',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const nunito = Nunito({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
