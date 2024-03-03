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
    return stakeBank ? stakeBank.getDepositRate() : 0
  }, [stakeBank])

  const borrowBankBorrowRate = useMemo(() => {
    return borrowBank ? Number(borrowBank.getBorrowRate()) : 0
  }, [borrowBank])

  const jlpStakeRateAPY = useMemo(() => {
    return stakeRates ? stakeRates[selectedToken.toLowerCase()] : 0
  }, [stakeRates, selectedToken])

  const financialMetrics = useMemo(() => {
    // Collateral fee is charged on the assets needed to back borrows and
    // 1 deposited JLP can back maintAssetWeight * (1 JLP-value) USDC borrows.
    const collateralFeePerBorrowPerDay =
      Number(stakeBank?.collateralFeePerDay) /
      Number(stakeBank?.maintAssetWeight)

    // Convert the borrow APR to a daily rate
    const borrowRatePerDay = Number(borrowBankBorrowRate) / 365

    // Convert the JLP APY to a daily rate
    const jlpRatePerDay = (1 + jlpStakeRateAPY) ** (1 / 365) - 1

    // Assume the user deposits 1 JLP, then these are the starting deposits and
    // borrows for the desired leverage (in terms of starting-value JLP)
    const initialBorrows = leverage - 1
    const initialDeposits = leverage

    // In the following, we'll simulate time passing and how the deposits and
    // borrows evolve.
    // Note that these will be in terms of starting-value JLP, meaning that JLP
    // price increases will be modelled as deposits increasing in amount.
    let borrows = initialBorrows
    let deposits = initialDeposits

    let collectedCollateralFees = 0
    let collectedReturns = 0

    for (let day = 1; day <= 365; day++) {
      borrows *= 1 + borrowRatePerDay

      const collateralFees = collateralFeePerBorrowPerDay * borrows
      deposits -= collateralFees
      collectedCollateralFees += collateralFees

      const jlpReturns = jlpRatePerDay * deposits
      deposits += jlpReturns
      collectedReturns += jlpReturns
    }

    // APY's for the calculation
    const depositAPY = (deposits - initialDeposits) * 100
    const collateralFeeAPY = collectedCollateralFees * 100
    const collectedReturnsAPY = collectedReturns * 100

    // Interest Fee APY: Reflecting borrowing cost as an annual percentage yield
    const borrowsAPY = (borrows - initialBorrows) * 100

    // Total APY, comparing the end value (deposits - borrows) to the starting value (1)
    const APY = (deposits - borrows - 1) * 100

    // Comparisons to outside
    const nonMangoAPY = jlpStakeRateAPY * leverage * 100
    const diffToNonMango = APY - nonMangoAPY
    const diffToNonLeveraged = APY - jlpStakeRateAPY * 100

    return {
      APY,
      depositAPY,
      collectedReturnsAPY,
      collateralFeeAPY,
      borrowsAPY,
      nonMangoAPY,
      diffToNonMango,
      diffToNonLeveraged,
    }
  }, [
    leverage,
    borrowBankBorrowRate,
    jlpStakeRateAPY,
    stakeBank?.collateralFeePerDay,
    stakeBank?.maintAssetWeight,
  ])

  const estimatedMaxAPY = useMemo(() => {
    return (
      jlpStakeRateAPY * leverageMax -
      Number(borrowBankBorrowRate) * (leverageMax - 1)
    )
  }, [jlpStakeRateAPY, borrowBankBorrowRate, leverageMax])

  return {
    financialMetrics,
    stakeBankDepositRate,
    borrowBankBorrowRate,
    jlpStakeRateAPY,
    estimatedMaxAPY,
  }
}
