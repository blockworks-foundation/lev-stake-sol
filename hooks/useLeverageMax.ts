import { useMemo } from 'react'
import useMangoGroup from './useMangoGroup'
import { floorToDecimal } from 'utils/numbers'
import { JLP_BORROW_TOKEN, LST_BORROW_TOKEN } from 'utils/constants'
import { getStakableTokensDataForTokenName } from 'utils/tokens'
import { Bank } from '@blockworks-foundation/mango-v4'

export const calcLeverageMax = (
  stakeBank: Bank | undefined,
  borrowBank: Bank | undefined,
  token: string,
) => {
  if (!stakeBank || !borrowBank) return 0
  const borrowInitLiabWeight = borrowBank.scaledInitLiabWeight(borrowBank.price)
  const stakeInitAssetWeight = stakeBank.scaledInitAssetWeight(stakeBank.price)

  if (!borrowInitLiabWeight || !stakeInitAssetWeight) return 1
  const x = stakeInitAssetWeight.toNumber() / borrowInitLiabWeight.toNumber()

  if (getStakableTokensDataForTokenName(token).clientContext === 'jlp') {
    const leverageFactor = 1 / (1 - x)

    const max = floorToDecimal(leverageFactor, 1).toNumber()

    return max * 0.9 // Multiplied by 0.975 because you cant actually get to the end of the infinite geometric series?
  } else {
    const leverageFactor = 1 / (1 - x)

    const max = floorToDecimal(leverageFactor, 2).toNumber()

    return max * 0.9 // Multiplied by 0.975 because you cant actually get to the end of the infinite geometric series?
  }
}

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
    return calcLeverageMax(stakeBank, borrowBank, selectedToken)
  }, [stakeBank, borrowBank, selectedToken])

  return leverageMax
}
