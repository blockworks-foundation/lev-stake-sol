import { useMemo } from 'react'
import useStakeRates from './useStakeRates'
import useMangoGroup from './useMangoGroup'
// import mangoStore from '@store/mangoStore'
import useLeverageMax from './useLeverageMax'

// const set = mangoStore.getState().set

export default function useBankRates(selectedToken: string, leverage: number) {
  const { data: stakeRates } = useStakeRates()
  const { group } = useMangoGroup()

  // const estimatedMaxAPY = mangoStore((s) => s.estimatedMaxAPY.current)
  const leverageMax = useLeverageMax(selectedToken)

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('USDC')?.[0]
  }, [group])

  const stakeBankDepositRate = useMemo(() => {
    return stakeBank ? stakeBank.getDepositRateUi() : 0
  }, [stakeBank])

  const borrowBankBorrowRate = useMemo(() => {
    return borrowBank ? borrowBank.getBorrowRateUi() : 0
  }, [borrowBank])

  const borrowBankStakeRate = useMemo(() => {
    return stakeRates ? stakeRates[selectedToken.toLowerCase()] * 100 : 0
  }, [stakeRates, selectedToken])

  const leveragedAPY = useMemo(() => {
    return borrowBankStakeRate ? borrowBankStakeRate * leverage : 0
  }, [borrowBankStakeRate, leverage])

  const estimatedMaxCollateralFee = useMemo(() => {
    if(!stakeBank) return 0
    return (stakeBank?.collateralFeePerDay * 365 * 100)
  }, [stakeBank])

  const collateralFeeAPY = useMemo(() => {
    if (!stakeBank) return 0
    const assetsCovered = ( (leverage - 1)) / leverage * Number(stakeBank?.maintAssetWeight)
    const collateralFeeUI = estimatedMaxCollateralFee * assetsCovered * leverage
    return collateralFeeUI
  }, [stakeBank, leverage, estimatedMaxCollateralFee])

  const estimatedNetAPY = useMemo(() => {
    return (
      borrowBankStakeRate * leverage - borrowBankBorrowRate * (leverage - 1) - collateralFeeAPY
    )
  }, [borrowBankStakeRate, leverage, borrowBankBorrowRate, collateralFeeAPY])

  // useEffect(() => {
  //   set((s) => {
  //     s.estimatedMaxAPY.current =
  //       borrowBankStakeRate * leverageMax -
  //       borrowBankBorrowRate * (leverageMax - 1)
  //   })
  // }, [borrowBankStakeRate, borrowBankBorrowRate, leverageMax])

  const estimatedMaxAPY = useMemo(() => {
    return (
      borrowBankStakeRate * leverageMax - borrowBankBorrowRate * (leverageMax - 1)
    )
  }, [borrowBankStakeRate, borrowBankBorrowRate, leverageMax])

  return {
    stakeBankDepositRate,
    borrowBankBorrowRate,
    borrowBankStakeRate,
    leveragedAPY,
    estimatedNetAPY,
    estimatedMaxAPY,
    collateralFeeAPY
  }
}
