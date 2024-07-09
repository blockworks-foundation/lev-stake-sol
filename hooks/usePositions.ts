import { useMemo } from 'react'
import {
  JLP_BORROW_TOKEN,
  LST_BORROW_TOKEN,
  STAKEABLE_TOKENS,
} from 'utils/constants'
import useStakeAccounts from './useStakeAccounts'
import useMangoGroup from './useMangoGroup'
import { toUiDecimalsForQuote } from '@blockworks-foundation/mango-v4'
import useSolPnl from './useSolPnl'

export default function usePositions(showInactive = false) {
  const { stakeAccounts } = useStakeAccounts()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const { data } = useSolPnl(
    stakeAccounts
      ? stakeAccounts.map((x) => x.publicKey.toBase58())
      : undefined,
  )

  const jlpBorrowBank = useMemo(() => {
    return jlpGroup?.banksMapByName.get(JLP_BORROW_TOKEN)?.[0]
  }, [jlpGroup])

  const lstBorrowBank = useMemo(() => {
    return lstGroup?.banksMapByName.get(LST_BORROW_TOKEN)?.[0]
  }, [lstGroup])

  const banks = useMemo(() => {
    if (!jlpGroup || !lstGroup) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const isJlpGroup = token === 'JLP' || token === 'USDC'
      const bank = isJlpGroup
        ? jlpGroup.banksMapByName.get(token)?.[0]
        : lstGroup.banksMapByName.get(token)?.[0]
      positionBanks.push(bank)
    }
    return positionBanks
  }, [jlpGroup, lstGroup])

  const positions = useMemo(() => {
    const positions = []

    for (const bank of banks) {
      if (!bank || !jlpGroup || !lstGroup) continue
      const isJlpGroup = bank.name === 'JLP' || bank.name === 'USDC'
      const group = isJlpGroup ? jlpGroup : lstGroup
      const borrowBank = isJlpGroup ? jlpBorrowBank : lstBorrowBank
      const acct = stakeAccounts?.find((acc) => acc.getTokenBalanceUi(bank) > 0)
      const stakeBalance = acct ? acct.getTokenBalanceUi(bank) : 0
      const pnl = acct ? toUiDecimalsForQuote(acct.getPnl(group).toNumber()) : 0
      const borrowBalance =
        acct && borrowBank ? acct.getTokenBalanceUi(borrowBank) : 0
      const solPnl =
        acct && data ? data.accToSolPnl[acct.publicKey.toBase58()] : undefined

      positions.push({ borrowBalance, stakeBalance, bank, pnl, acct, solPnl })
    }
    const sortedPositions = positions.sort(
      (a, b) => b.stakeBalance - a.stakeBalance,
    )
    return showInactive
      ? sortedPositions
      : sortedPositions.filter((pos) => pos.stakeBalance > 0)
  }, [
    banks,
    showInactive,
    stakeAccounts,
    jlpGroup,
    lstGroup,
    jlpBorrowBank,
    lstBorrowBank,
    data?.accToSolPnl,
  ])

  return { jlpBorrowBank, lstBorrowBank, positions }
}
