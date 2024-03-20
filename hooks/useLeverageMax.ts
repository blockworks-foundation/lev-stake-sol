import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'
import { floorToDecimal } from 'utils/numbers'
import { JLP_BORROW_TOKEN, LST_BORROW_TOKEN } from 'utils/constants'

export default function useLeverageMax(selectedToken: string) {
  const { jlpGroup, lstGroup } = useMangoGroup()

  const [stakeBank, borrowBank] = useMemo(() => {
    const isJlpGroup = selectedToken === 'JLP' || selectedToken === 'USDC'
    const stakeBank = isJlpGroup
      ? jlpGroup?.banksMapByName.get(selectedToken)?.[0]
      : lstGroup?.banksMapByName.get(selectedToken)?.[0]
    const borrowBank = isJlpGroup
      ? jlpGroup?.banksMapByName.get(JLP_BORROW_TOKEN)?.[0]
      : lstGroup?.banksMapByName.get(LST_BORROW_TOKEN)?.[0]
    return [stakeBank, borrowBank]
  }, [selectedToken, jlpGroup, lstGroup])

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
