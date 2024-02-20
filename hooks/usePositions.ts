import { useMemo } from 'react'
import { BORROW_TOKEN, STAKEABLE_TOKENS } from 'utils/constants'
import useStakeAccounts from './useStakeAccounts'
import useMangoGroup from './useMangoGroup'

export default function usePositions(showInactive = false) {
  const { stakeAccounts } = useStakeAccounts()
  const { group } = useMangoGroup()

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get(BORROW_TOKEN)?.[0]
  }, [group])

  const banks = useMemo(() => {
    if (!group) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const bank = group.banksMapByName.get(token)?.[0]
      positionBanks.push(bank)
    }
    return positionBanks
  }, [group])

  const positions = useMemo(() => {
    const positions = []

    for (const bank of banks) {
      if (!bank) continue
      const acct = stakeAccounts?.find((acc) => acc.getTokenBalanceUi(bank) > 0)
      const stakeBalance = acct ? acct.getTokenBalanceUi(bank) : 0
      const borrowBalance = acct && borrowBank ? acct.getTokenBalanceUi(borrowBank) : 0
      positions.push({ borrowBalance, stakeBalance, bank, acct })
    }
    const sortedPositions = positions.sort(
      (a, b) => b.stakeBalance - a.stakeBalance,
    )
    return showInactive
      ? sortedPositions
      : sortedPositions.filter((pos) => pos.stakeBalance > 0)
  }, [banks, showInactive, stakeAccounts, borrowBank])

  return { borrowBank, positions }
}
