import { PublicKey } from '@solana/web3.js'

// lev stake
export const JLP_BORROW_TOKEN = 'USDC'
export const LST_BORROW_TOKEN = 'SOL'

export type StakeableTokensData = {
  name: string
  symbol: string
  description: string
  id: number
  active: boolean
  mint_address: string
  clientContext: ClientContextKeys
  borrowToken: 'USDC' | 'SOL'
  links: {
    website: string | undefined
    twitter: string | undefined
  }
  reduceOnly: boolean
}

export const STAKEABLE_TOKENS_DATA: StakeableTokensData[] = [
  {
    name: 'Jupiter Perps LP',
    symbol: 'JLP',
    description: '',
    id: 1,
    active: true,
    mint_address: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
    clientContext: 'jlp',
    borrowToken: 'USDC',
    links: {
      website: 'https://jup.ag/',
      twitter: 'https://twitter.com/JupiterExchange',
    },
    reduceOnly: true,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    description: '',
    id: 0,
    active: true,
    mint_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    clientContext: 'jlp',
    borrowToken: 'USDC',
    links: {
      website: 'https://www.circle.com/en/usdc',
      twitter: 'https://twitter.com/circle',
    },
    reduceOnly: true,
  },
  {
    name: 'Marinade Staked SOL',
    symbol: 'MSOL',
    description:
      'Marinade is a stake automation platform that monitors all Solana validators and delegates to the 100+ best-performing ones.',
    id: 521,
    active: true,
    mint_address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://marinade.finance/',
      twitter: 'https://twitter.com/marinadefinance',
    },
    reduceOnly: true,
  },
  {
    name: 'Jito Staked SOL',
    symbol: 'JitoSOL',
    description:
      'JitoSOL supports the decentralization and health of the Solana network through efficient MEV extraction and spam reduction.',
    id: 621,
    active: true,
    mint_address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://www.jito.wtf/',
      twitter: 'https://twitter.com/jito_labs',
    },
    reduceOnly: true,
  },
  {
    name: 'BlazeStake Staked SOL',
    symbol: 'bSOL',
    description: '',
    id: 721,
    active: true,
    mint_address: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://solblaze.org/',
      twitter: 'https://twitter.com/solblaze_org',
    },
    reduceOnly: true,
  },
  {
    name: 'JPool Staked SOL',
    symbol: 'JSOL',
    description: '',
    id: 1063,
    active: true,
    mint_address: '7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://jpool.one/',
      twitter: 'https://twitter.com/JPoolSolana',
    },
    reduceOnly: true,
  },
  {
    name: 'Sanctum Infinity',
    symbol: 'INF',
    description:
      "Infinity is the first infinite-LST pool and is Sanctum's flagship product. Infinity holds a basket of LSTs and earns staking yields and trading fees.",
    id: 1105,
    active: true,
    mint_address: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://www.sanctum.so/',
      twitter: 'https://twitter.com/sanctumso',
    },
    reduceOnly: true,
  },
  {
    name: 'SolanaHub Staked SOL',
    symbol: 'hubSOL',
    description: 'A revenue-sharing validator empowering SolanaHub users',
    id: 1153,
    active: true,
    mint_address: 'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://www.solanahub.app/',
      twitter: 'https://twitter.com/SolanaHubApp',
    },
    reduceOnly: true,
  },
  {
    name: 'Simpdigit Staked SOL',
    symbol: 'digitSOL',
    description:
      'High performance LST with MEV and voting rewards kickback. Support developers in South America.',
    id: 1161,
    active: true,
    mint_address: 'D1gittVxgtszzY4fMwiTfM4Hp7uL5Tdi1S9LYaepAUUm',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://simpdigit.com/',
      twitter: 'https://twitter.com/simpdigit',
    },
    reduceOnly: true,
  },
  {
    name: 'Step Finance Staked SOL',
    symbol: 'stepSOL',
    description: 'LST for the Step Community with Rewards',
    id: 1252,
    active: true,
    mint_address: 'StPsoHokZryePePFV8N7iXvfEmgUoJ87rivABX7gaW6',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://step.finance/',
      twitter: 'https://twitter.com/StepFinance_',
    },
    reduceOnly: true,
  },
  {
    name: 'Dual Finance Staked SOL',
    symbol: 'dualSOL',
    description: 'The LST to grow onchain options',
    id: 1158,
    active: true,
    mint_address: 'DUAL6T9pATmQUFPYmrWq2BkkGdRxLtERySGScYmbHMER',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: '',
      twitter: 'https://x.com/DualFinance',
    },
    reduceOnly: true,
  },
  {
    name: 'Mango Staked SOL',
    symbol: 'mangoSOL',
    description: 'The juiciest LST to borrow everything & trade anything',
    id: 1162,
    active: true,
    mint_address: 'MangmsBgFqJhW4cLUR9LxfVgMboY1xAoP8UUBiWwwuY',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://mango.markets/',
      twitter: 'https://x.com/mangomarkets',
    },
    reduceOnly: true,
  },
  {
    name: 'Solana Compass Staked SOL',
    symbol: 'compassSOL',
    description:
      'Earn boosted yield from staking yields, MEV tips and priority fees, then put your tokens to work in high performance liquidity pools for even more yield on your SOL.',
    id: 1163,
    active: true,
    mint_address: 'Comp4ssDzXcLeu2MnLuGNNFC4cmLPMng8qWHPvzAMU1h',
    clientContext: 'lst',
    borrowToken: 'SOL',
    links: {
      website: 'https://solanacompass.com/',
      twitter: 'https://twitter.com/SolanaCompass',
    },
    reduceOnly: true,
  },
]

export type ClientContextKeys = 'lst' | 'jlp'

export const STAKEABLE_TOKENS = STAKEABLE_TOKENS_DATA.filter(
  (d) => d.active,
).map((d) => d.symbol)

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

export const ACCEPT_TERMS_KEY = 'termsOfUseAccepted-0.2'
export const YIELD_FANS_INTRO_KEY = 'YieldFansIntro-0.1'

export const TRADE_LAYOUT_KEY = 'tradeLayoutKey-0.1'

export const STATS_TAB_KEY = 'activeStatsTab-0.1'

export const USE_ORDERBOOK_FEED_KEY = 'useOrderbookFeed-0.1'

export const HOT_KEYS_KEY = 'hotKeys-0.1'

export const AUTO_CONNECT_WALLET = 'auto-connect-0.1'

export const LAST_WALLET_NAME = 'lastWalletName'

export const PRIVACY_MODE = 'privacy-mode-0.1'

export const JUPITER_V6_QUOTE_API_MAINNET = 'https://quote-api.jup.ag/v6'

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
  inf: true,
  hubsol: true,
  mangosol: true,
  dualsol: true,
  digitsol: true,
  compasssol: true,
  stepsol: true,
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
