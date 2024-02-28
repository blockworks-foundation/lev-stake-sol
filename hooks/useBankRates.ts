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

    let borrowMultiplier = leverage - 1;
    let depositMultiplier = leverage;

    let collectedCollateralFees = 0
    let collectedReturns = 0

    const maintAssetWeight = Number(stakeBank?.maintAssetWeight);
    const collateralFeePerDay = Number(stakeBank?.collateralFeePerDay);
    const borrowFeeRatePerDay = 1 + Number(borrowBankBorrowRate) / 365;
    const jlpStakeRatePerDay = ((jlpStakeRateAPY + 1) ** (1 / 365));

    for (let day = 1; day <= 365; day++) {

      // Collateral Fee Multiplier
      const collateralFeeMultiplier = borrowMultiplier / (depositMultiplier * maintAssetWeight);
      const multipliedCollateralFeeRatePerDay = collateralFeeMultiplier * collateralFeePerDay;

      // USDC Liabilities Multiplier
      borrowMultiplier =  borrowMultiplier * borrowFeeRatePerDay;
      
      // Daily Collateral Fees  
      collectedCollateralFees += (multipliedCollateralFeeRatePerDay) * depositMultiplier
      collectedReturns += (jlpStakeRatePerDay - 1) * depositMultiplier
      depositMultiplier = depositMultiplier * jlpStakeRatePerDay;
      depositMultiplier = depositMultiplier - (multipliedCollateralFeeRatePerDay * depositMultiplier);
    }

    // APY's for the calculation
    const depositAPY = collectedReturns * 100; // Composed of the below two
    const collateralFeeAPY =  collectedCollateralFees * 100;
    const collectedReturnsAPY =  (collectedReturns) * 100;
    
    // Interest Fee APY: Reflecting borrowing cost as an annual percentage yield
    const interestCost = (borrowMultiplier - (leverage - 1)); // APY on interest
    const borrowsAPY = 100 * interestCost; 

    // Total APY taking into account interest, collateral fees and returns
    const APY = 100 * ((depositMultiplier - borrowMultiplier) - 1)

    // Comparisons to outside
    const nonMangoAPY = jlpStakeRateAPY * leverage * 100;
    const diffToNonMango = (depositAPY - nonMangoAPY);
    const diffToNonLeveraged = (depositAPY - (jlpStakeRateAPY * 100));
  
    return { APY, depositAPY, collectedReturnsAPY, collateralFeeAPY, borrowsAPY, nonMangoAPY, diffToNonMango, diffToNonLeveraged };
  }, [leverage, borrowBankBorrowRate, jlpStakeRateAPY, stakeBank?.collateralFeePerDay, stakeBank?.maintAssetWeight ]);

  const estimatedMaxAPY = useMemo(() => {
    return (
      jlpStakeRateAPY * leverageMax - Number(borrowBankBorrowRate) * (leverageMax - 1)
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
