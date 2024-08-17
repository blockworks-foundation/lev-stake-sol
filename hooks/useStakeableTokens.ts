import {
  JLP_BORROW_TOKEN,
  LST_BORROW_TOKEN,
  STAKEABLE_TOKENS_DATA,
  StakeableTokensData,
} from 'utils/constants'
import useStakeRates from './useStakeRates'
import useMangoGroup from './useMangoGroup'
import { Bank } from '@blockworks-foundation/mango-v4'
import { floorToDecimal } from 'utils/numbers'
import { getStakableTokensDataForTokenName } from 'utils/tokens'

type FinancialMetrics = {
  APY: number
  depositAPY: number
  collectedReturnsAPY: number
  collateralFeeAPY: number
  borrowsAPY: number
  nonMangoAPY: number
  diffToNonMango: number
  diffToNonLeveraged: number
}

export type StakeableToken = {
  token: StakeableTokensData
  financialMetrics: FinancialMetrics
  estNetApy: number
}

const getLeverage = (
  stakeBank: Bank | undefined,
  borrowBank: Bank | undefined,
  tokenSymbol: string,
) => {
  if (!stakeBank || !borrowBank) return 0

  const borrowInitLiabWeight = borrowBank.scaledInitLiabWeight(borrowBank.price)
  const stakeInitAssetWeight = stakeBank.scaledInitAssetWeight(stakeBank.price)

  if (!borrowInitLiabWeight || !stakeInitAssetWeight) return 1
  const x = stakeInitAssetWeight.toNumber() / borrowInitLiabWeight.toNumber()

  if (getStakableTokensDataForTokenName(tokenSymbol).clientContext === 'jlp') {
    const leverageFactor = 1 / (1 - x)

    const max = floorToDecimal(leverageFactor, 1).toNumber()

    return max * 0.9 // Multiplied by 0.975 because you cant actually get to the end of the infinite geometric series?
  } else {
    const leverageFactor = 1 / (1 - x)

    const max = floorToDecimal(leverageFactor, 2).toNumber()

    return max * 0.9 // Multiplied by 0.975 because you cant actually get to the end of the infinite geometric series?
  }
}

const getFinancialMetrics = (
  stakeBank: Bank | undefined,
  borrowBank: Bank | undefined,
  leverage: number,
  tokenStakeRateAPY: number,
) => {
  const borrowBankBorrowRate = borrowBank
    ? Number(borrowBank.getBorrowRate())
    : 0
  // Collateral fee is charged on the assets needed to back borrows and
  // 1 deposited JLP can back maintAssetWeight * (1 JLP-value) USDC borrows.
  const collateralFeePerBorrowPerDay =
    Number(stakeBank?.collateralFeePerDay) / Number(stakeBank?.maintAssetWeight)

  // Convert the borrow APR to a daily rate
  const borrowRatePerDay = Number(borrowBankBorrowRate) / 365

  // Convert the JLP APY to a daily rate
  const tokenRatePerDay = (1 + tokenStakeRateAPY) ** (1 / 365) - 1

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

    const tokenReturns = tokenRatePerDay * deposits
    deposits += tokenReturns
    collectedReturns += tokenReturns
  }

  // APY's for the calculation
  const depositAPY = (deposits - initialDeposits) * 100
  const collateralFeeAPY = collectedCollateralFees * 100
  const collectedReturnsAPY = collectedReturns * 100

  // Interest Fee APY: Reflecting borrowing cost as an annual percentage yield
  const borrowsAPY = (borrows - initialBorrows) * 100

  const stakeBankDepositRate = stakeBank ? stakeBank.getDepositRate() : 0
  // Total APY, comparing the end value (deposits - borrows) to the starting value (1)
  const APY = (deposits - borrows - 1) * 100
  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const UiRate = stakeBank
    ? stakeBank.name === 'USDC'
      ? APY_Daily_Compound * 100
      : APY
    : 0

  // Comparisons to outside
  const nonMangoAPY = tokenStakeRateAPY * leverage * 100
  const diffToNonMango = APY - nonMangoAPY
  const diffToNonLeveraged = APY - tokenStakeRateAPY * 100

  return {
    APY: UiRate,
    depositAPY,
    collectedReturnsAPY,
    collateralFeeAPY,
    borrowsAPY,
    nonMangoAPY,
    diffToNonMango,
    diffToNonLeveraged,
  }
}

export default function useStakeableTokens() {
  const { data: stakeRates } = useStakeRates()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const stakeableTokens: StakeableToken[] = []
  for (const token of STAKEABLE_TOKENS_DATA) {
    const { symbol } = token
    const isJlpGroup = symbol === 'JLP' || symbol === 'USDC'
    const stakeBank = isJlpGroup
      ? jlpGroup?.banksMapByName.get(symbol)?.[0]
      : lstGroup?.banksMapByName.get(symbol)?.[0]
    const borrowBank = isJlpGroup
      ? jlpGroup?.banksMapByName.get(JLP_BORROW_TOKEN)?.[0]
      : lstGroup?.banksMapByName.get(LST_BORROW_TOKEN)?.[0]

    const tokenStakeRateAPY = stakeRates ? stakeRates[symbol.toLowerCase()] : 0

    const leverage = getLeverage(stakeBank, borrowBank, symbol)
    const financialMetrics = getFinancialMetrics(
      stakeBank,
      borrowBank,
      leverage,
      tokenStakeRateAPY,
    )
    const financialMetricsAt1x = getFinancialMetrics(
      stakeBank,
      borrowBank,
      1,
      tokenStakeRateAPY,
    )
    const estNetApy = Math.max(
      financialMetrics.APY,
      financialMetricsAt1x.APY,
      0,
    )
    stakeableTokens.push({ token, financialMetrics, estNetApy })
  }
  return { stakeableTokens }
}
