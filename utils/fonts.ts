import localFont from 'next/font/local'

// this font should be used as the mono variant for all themes

export const ttCommonsMono = localFont({
  src: '../fonts/TT_Commons_Pro_Mono_Medium.woff2',
  variable: '--font-mono',
})

export const ttCommons = localFont({
  src: [
    {
      path: '../fonts/TT_Commons_Pro_Normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/TT_Commons_Pro_Medium.woff2',
      weight: '600',
      style: 'medium',
    },
    {
      path: '../fonts/TT_Commons_Pro_DemiBold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-body',
})

export const ttCommonsExpanded = localFont({
  src: '../fonts/TT_Commons_Pro_Expanded_DemiBold.woff2',
  variable: '--font-display',
})

export const publicSans = localFont({
  src: [
    {
      path: '../fonts/PublicSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/PublicSans-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../fonts/PublicSans-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-body',
})

export const publicSansDisplay = localFont({
  src: '../fonts/PublicSans-Bold.woff2',
  variable: '--font-display',
})

export const publicSansMono = localFont({
  src: '../fonts/PublicSans-Regular.woff2',
  variable: '--font-mono',
})
