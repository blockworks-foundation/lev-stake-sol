// import useMangoGroup from 'hooks/useMangoGroup'
// import { useMemo } from 'react'
// import FormatNumericValue from './shared/FormatNumericValue'
// import useMangoAccount from 'hooks/useMangoAccount'

const AccountStats = ({ token }: { token: string }) => {
  // const { mangoAccount } = useMangoAccount()
  // const { group } = useMangoGroup()

  // const bank = useMemo(() => {
  //   if (!group) return undefined
  //   return group.banksMapByName.get(token)?.[0]
  // }, [group, token])

  // const position = bank ? mangoAccount?.getTokenBalanceUi(bank) || 0.0 : 0.0

  return (
    <>
      <h2 className="mb-4 text-2xl">{`Boosted ${token}`}</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <p className="mb-1">Est. APR</p>
          <span className="text-2xl font-bold">14.89%</span>
        </div>
        <div>
          <p className="mb-1">Max Leverage</p>
          <span className="text-2xl font-bold">3x</span>
        </div>
        <div>
          <p className="mb-1">Capacity Remaining</p>
          <span className="text-2xl font-bold">100,000 SOL</span>
        </div>
        <div>
          <p className="mb-1">Total Staked</p>
          <span className="text-2xl font-bold">{`100,000 ${token}`}</span>
        </div>
        {/* <div>
          <div>Your position</div>
          <div className="text-2xl font-bold">
            {bank ? <FormatNumericValue value={position} decimals={6} /> : 0.0}
          </div>
        </div> */}
      </div>
    </>
  )
}

export default AccountStats
