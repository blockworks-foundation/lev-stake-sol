import { formatTokenSymbol } from 'utils/tokens'

const AccountStats = ({ token }: { token: string }) => {
  return (
    <>
      <h2 className="mb-4 text-2xl">{`Boosted ${formatTokenSymbol(token)}`}</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
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
      </div>
    </>
  )
}

export default AccountStats
