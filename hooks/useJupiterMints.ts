import mangoStore, { CLUSTER } from '@store/mangoStore'
import { useQuery } from '@tanstack/react-query'
import useMangoGroup from 'hooks/useMangoGroup'
import { Token } from 'types/jupiter'
import { JUPITER_API_DEVNET, JUPITER_API_MAINNET } from 'utils/constants'

const fetchJupiterTokens = async () => {
  const { jlpGroup, lstGroup } = mangoStore.getState().group
  if (!jlpGroup || !lstGroup) return
  const url = CLUSTER === 'devnet' ? JUPITER_API_DEVNET : JUPITER_API_MAINNET
  const response = await fetch(url)
  const data: Token[] = await response.json()

  const jlpBankMints = Array.from(jlpGroup.banksMapByName.values()).map((b) =>
    b[0].mint.toString(),
  )
  const lstBankMints = Array.from(lstGroup.banksMapByName.values()).map((b) =>
    b[0].mint.toString(),
  )
  const mangoTokens = data.filter(
    (t) => jlpBankMints.includes(t.address) || lstBankMints.includes(t.address),
  )

  return {
    mangoTokens,
    jupiterTokens: data,
  }
}

const useJupiterMints = (): {
  mangoTokens: Token[]
  jupiterTokens: Token[]
  isFetching: boolean
} => {
  const { jlpGroup, lstGroup } = useMangoGroup()

  const res = useQuery(['jupiter-mango-tokens'], () => fetchJupiterTokens(), {
    cacheTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
    retry: 3,
    enabled: !!(jlpGroup && lstGroup),
    refetchOnWindowFocus: false,
  })

  return {
    mangoTokens: res?.data?.mangoTokens || [],
    jupiterTokens: res?.data?.jupiterTokens || [],
    isFetching: res?.isFetching || false,
  }
}

export default useJupiterMints
