import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'
import { floorToDecimal } from 'utils/numbers'

export default function useLeverageMax(selectedToken: string) {
  const { group } = useMangoGroup()

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('USDC')?.[0]
  }, [group])

  const leverageMax = useMemo(() => {
    if (!stakeBank || !borrowBank) return 0

    const borrowInitLiabWeight = borrowBank.initLiabWeight
    const stakeInitAssetWeight = stakeBank.initAssetWeight
    
    if (!borrowInitLiabWeight || !stakeInitAssetWeight) return 1

    const x = stakeInitAssetWeight.toNumber() / borrowInitLiabWeight.toNumber()

    const leverageFactor = 1 / (1 - x)

    const max = floorToDecimal(leverageFactor, 1).toNumber()

    return max
  }, [stakeBank, borrowBank])

  return leverageMax
}
