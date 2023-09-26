import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'

export default function useLeverageMax(selectedToken: string) {
  const { group } = useMangoGroup()

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('SOL')?.[0]
  }, [group])

  const leverageMax = useMemo(() => {
    if (!stakeBank || !borrowBank) return 1
    const borrowInitLiabWeight = borrowBank.scaledInitLiabWeight(
      borrowBank.price,
    )
    const stakeInitAssetWeight = stakeBank.scaledInitAssetWeight(
      stakeBank.price,
    )
    if (!borrowInitLiabWeight || !stakeInitAssetWeight) return 1

    const x = stakeInitAssetWeight.div(borrowInitLiabWeight).toNumber()
    const conversionRate = borrowBank.uiPrice / stakeBank.uiPrice
    const y = 1 - conversionRate * stakeInitAssetWeight.toNumber()
    return 1 + x / y
  }, [stakeBank, borrowBank])

  return leverageMax
}
