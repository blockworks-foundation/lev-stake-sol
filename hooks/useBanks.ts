import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'
import { STAKEABLE_TOKENS } from 'utils/constants'

export default function useBanks() {
  const { jlpGroup, lstGroup } = useMangoGroup()

  const [jlpBanks, lstBanks] = useMemo(() => {
    const jlpBanks = []
    const lstBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const isJlpGroup = token === 'JLP' || token === 'USDC'
      const bank = isJlpGroup
        ? jlpGroup?.banksMapByName.get(token)?.[0]
        : lstGroup?.banksMapByName.get(token)?.[0]
      if (bank !== undefined) {
        isJlpGroup ? jlpBanks.push(bank) : lstBanks.push(bank)
      }
    }
    return [jlpBanks, lstBanks]
  }, [jlpGroup, lstGroup])

  return { jlpBanks, lstBanks }
}
