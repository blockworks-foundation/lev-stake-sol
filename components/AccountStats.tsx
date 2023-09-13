import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import FormatNumericValue from './shared/FormatNumericValue'
import useMangoAccount from 'hooks/useMangoAccount'

const AccountStats = ({ token }: { token: string }) => {
  const { mangoAccount } = useMangoAccount()
  const { group } = useMangoGroup()

  const bank = useMemo(() => {
    if (!group) return undefined
    return group.banksMapByName.get(token)?.[0]
  }, [group, token])

  const position = bank ? mangoAccount?.getTokenBalanceUi(bank) || 0.0 : 0.0

  return (
    <div className="my-8 ml-4 mr-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div>Est. {token} APR</div>
          <div className="text-2xl font-bold">14.89%</div>
        </div>
        <div>
          <div>Max Leverage</div>
          <div className="text-2xl font-bold">3x</div>
        </div>
        <div>
          <div>Available to borrow</div>
          <div className="text-2xl font-bold">100,000</div>
        </div>
        <div>
          <div>Your position</div>
          <div className="text-2xl font-bold">
            {bank ? <FormatNumericValue value={position} decimals={6} /> : 0.0}
          </div>
        </div>
        <div>
          <div>Title Here</div>
        </div>
        <div>
          <div>Title Here</div>
        </div>
      </div>
    </div>
  )
}

export default AccountStats
