import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import useMangoAccount from 'hooks/useMangoAccount'
import { STAKEABLE_TOKENS } from 'utils/constants'

const Positions = () => {
  const { mangoAccount } = useMangoAccount()
  const { group } = useMangoGroup()

  const banks = useMemo(() => {
    if (!group) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const tokenName = token === 'mSOL' ? 'MSOL' : token
      const bank = group.banksMapByName.get(tokenName)?.[0]
      positionBanks.push(bank)
    }
    return positionBanks
  }, [group])

  const positions = useMemo(() => {
    if (!banks.length || !mangoAccount) return []
    const positions = []
    for (const bank of banks) {
      let balance = 0
      if (bank) {
        balance = mangoAccount.getTokenBalanceUi(bank)
      }
      positions.push({ balance, bank })
    }
    return positions
  }, [banks, mangoAccount])

  console.log(banks)
  console.log(positions)

  return positions.length ? (
    <div></div>
  ) : (
    <div className="flex justify-center rounded-2xl border border-th-fgd-1 p-6">
      <span>No positions found</span>
    </div>
  )
}

export default Positions
