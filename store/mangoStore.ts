import dayjs from 'dayjs'
import produce from 'immer'
import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { AnchorProvider, Wallet, web3 } from '@coral-xyz/anchor'
import { OpenOrders, Order } from '@project-serum/serum/lib/market'
import { Orderbook } from '@project-serum/serum'
import { Wallet as WalletAdapter } from '@solana/wallet-adapter-react'
import {
  MangoClient,
  Group,
  MangoAccount,
  Serum3Market,
  Bank,
  PerpOrder,
  PerpPosition,
  BookSide,
  ParsedFillEvent,
  MANGO_V4_ID,
} from '@blockworks-foundation/mango-v4'

import EmptyWallet from '../utils/wallet'
import { TransactionNotification, notify } from '../utils/notifications'
import {
  getTokenAccountsByOwnerWithWrappedSol,
  TokenAccount,
} from '../utils/tokens'
import {
  BOOST_ACCOUNT_PREFIX,
  BOOST_DATA_API_URL,
  CONNECTION_COMMITMENT,
  ClientContextKeys,
  MANGO_DATA_API_URL,
  PAGINATION_PAGE_LENGTH,
  RPC_PROVIDER_KEY,
  SWAP_MARGIN_KEY,
} from '../utils/constants'
import {
  ActivityFeed,
  EmptyObject,
  OrderbookL2,
  PerpStatsItem,
  PerpTradeHistory,
  SerumEvent,
  SpotBalances,
  SpotTradeHistory,
  SwapHistoryItem,
  TotalInterestDataItem,
  TradeForm,
  TokenStatsItem,
  TourSettings,
  ProfileDetails,
  MangoTokenStatsItem,
  ThemeData,
  PositionStat,
  OrderbookTooltip,
} from 'types'
import { PerpMarket } from '@blockworks-foundation/mango-v4/'
import {
  DEFAULT_PRIORITY_FEE,
  TRITON_DEDICATED_URL,
} from '@components/settings/RpcSettings'
import { themeData } from 'utils/theme'
import { Token } from 'types/jupiter'
import { sleep } from 'utils'
import { ConfirmOptions, Connection, Keypair, PublicKey } from '@solana/web3.js'

const MANGO_BOOST_ID = new PublicKey(
  'zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25',
)

export const LITE_RPC_URL = `https://rpc.mngo.cloud/kqy2ep1ovw9g/`
const backupConnections = [
  new Connection(LITE_RPC_URL, 'recent'),
  new Connection(
    'https://idalina-qy4oxi-fast-mainnet.helius-rpc.com/',
    'recent',
  ),
]

const GROUP_JLP = new PublicKey('AKeMSYiJekyKfwCc3CUfVNDVAiqk9FfbQVMY3G7RUZUf')
const GROUP_V1 = new PublicKey('78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX')

const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    url: process.env.NEXT_PUBLIC_ENDPOINT || TRITON_DEDICATED_URL,
    websocket: process.env.NEXT_PUBLIC_ENDPOINT || TRITON_DEDICATED_URL,
    custom: false,
  },
  {
    name: 'devnet',
    url: 'https://realms-develope-935c.devnet.rpcpool.com/67f608dc-a353-4191-9c34-293a5061b536',
    websocket:
      'https://realms-develope-935c.devnet.rpcpool.com/67f608dc-a353-4191-9c34-293a5061b536',
    custom: false,
  },
]

const options = {
  ...AnchorProvider.defaultOptions(),
  preflightCommitment: 'confirmed',
} as ConfirmOptions
export const CLUSTER: 'mainnet-beta' | 'devnet' = 'mainnet-beta'
const ENDPOINT = ENDPOINTS.find((e) => e.name === CLUSTER) || ENDPOINTS[0]
export const emptyWallet = new EmptyWallet(Keypair.generate())

