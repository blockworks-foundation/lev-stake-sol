import { useQuery } from '@tanstack/react-query'
import { MANGO_DATA_API_URL } from 'utils/constants'
import { ActivityFeed, EmptyObject } from 'types'
import dayjs from 'dayjs'
import useMangoAccount from './useMangoAccount'

const fetchHistory = async (
  mangoAccountPk: string,
): Promise<Array<ActivityFeed> | EmptyObject | null> => {
  const response = await fetch(
    `${MANGO_DATA_API_URL}/stats/activity-feed?mango-account=${mangoAccountPk}&offset=0&limit=1000`,
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

export default function useAccountHistory() {
  const { mangoAccount } = useMangoAccount()
  console.log('mango account in history', mangoAccount)

  const response = useQuery<Array<ActivityFeed> | EmptyObject | null>(
    ['history'],
    () =>
      mangoAccount?.publicKey
        ? fetchHistory(mangoAccount.publicKey.toString())
        : null,
    {
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60,
      retry: 3,
      refetchOnWindowFocus: true,
      enabled: !!mangoAccount,
    },
  )

  return response
}
