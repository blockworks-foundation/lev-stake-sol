import Stats from '@components/Stats'
import FormatNumericValue from '@components/shared/FormatNumericValue'
import TokenLogo from '@components/shared/TokenLogo'
import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import { STAKEABLE_TOKENS } from 'utils/constants'
import { formatTokenSymbol } from 'utils/tokens'

const StatsPage = () => {
  const { group } = useMangoGroup()

  const banks = useMemo(() => {
    if (!group) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const bank = group.banksMapByName.get(token)?.[0]
      if (bank !== undefined) {
        positionBanks.push(bank)
      }
    }
    return positionBanks
  }, [group])

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1>Stats</h1>
      <div className="space-y-2">
        {banks.map((bank) => (
          <div>
            <div className="flex flex-col pt-4 md:flex-row md:items-center md:justify-between">
              <div className="mb-4 flex items-center space-x-3 md:mb-0">
                <div
                  className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
                >
                  <TokenLogo bank={bank} size={28} />
                </div>
                <div>
                  <h3>{formatTokenSymbol(bank.name)}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-th-fgd-4">Deposits</p>
                  <span className="text-xl font-bold text-th-fgd-1">
                    <FormatNumericValue
                      value={bank.uiDeposits()}
                      decimals={2}
                    />
                  </span>
                </div>
                {bank.name == 'USDC' ? (
                  <div>
                    <p className="mb-1 text-th-fgd-4">Borrows</p>
                    <span className="text-xl font-bold text-th-fgd-1">
                      <FormatNumericValue
                        value={bank.uiBorrows()}
                        decimals={2}
                      />
                    </span>
                  </div>
                ) : undefined}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsPage
