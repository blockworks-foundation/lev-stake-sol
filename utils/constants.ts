import { PublicKey } from '@solana/web3.js'

// lev stake
export const JLP_BORROW_TOKEN = 'USDC'
export const LST_BORROW_TOKEN = 'SOL'

export const STAKEABLE_TOKENS_DATA = [
  {
    name: 'JLP',
    id: 1,
    active: true,
    mint_address: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
  },
  {
    name: 'USDC',
    id: 0,
    active: true,
    mint_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  {
    name: 'MSOL',
    id: 521,
    active: true,
    mint_address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  },
  {
    name: 'JitoSOL',
    id: 621,
    active: true,
    mint_address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
  },
  {
    name: 'bSOL',
    id: 721,
    active: true,
    mint_address: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
  },
]
export const STAKEABLE_TOKENS = STAKEABLE_TOKENS_DATA.filter(
  (d) => d.active,
).map((d) => d.name)

export const SHOW_INACTIVE_POSITIONS_KEY = 'showInactivePositions-0.1'
// end

export const LAST_ACCOUNT_KEY = 'mangoAccount-0.4'

export const BOOST_ACCOUNT_PREFIX = 'Leverage Stake '

export const BOOST_DEPOSIT_PREFIX = 'Deposit Leverage Stake '

export const CLIENT_TX_TIMEOUT = 90000

export const SECONDS = 1000

export const INPUT_TOKEN_DEFAULT = 'USDC'
export const MANGO_MINT = 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac'
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const SOL_MINT = 'So11111111111111111111111111111111111111112'
export const OUTPUT_TOKEN_DEFAULT = 'JLP'

export const JUPITER_V4_PROGRAM_ID =
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB'

export const CONNECTION_COMMITMENT = 'processed'

// Local storage keys for settings
export const IS_ONBOARDED_KEY = 'isOnboarded-0.1'

export const SHOW_ZERO_BALANCES_KEY = 'show-zero-balances-0.2'

export const SIDEBAR_COLLAPSE_KEY = 'sidebar-0.1'

export const ONBOARDING_TOUR_KEY = 'showOnboardingTour-0.1'

export const PREFERRED_EXPLORER_KEY = 'preferredExplorer-0.1'

export const ANIMATION_SETTINGS_KEY = 'animationSettings-0.1'

export const SOUND_SETTINGS_KEY = 'soundSettings-0.1'

export const SIZE_INPUT_UI_KEY = 'tradeFormUi-0.2'

export const TRADE_CHECKBOXES_KEY = 'tradeCheckboxes-0.1'

export const TV_USER_ID_KEY = 'tv-userId-0.1'

export const GRID_LAYOUT_KEY = 'savedLayouts-0.2'

export const NOTIFICATION_POSITION_KEY = 'notificationPosition-0.2'

export const TRADE_CHART_UI_KEY = 'tradeChart-0.3'

export const FAVORITE_MARKETS_KEY = 'favoriteMarkets-0.2'

export const FAVORITE_SWAPS_KEY = 'favoriteSwaps-0.1'

export const THEME_KEY = 'theme-0.1'

export const RPC_PROVIDER_KEY = 'rpcProviderKey-0.8'

export const PRIORITY_FEE_KEY = 'priorityFeeKey-0.2'

export const SHOW_ORDER_LINES_KEY = 'showOrderLines-0.1'

export const SWAP_MARGIN_KEY = 'swapMargin-0.1'

export const SHOW_SWAP_INTRO_MODAL = 'showSwapModal-0.1'

export const ACCEPT_TERMS_KEY = 'termsOfUseAccepted-0.1'

export const TRADE_LAYOUT_KEY = 'tradeLayoutKey-0.1'

export const STATS_TAB_KEY = 'activeStatsTab-0.1'

export const USE_ORDERBOOK_FEED_KEY = 'useOrderbookFeed-0.1'

export const HOT_KEYS_KEY = 'hotKeys-0.1'

export const AUTO_CONNECT_WALLET = 'auto-connect-0.1'

export const LAST_WALLET_NAME = 'lastWalletName'

export const PRIVACY_MODE = 'privacy-mode-0.1'

// Unused
export const PROFILE_CATEGORIES = [
  'borrower',
  'day-trader',
  'degen',
  'discretionary',
  'loan-shark',
  'market-maker',
  'swing-trader',
  'trader',
  'yolo',
]

export const MANGO_ROUTER_API_URL = 'https://api.mngo.cloud/router/v1'

export const MANGO_DATA_API_URL = 'https://api.mngo.cloud/data/v4'

export const BOOST_DATA_API_URL = 'https://api.mngo.cloud/data/boost'

export const MANGO_DATA_OPENBOOK_URL = 'https://api.mngo.cloud/openbook/v1'

export const DEFAULT_MARKET_NAME = 'SOL/USDC'

export const MIN_SOL_BALANCE = 0.001

export const MAX_PRIORITY_FEE_KEYS = 128

export const ACCOUNT_ACTION_MODAL_HEIGHT = '462px'

export const ACCOUNT_ACTION_MODAL_INNER_HEIGHT = '500px'

export const TRADE_VOLUME_ALERT_KEY = 'tradeVolumeAlert-0.1'

export const PAGINATION_PAGE_LENGTH = 250

export const JUPITER_API_MAINNET = 'https://token.jup.ag/strict'

export const JUPITER_API_DEVNET = 'https://api.jup.ag/api/tokens/devnet'

export const JUPITER_PRICE_API_MAINNET = 'https://price.jup.ag/v4/'

export const NOTIFICATION_API = 'https://notifications-api.herokuapp.com/'

export const NOTIFICATION_API_WEBSOCKET =
  'wss://notifications-api.herokuapp.com/ws'

export const SWITCHBOARD_PROGRAM_ID =
  'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f'

export const CUSTOM_TOKEN_ICONS: { [key: string]: boolean } = {
  bonk: true,
  btc: true,
  dai: true,
  dual: true,
  eth: true,
  ethpo: true,
  'eth (portal)': true,
  hnt: true,
  jitosol: true,
  jlp: true,
  kin: true,
  ldo: true,
  mngo: true,
  msol: true,
  orca: true,
  ray: true,
  rndr: true,
  sol: true,
  stsol: true,
  usdc: true,
  usdh: true,
  usdt: true,
  wbtcpo: true,
  'wbtc (portal)': true,
}

export const DEFAULT_FAVORITE_MKTS = [
  'SOL-PERP',
  'ETH-PERP',
  'BTC-PERP',
  'RNDR-PERP',
]

export const WHITE_LIST_API = 'https://api.mngo.cloud/whitelist/v1/'
export const DAILY_SECONDS = 86400
export const DAILY_MILLISECONDS = 86400000

// max slot numbers for mango account
export const MAX_ACCOUNTS = {
  tokenAccounts: '8',
  spotOpenOrders: '4',
  perpAccounts: '4',
  perpOpenOrders: '64',
  tcsOrders: '64',
}

export const ACCOUNT_ACTIONS_NUMBER_FORMAT_CLASSES =
  'w-full rounded-lg rounded-l-none border border-th-input-border bg-th-input-bkg p-3 text-right font-mono text-xl text-th-fgd-1 focus-visible:border-th-fgd-4 focus:outline-none md:hover:border-th-input-border-hover md:hover:focus-visible:border-th-fgd-4'

export const FALLBACK_ORACLES = [
  new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD'),
] // USDC
