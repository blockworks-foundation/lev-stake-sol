import { ThemeData } from 'types'
import {
  publicSans,
  publicSansDisplay,
  // publicSansMono,
  // ttCommons,
  // ttCommonsExpanded,
  ttCommonsMono,
} from './fonts'

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

type NftThemeMeta = {
  [key: string]: ThemeData
}

export const nftThemeMeta: NftThemeMeta = {
  default: {
    buttonStyle: 'flat',
    fonts: {
      body: publicSans,
      display: publicSansDisplay,
      mono: ttCommonsMono,
    },
    logoPath: '/logos/logo-mark.svg',
    platformName: 'Mango',
    rainAnimationImagePath: '',
    sideImagePath: '',
    sideTilePath: '',
    sideTilePathExpanded: '',
    topTilePath: '',
    tvChartTheme: 'Dark',
    tvImagePath: '',
    useGradientBg: false,
  },
}

export const CUSTOM_SKINS: { [key: string]: string } = {
  bonk: '6FUYsgvSPiLsMpKZqLWswkw7j4juudZyVopU6RYKLkQ3',
  pepe: '6FUYsgvSPiLsMpKZqLWswkw7j4juudZyVopU6RYKLkQ3',
}
