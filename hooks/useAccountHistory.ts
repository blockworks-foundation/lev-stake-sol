import { useQuery } from '@tanstack/react-query'
import { BOOST_DATA_API_URL, STAKEABLE_TOKENS_DATA } from 'utils/constants'
import { ActivityFeed, EmptyObject } from 'types'
import dayjs from 'dayjs'
import useStakeAccounts from './useStakeAccounts'
import { useMemo } from 'react'
import mangoStore from '@store/mangoStore'
import { PublicKey } from '@solana/web3.js'
import useMangoGroup from './useMangoGroup'
import { useWallet } from '@solana/wallet-adapter-react'

const fetchHistory = async (
  mangoAccountPk: string,
): Promise<Array<ActivityFeed> | EmptyObject | null> => {
  const response = await fetch(
    `${BOOST_DATA_API_URL}/stats/activity-feed?mango-account=${mangoAccountPk}&offset=0&limit=1000`,
  )
  const parsedResponse: Array<ActivityFeed> = await response.json()

  if (Array.isArray(parsedResponse)) {
    const activity = parsedResponse
      .map((i) => {
        return {
          ...i,
        }
      })
      .sort(
        (a, b) =>
          dayjs(b.block_datetime).unix() - dayjs(a.block_datetime).unix(),
      )

    // only add to current feed if data request is offset and the mango account hasn't changed
    // const combinedFeed =
    //   offset !== 0 ? loadedFeed.concat(latestFeed) : latestFeed

    return activity
  } else return null
}
const accountNums = STAKEABLE_TOKENS_DATA.map((d) => d.id)

export default function useAccountHistory() {
  const { stakeAccounts } = useStakeAccounts()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const { wallet } = useWallet()

  // const accountPks = stakeAccounts?.map((acc) => acc.publicKey.toString()) || []
  const accountPks = useMemo(() => {
    const client = mangoStore.getState().client
    const payer = wallet?.adapter.publicKey?.toBuffer()
    if (!jlpGroup || !lstGroup || !payer) return []

    const x = accountNums.map((n) => {
      const isJlpGroup = n === 0 || n === 1
      const group = isJlpGroup ? jlpGroup : lstGroup

      const acctNumBuffer = Buffer.alloc(4)
      acctNumBuffer.writeUInt32LE(n)
      const [mangoAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('MangoAccount'),
          group.publicKey.toBuffer(),
          payer,
          acctNumBuffer,
        ],
        client[isJlpGroup ? 'jlp' : 'lst'].program.programId,
      )
      return mangoAccountPda.toString()
    })
    return x
  }, [jlpGroup, lstGroup, wallet])

  const activeStakeAccts =
    stakeAccounts?.map((acc) => acc.publicKey.toString()) ?? []
  const uniqueAccts = [...new Set([...accountPks, ...activeStakeAccts])]

  const response = useQuery<Array<ActivityFeed[] | null> | EmptyObject | null>(
    ['history', ...activeStakeAccts],
    () =>
      stakeAccounts?.length
        ? Promise.all(uniqueAccts.map((act) => fetchHistory(act)))
        : // ? fetchHistory(mangoAccount.publicKey.toString())
          null,
    {
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60,
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!stakeAccounts,
    },
  )

  return {
    refetch: response.refetch,
    history:
      response?.data && Array.isArray(response.data)
        ? response.data
            .flat()
            .filter((n) => n)
            .sort(
              (a, b) =>
                new Date(b.block_datetime).getTime() -
                new Date(a.block_datetime).getTime(),
            )
        : [],
    isLoading: response.isLoading || response.isFetching,
  }
}