const initMangoClient = (
  provider: AnchorProvider,
  opts = {
    prioritizationFee: DEFAULT_PRIORITY_FEE,
    fallbackOracleConfig: 'dynamic',
    multipleConnections: backupConnections,
  },
): { lst: MangoClient; jlp: MangoClient } => {
  return {
    lst: MangoClient.connect(provider, CLUSTER, MANGO_V4_ID['mainnet-beta'], {
      prioritizationFee: opts.prioritizationFee,
      fallbackOracleConfig: 'dynamic',
      multipleConnections: opts.multipleConnections,
      idsSource: 'api',
      postSendTxCallback: ({ txid }: { txid: string }) => {
        notify({
          title: 'Transaction sent',
          description: 'Waiting for confirmation',
          type: 'confirm',
          txid: txid,
        })
      },
    }),
    jlp: MangoClient.connect(provider, CLUSTER, MANGO_BOOST_ID, {
      prioritizationFee: opts.prioritizationFee,
      fallbackOracleConfig: 'dynamic',
      multipleConnections: opts.multipleConnections,
      idsSource: 'get-program-accounts',
      postSendTxCallback: ({ txid }: { txid: string }) => {
        notify({
          title: 'Transaction sent',
          description: 'Waiting for confirmation',
          type: 'confirm',
          txid: txid,
        })
      },
    }),
  }
}

export const DEFAULT_TRADE_FORM: TradeForm = {
  side: 'buy',
  price: undefined,
  baseSize: '',
  quoteSize: '',
  tradeType: 'Limit',
  triggerPrice: '',
  postOnly: false,
  ioc: false,
  reduceOnly: false,
}

export type ActiveTab = 'Earn' | 'Positions' | 'Activity'

export type MangoStore = {
  // leverage stake
  activeTab: ActiveTab
  selectedToken: string
  estimatedMaxAPY: {
    current: number
  }
  submittingBoost: boolean
  //end
  activityFeed: {
    feed: Array<ActivityFeed>
    loading: boolean
    queryParams: string
  }
  connected: boolean
  connection: Connection
  group: { jlp: Group | undefined; lst: Group | undefined }
  groupLoaded: boolean
  client: { jlp: MangoClient; lst: MangoClient }
  showUserSetup: boolean
  leverage: number
  mangoAccount: {
    current: MangoAccount | undefined
    initialLoad: boolean
    lastSlot: number
    openOrderAccounts: OpenOrders[]
    openOrders: Record<string, Order[] | PerpOrder[]>
    perpPositions: PerpPosition[]
    spotBalances: SpotBalances
    interestTotals: { data: TotalInterestDataItem[]; loading: boolean }
    swapHistory: {
      data: SwapHistoryItem[]
      initialLoad: boolean
      loading: boolean
    }
    tradeHistory: {
      data: Array<SpotTradeHistory | PerpTradeHistory>
      loading: boolean
    }
  }
  mangoAccounts: MangoAccount[]
  markets: Serum3Market[] | undefined
  transactionNotificationIdCounter: number
  transactionNotifications: Array<TransactionNotification>
  perpMarkets: PerpMarket[]
  perpStats: {
    loading: boolean
    data: PerpStatsItem[] | null
    positions: {
      initialLoad: boolean
      loading: boolean
      largest: PositionStat[]
      closestToLiq: PositionStat[]
    }
  }
  orderbookTooltip: OrderbookTooltip | undefined
  profile: {
    details: ProfileDetails | null
    loadDetails: boolean
  }
  priorityFee: number
  selectedMarket: {
    name: string | undefined
    current: Serum3Market | PerpMarket | undefined
    fills: (ParsedFillEvent | SerumEvent)[]
    bidsAccount: BookSide | Orderbook | undefined
    asksAccount: BookSide | Orderbook | undefined
    orderbook: OrderbookL2
    markPrice: number
    lastSeenSlot: {
      bids: number
      asks: number
    }
  }
  serumMarkets: Serum3Market[]
  serumOrders: Order[] | undefined
  settings: {
    loading: boolean
    tours: TourSettings
    uiLocked: boolean
  }
  successAnimation: {
    swap: boolean
    theme: boolean
    trade: boolean
  }
  swap: {
    inputBank: Bank | undefined
    outputBank: Bank | undefined
    inputTokenInfo: Token | undefined
    outputTokenInfo: Token | undefined
    margin: boolean
    slippage: number
    swapMode: 'ExactIn' | 'ExactOut'
    amountIn: string
    amountOut: string
    flipPrices: boolean
  }
  set: (x: (x: MangoStore) => void) => void
  themeData: ThemeData
  tokenStats: {
    initialLoad: boolean
    loading: boolean
    data: TokenStatsItem[] | null
    mangoStats: MangoTokenStatsItem[]
  }
  tradeForm: TradeForm
  wallet: {
    tokens: TokenAccount[]
  }
  window: {
    width: number
    height: number
  }
  actions: {
    fetchAccountInterestTotals: (mangoAccountPk: string) => Promise<void>
    fetchActivityFeed: (
      mangoAccountPk: string,
      offset?: number,
      params?: string,
      limit?: number,
    ) => Promise<void>
    fetchGroup: () => Promise<void>
    reloadMangoAccount: (
      clientContext: ClientContextKeys,
      slot?: number,
    ) => Promise<void>
    fetchMangoAccounts: (ownerPk: PublicKey) => Promise<void>
    fetchProfileDetails: (walletPk: string) => void
    fetchSwapHistory: (
      mangoAccountPk: string,
      timeout?: number,
      offset?: number,
      limit?: number,
    ) => Promise<void>
    fetchWalletTokens: (walletPk: PublicKey) => Promise<void>
    connectMangoClientWithWallet: (wallet: WalletAdapter) => Promise<void>
    updateConnection: (url: string) => void
    updateFee: (fee: number) => Promise<void>
  }
}

