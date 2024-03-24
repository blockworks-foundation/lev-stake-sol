import { useCallback, useEffect } from 'react'
import mangoStore from '@store/mangoStore'
import { Keypair } from '@solana/web3.js'
import useMangoAccount from 'hooks/useMangoAccount'
import useInterval from './shared/useInterval'
import {
  LAST_WALLET_NAME,
  PRIORITY_FEE_KEY,
  SECONDS,
  STAKEABLE_TOKENS_DATA,
} from 'utils/constants'
import useNetworkSpeed from 'hooks/useNetworkSpeed'
import { useWallet } from '@solana/wallet-adapter-react'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { DEFAULT_PRIORITY_FEE_LEVEL } from './settings/RpcSettings'

const set = mangoStore.getState().set
const actions = mangoStore.getState().actions

const HydrateStore = () => {
  const { mangoAccountPk } = useMangoAccount()
  const selectedToken = mangoStore((s) => s.selectedToken)
  const clientContext = STAKEABLE_TOKENS_DATA.find(
    (x) => x.name === selectedToken,
  )!.clientContext

  const connection = mangoStore((s) => s.connection)

  const slowNetwork = useNetworkSpeed()
  const { wallet } = useWallet()

  const [, setLastWalletName] = useLocalStorageState(LAST_WALLET_NAME, '')

  const handleWindowResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      set((s) => {
        s.window.width = window.innerWidth
        s.window.height = window.innerHeight
      })
    }
  }, [])
  // store the window width and height on resize
  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  useEffect(() => {
    if (wallet?.adapter) {
      setLastWalletName(wallet?.adapter.name)
    }
  }, [wallet, setLastWalletName])

  useEffect(() => {
    actions.fetchGroup()
  }, [])

  useInterval(
    () => {
      actions.fetchGroup()
      actions.reloadMangoAccount(clientContext)
    },
    (slowNetwork ? 60 : 20) * SECONDS,
  )

  // refetches open orders every 30 seconds
  // only the selected market's open orders are updated via websocket
  // useInterval(
  //   () => {
  //     if (mangoAccountAddress) {
  //       actions.fetchOpenOrders()
  //     }
  //   },
  //   (slowNetwork ? 60 : 30) * SECONDS,
  // )

  // refetch trade history and activity feed when switching accounts
  // useEffect(() => {
  //   const actions = mangoStore.getState().actions
  //   if (mangoAccountAddress) {
  //     actions.fetchActivityFeed(mangoAccountAddress)
  //   }
  // }, [mangoAccountAddress])

  // reload and parse market fills from the event queue
  // useInterval(
  //   async () => {
  //     const actions = mangoStore.getState().actions
  //     actions.loadMarketFills()
  //   },
  //   (slowNetwork ? 60 : 20) * SECONDS,
  // )

  // estimate the priority fee every 30 seconds
  useInterval(
    async () => {
      if (wallet?.adapter.publicKey) {
        const priorityFeeMultiplier = Number(
          localStorage.getItem(PRIORITY_FEE_KEY) ??
            DEFAULT_PRIORITY_FEE_LEVEL.value,
        )
        actions.estimatePriorityFee(priorityFeeMultiplier)
      }
    },
    (slowNetwork ? 60 : 10) * SECONDS,
  )

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Keypair().publicKey, () => {
      return
    })
    return () => {
      connection.removeAccountChangeListener(id)
    }
  }, [connection])

  // watch selected Mango Account for changes
  useEffect(() => {
    const client = mangoStore.getState().client[clientContext]
    if (!mangoAccountPk) return
    const subscriptionId = connection.onAccountChange(
      mangoAccountPk,
      async (info, context) => {
        if (info?.lamports === 0) return

        const mangoAccount = mangoStore.getState().mangoAccount.current
        if (!mangoAccount) return
        const newMangoAccount = client.getMangoAccountFromAi(
          mangoAccount.publicKey,
          info,
        )
        // don't fetch serum3OpenOrders if the slot is old
        if (context.slot > mangoStore.getState().mangoAccount.lastSlot) {
          if (newMangoAccount.serum3Active().length > 0) {
            // await newMangoAccount.reloadSerum3OpenOrders(client)
            // check again that the slot is still the most recent after the reloading open orders
            if (context.slot > mangoStore.getState().mangoAccount.lastSlot) {
              set((s) => {
                s.mangoAccount.current = newMangoAccount
                s.mangoAccount.lastSlot = context.slot
              })
            }
          }
          // actions.fetchOpenOrders()
        }
      },
    )

    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [connection, mangoAccountPk, clientContext])

  return null
}

const MangoProvider = () => {
  return (
    <>
      <HydrateStore />
    </>
  )
}

export default MangoProvider
