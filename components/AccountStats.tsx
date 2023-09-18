import useStakeRates from 'hooks/useStakeRates'
import { formatTokenSymbol } from 'utils/tokens'
import SheenLoader from './shared/SheenLoader'
import { useMemo } from 'react'
import Decimal from 'decimal.js'
import useMangoGroup from 'hooks/useMangoGroup'
import FormatNumericValue from './shared/FormatNumericValue'

const AccountStats = ({ token }: { token: string }) => {
  const { data: stakeRates, isLoading: loadingRates } = useStakeRates()
  const { group } = useMangoGroup()

  const solBank = useMemo(() => {
    return group?.banksMapByName.get('SOL')?.[0]
  }, [group, token])

  const tokenBank = useMemo(() => {
    return group?.banksMapByName.get(token)?.[0]
  }, [group, token])

  const solDeposits = useMemo(() => {
    if (!solBank) return null
    return solBank.uiDeposits()
  }, [solBank])

  const tokenDeposits = useMemo(() => {
    if (!tokenBank) return null
    return tokenBank.uiDeposits()
  }, [tokenBank])

  const solAvailable = useMemo(() => {
    if (!solBank || !solDeposits) return 0
    const availableVaultBalance = group
      ? group.getTokenVaultBalanceByMintUi(solBank.mint) -
        solDeposits * solBank.minVaultToDepositsRatio
      : 0
    return Decimal.max(0, availableVaultBalance.toFixed(solBank.mintDecimals))
  }, [solBank, solDeposits, group])

  return (
    <>
      <h2 className="mb-4 text-2xl">{`Boosted ${formatTokenSymbol(token)}`}</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
        <div>
          <p className="mb-1">Max Est. APY</p>
          <span className="text-2xl font-bold">
            {loadingRates ? (
              <SheenLoader className="mt-1">
                <div className="h-8 w-20 bg-th-bkg-3" />
              </SheenLoader>
            ) : stakeRates?.[token.toLowerCase()] ? (
              `${(stakeRates?.[token.toLowerCase()] * 100).toFixed(2)}%`
            ) : null}
          </span>
        </div>
        <div>
          <p className="mb-1">Max Leverage</p>
          <span className="text-2xl font-bold">3x</span>
        </div>
        <div>
          <p className="mb-1">Capacity Remaining</p>
          <span className="text-2xl font-bold">
            <FormatNumericValue value={solAvailable} decimals={0} /> SOL
          </span>
        </div>
        <div>
          <p className="mb-1">Total Staked</p>
          <span className="text-2xl font-bold">
            <FormatNumericValue value={tokenDeposits || 0} decimals={1} />{' '}
            {formatTokenSymbol(token)}
          </span>
        </div>
      </div>
    </>
  )
}

export default AccountStats
