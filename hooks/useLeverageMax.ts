import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'
import { floorToDecimal } from 'utils/numbers'
import {
  JLP_BORROW_TOKEN,
  LST_BORROW_TOKEN,
  STAKEABLE_TOKENS_DATA,
} from 'utils/constants'

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

    const borrowInitLiabWeight = borrowBank.scaledInitLiabWeight(
      borrowBank.price,
    )
    const stakeInitAssetWeight = stakeBank.scaledInitAssetWeight(
      stakeBank.price,
    )

    if (!borrowInitLiabWeight || !stakeInitAssetWeight) return 1
    const x = stakeInitAssetWeight.toNumber() / borrowInitLiabWeight.toNumber()

    if (
      STAKEABLE_TOKENS_DATA.find((x) => x.name === selectedToken)
        ?.clientContext === 'jlp'
    ) {
      const leverageFactor = 1 / (1 - x)

      const max = floorToDecimal(leverageFactor, 1).toNumber()

      return max * 0.9 // Multiplied by 0.975 because you cant actually get to the end of the infinite geometric series?
    } else {
      const conversionRate = borrowBank.uiPrice / stakeBank.uiPrice

      const y = 1 - conversionRate * stakeInitAssetWeight.toNumber()

      const max = floorToDecimal(1 + (x / y) * 0.9, 1).toNumber()

      return max
    }
  }, [stakeBank, borrowBank, selectedToken])

  return leverageMax
}