const mangoStore = create<MangoStore>()(
  subscribeWithSelector((_set, get) => {
    let rpcUrl = ENDPOINT.url
    let swapMargin = true

    if (typeof window !== 'undefined' && CLUSTER === 'mainnet-beta') {
      const urlFromLocalStorage = localStorage.getItem(RPC_PROVIDER_KEY)
      const swapMarginFromLocalStorage = localStorage.getItem(SWAP_MARGIN_KEY)
      rpcUrl = urlFromLocalStorage
        ? JSON.parse(urlFromLocalStorage)
        : ENDPOINT.url
      swapMargin = swapMarginFromLocalStorage
        ? JSON.parse(swapMarginFromLocalStorage)
        : true
    }

    let connection: Connection
    try {
      connection = new web3.Connection(rpcUrl, CONNECTION_COMMITMENT)
    } catch {
      connection = new web3.Connection(ENDPOINT.url, CONNECTION_COMMITMENT)
    }
    const provider = new AnchorProvider(connection, emptyWallet, options)
    provider.opts.skipPreflight = true
    const priorityFee = get()?.priorityFee ?? DEFAULT_PRIORITY_FEE
    const client = initMangoClient(provider, {
      prioritizationFee: priorityFee,
      fallbackOracleConfig: 'dynamic',
      multipleConnections: backupConnections,
    })

    return {
      // leverage stake
      activeTab: 'Earn',
      selectedToken: '',
      estimatedMaxAPY: {
        current: 0,
      },
      submittingBoost: false,
      //end
      activityFeed: {
        feed: [],
        loading: true,
        queryParams: '',
      },
      connected: false,
      connection,
      group: { jlp: undefined, lst: undefined },
      groupLoaded: false,
      client,
      showUserSetup: false,
      leverage: 1,
      mangoAccount: {
        current: undefined,
        initialLoad: true,
        lastSlot: 0,
        openOrderAccounts: [],
        openOrders: {},
        perpPositions: [],
        spotBalances: {},
        interestTotals: { data: [], loading: false },
        swapHistory: { data: [], loading: true, initialLoad: true },
        tradeHistory: { data: [], loading: true },
      },
      mangoAccounts: [],
      markets: undefined,
      transactionNotificationIdCounter: 0,
      transactionNotifications: [],
      perpMarkets: [],
      perpStats: {
        loading: false,
        data: [],
        positions: {
          initialLoad: true,
          loading: true,
          largest: [],
          closestToLiq: [],
        },
      },
      orderbookTooltip: undefined,
      profile: {
        loadDetails: false,
        details: { profile_name: '', trader_category: '', wallet_pk: '' },
      },
      priorityFee: DEFAULT_PRIORITY_FEE,
      selectedMarket: {
        name: 'SOL/USDC',
        current: undefined,
        fills: [],
        bidsAccount: undefined,
        asksAccount: undefined,
        lastSeenSlot: {
          bids: 0,
          asks: 0,
        },
        orderbook: {
          bids: [],
          asks: [],
        },
        markPrice: 0,
      },
      serumMarkets: [],
      serumOrders: undefined,
      set: (fn) => _set(produce(fn)),
      settings: {
        loading: false,
        tours: {
          account_tour_seen: true,
          swap_tour_seen: true,
          trade_tour_seen: true,
          wallet_pk: '',
        },
        uiLocked: true,
      },
      successAnimation: {
        swap: false,
        theme: false,
        trade: false,
      },
      swap: {
        inputBank: undefined,
        outputBank: undefined,
        inputTokenInfo: undefined,
        outputTokenInfo: undefined,
        margin: swapMargin,
        slippage: 0.5,
        swapMode: 'ExactIn',
        amountIn: '',
        amountOut: '',
        flipPrices: false,
      },
      themeData: themeData.default,
      tokenStats: {
        initialLoad: false,
        loading: true,
        data: [],
        mangoStats: [],
      },
      tradeForm: DEFAULT_TRADE_FORM,
      tradingView: {
        orderLines: new Map(),
        tradeExecutions: new Map(),
      },
      wallet: {
        tokens: [],
      },
      window: {
        width: 0,
        height: 0,
      },
      actions: {
        fetchAccountInterestTotals: async (mangoAccountPk: string) => {
          const set = get().set
          set((state) => {
            state.mangoAccount.interestTotals.loading = true
          })
          try {
            const response = await fetch(
              `${MANGO_DATA_API_URL}/stats/interest-account-total?mango-account=${mangoAccountPk}`,
            )
            const parsedResponse:
              | Omit<TotalInterestDataItem, 'symbol'>[]
              | null = await response.json()
            if (parsedResponse) {
              const entries: [string, Omit<TotalInterestDataItem, 'symbol'>][] =
                Object.entries(parsedResponse).sort((a, b) =>
                  b[0].localeCompare(a[0]),
                )

              const stats: TotalInterestDataItem[] = entries
                .map(([key, value]) => {
                  return { ...value, symbol: key }
                })
                .filter((x) => x)

              set((state) => {
                state.mangoAccount.interestTotals.data = stats
                state.mangoAccount.interestTotals.loading = false
              })
            }
          } catch {
            set((state) => {
              state.mangoAccount.interestTotals.loading = false
            })
            console.error({
              title: 'Failed to load account interest totals',
              type: 'error',
            })
          }
        },
        fetchActivityFeed: async (
          mangoAccountPk: string,
          offset = 0,
          params = '',
          limit = PAGINATION_PAGE_LENGTH,
        ) => {
          const set = get().set
          const loadedFeed = mangoStore.getState().activityFeed.feed

          try {
            const response = await fetch(
              `${BOOST_DATA_API_URL}/stats/activity-feed?mango-account=${mangoAccountPk}&offset=${offset}&limit=${limit}${
                params ? params : ''
              }`,
            )
            const parsedResponse: null | EmptyObject | Array<ActivityFeed> =
              await response.json()

            if (Array.isArray(parsedResponse)) {
              const entries = Object.entries(parsedResponse).sort((a, b) =>
                b[0].localeCompare(a[0]),
              )

              const latestFeed = entries
                .map(([key, value]) => {
                  // ETH should be renamed to ETH (Portal) in the database
                  const symbol = value.activity_details.symbol
                  if (symbol === 'ETH') {
                    value.activity_details.symbol = 'ETH (Portal)'
                  }
                  return {
                    ...value,
                    symbol: key,
                  }
                })
                .sort(
                  (a, b) =>
                    dayjs(b.block_datetime).unix() -
                    dayjs(a.block_datetime).unix(),
                )

              // only add to current feed if data request is offset and the mango account hasn't changed
              const combinedFeed =
                offset !== 0 ? loadedFeed.concat(latestFeed) : latestFeed

              set((state) => {
                state.activityFeed.feed = combinedFeed
              })
            }
          } catch (e) {
            console.error('Failed to fetch account activity feed', e)
          } finally {
            set((state) => {
              state.activityFeed.loading = false
            })
          }
        },
        fetchGroup: async () => {
          try {
            const set = get().set
            const client = get().client
            const lstGroup = await client.lst.getGroup(GROUP_V1)
            const jlpGroup = await client.jlp.getGroup(GROUP_JLP)

            set((state) => {
              state.group.jlp = jlpGroup
              state.group.lst = lstGroup
              state.groupLoaded = true
            })
          } catch (e) {
            notify({ type: 'info', title: 'Unable to refresh data' })
            console.error('Error fetching groups', e)
          }
        },
        reloadMangoAccount: async (clientContext, confirmationSlot) => {
          const set = get().set
          const actions = get().actions
          try {
            const group = get().group
            const client = get().client
            const mangoAccount = get().mangoAccount.current
            if (!group) throw new Error('Group not loaded')
            if (!mangoAccount) return

            const { value: reloadedMangoAccount, slot } =
              await mangoAccount.reloadWithSlot(client[clientContext])

            const lastSlot = get().mangoAccount.lastSlot
            if (
              !confirmationSlot ||
              (confirmationSlot && slot > confirmationSlot)
            ) {
              if (slot > lastSlot) {
                const ma = get().mangoAccounts.find((ma) =>
                  ma.publicKey.equals(reloadedMangoAccount.publicKey),
                )
                if (ma) {
                  Object.assign(ma, reloadedMangoAccount)
                }
                set((state) => {
                  state.mangoAccount.current = reloadedMangoAccount
                  state.mangoAccount.lastSlot = slot
                })
              }
            } else if (confirmationSlot && slot < confirmationSlot) {
              await actions.reloadMangoAccount(clientContext, confirmationSlot)
              await sleep(100)
            }
          } catch (e) {
            console.error('Error reloading mango acct', e)
          } finally {
            set((state) => {
              state.mangoAccount.initialLoad = false
            })
          }
        },
        fetchMangoAccounts: async (ownerPk: PublicKey) => {
          const set = get().set
          try {
            const jlpGroup = get().group.jlp
            const lstGroup = get().group.lst
            const selectedToken = get().selectedToken
            const client = get().client

            const selectedMangoAccount = get().mangoAccount.current
            if (!jlpGroup) throw new Error('JLP group not loaded')
            if (!lstGroup) throw new Error('LST group not loaded')
            if (!client) throw new Error('Client not loaded')

            const [
              jlpOwnerMangoAccounts,
              lstOwnerMangoAccounts,
              jlpDelegateAccounts,
              lstDelegateAccounts,
            ] = await Promise.all([
              client.jlp.getMangoAccountsForOwner(jlpGroup, ownerPk),
              client.lst.getMangoAccountsForOwner(lstGroup, ownerPk),
              client.jlp.getMangoAccountsForDelegate(jlpGroup, ownerPk),
              client.lst.getMangoAccountsForDelegate(lstGroup, ownerPk),
            ])
            const mangoAccounts = [
              ...jlpOwnerMangoAccounts,
              ...lstOwnerMangoAccounts,
              ...jlpDelegateAccounts,
              ...lstDelegateAccounts,
            ]
            console.log('mango accounts: ', mangoAccounts)
            const selectedAccountIsNotInAccountsList = mangoAccounts.find(
              (x) =>
                x.publicKey.toBase58() ===
                selectedMangoAccount?.publicKey.toBase58(),
            )
            if (!mangoAccounts?.length) {
              set((state) => {
                state.mangoAccounts = []
                state.mangoAccount.current = undefined
              })
              return
            }

            let newSelectedMangoAccount = selectedMangoAccount

            if (!selectedMangoAccount || !selectedAccountIsNotInAccountsList) {
              try {
                newSelectedMangoAccount = mangoAccounts.find(
                  (m) =>
                    m.name.toString() ===
                    `${BOOST_ACCOUNT_PREFIX}${selectedToken}`,
                )
              } catch (e) {
                console.error('Error parsing last account', e)
              }
            }
            console.log('newSelectedMangoAccount', newSelectedMangoAccount)

            set((state) => {
              state.mangoAccount.current = newSelectedMangoAccount
              state.mangoAccount.initialLoad = false
            })

            set((state) => {
              state.mangoAccounts = mangoAccounts
            })
          } catch (e) {
            console.error('Error fetching mango accts', e)
          } finally {
            set((state) => {
              state.mangoAccount.initialLoad = false
            })
          }
        },
        fetchSwapHistory: async (
          mangoAccountPk: string,
          timeout = 0,
          offset = 0,
          limit = PAGINATION_PAGE_LENGTH,
        ) => {
          const set = get().set
          const loadedSwapHistory =
            mangoStore.getState().mangoAccount.swapHistory.data

          setTimeout(async () => {
            try {
              const history = await fetch(
                `${MANGO_DATA_API_URL}/stats/swap-history?mango-account=${mangoAccountPk}&offset=${offset}&limit=${limit}`,
              )
              const parsedHistory = await history.json()
              const sortedHistory =
                parsedHistory && parsedHistory.length
                  ? parsedHistory.sort(
                      (a: SwapHistoryItem, b: SwapHistoryItem) =>
                        dayjs(b.block_datetime).unix() -
                        dayjs(a.block_datetime).unix(),
                    )
                  : []

              const combinedHistory =
                offset !== 0
                  ? loadedSwapHistory.concat(sortedHistory)
                  : sortedHistory

              set((state) => {
                state.mangoAccount.swapHistory.data = combinedHistory
              })
            } catch (e) {
              console.error('Unable to fetch swap history', e)
            } finally {
              const notLoaded =
                mangoStore.getState().mangoAccount.swapHistory.initialLoad
              set((state) => {
                state.mangoAccount.swapHistory.loading = false
                if (notLoaded) {
                  state.mangoAccount.swapHistory.initialLoad = false
                }
              })
            }
          }, timeout)
        },
        fetchWalletTokens: async (walletPk: PublicKey) => {
          const set = get().set
          const connection = get().connection

          if (walletPk) {
            try {
              const token = await getTokenAccountsByOwnerWithWrappedSol(
                connection,
                walletPk,
              )

              set((state) => {
                state.wallet.tokens = token
              })
            } catch (e) {
              notify({
                title: 'Failed to refresh wallet balances.',
                type: 'info',
              })
            }
          } else {
            set((state) => {
              state.wallet.tokens = []
            })
          }
        },
        connectMangoClientWithWallet: async (wallet: WalletAdapter) => {
          const set = get().set
          try {
            const provider = new AnchorProvider(
              connection,
              wallet.adapter as unknown as Wallet,
              options,
            )
            provider.opts.skipPreflight = true
            const priorityFee = get()?.priorityFee ?? DEFAULT_PRIORITY_FEE
            const client = initMangoClient(provider, {
              prioritizationFee: priorityFee,
              fallbackOracleConfig: 'dynamic',
              multipleConnections: backupConnections,
            })

            set((s) => {
              s.client = client
            })
          } catch (e) {
            if (e instanceof Error && e.name.includes('WalletLoadError')) {
              notify({
                title: `${wallet.adapter.name} Error`,
                type: 'error',
                description: `Please install ${wallet.adapter.name} and then reload this page.`,
              })
            }
          }
        },
        async fetchProfileDetails(walletPk: string) {
          const set = get().set
          set((state) => {
            state.profile.loadDetails = true
          })
          try {
            const response = await fetch(
              `${MANGO_DATA_API_URL}/user-data/profile-details?wallet-pk=${walletPk}`,
            )
            const data = await response.json()
            set((state) => {
              state.profile.details = data
              state.profile.loadDetails = false
            })
          } catch (e) {
            console.error(e)
            set((state) => {
              state.profile.loadDetails = false
            })
          }
        },
        updateConnection(endpointUrl) {
          const set = get().set
          const client = mangoStore.getState().client
          const newConnection = new web3.Connection(
            endpointUrl,
            CONNECTION_COMMITMENT,
          )
          const oldProvider = client.jlp.program.provider as AnchorProvider
          const newProvider = new AnchorProvider(
            newConnection,
            oldProvider.wallet,
            options,
          )
          newProvider.opts.skipPreflight = true
          const priorityFee = get()?.priorityFee ?? DEFAULT_PRIORITY_FEE
          const newClient = initMangoClient(newProvider, {
            prioritizationFee: priorityFee,
            fallbackOracleConfig: 'dynamic',
            multipleConnections: backupConnections,
          })
          set((state) => {
            state.connection = newConnection
            state.client = newClient
          })
        },
        updateFee: async (feeEstimate) => {
          const set = get().set
          const currentFee = get().priorityFee

          if (currentFee !== feeEstimate) {
            set((state) => {
              state.priorityFee = feeEstimate
            })
          }
        },
      },
    }
  }),
)

export default mangoStore
