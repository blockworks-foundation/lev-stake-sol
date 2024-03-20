import FormatNumericValue from '@components/shared/FormatNumericValue'
import { Table, Td, Th, TrBody, TrHead } from '@components/shared/TableElements'
import TokenLogo from '@components/shared/TokenLogo'
import useMangoGroup from 'hooks/useMangoGroup'
import { useViewport } from 'hooks/useViewport'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { STAKEABLE_TOKENS } from 'utils/constants'
import { formatCurrencyValue } from 'utils/numbers'
import { formatTokenSymbol } from 'utils/tokens'
import HistoricalStats from './HistoricalStats'

const StatsPage = () => {
  const { jlpGroup, lstGroup } = useMangoGroup()
  const { t } = useTranslation('common')
  const { isMobile } = useViewport()

  const banks = useMemo(() => {
    const statsBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const isJlpGroup = token === 'JLP' || token === 'USDC'
      const bank = isJlpGroup
        ? jlpGroup?.banksMapByName.get(token)?.[0]
        : lstGroup?.banksMapByName.get(token)?.[0]
      if (bank !== undefined) {
        statsBanks.push(bank)
      }
    }
    return statsBanks
  }, [jlpGroup, lstGroup])

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1>Stats</h1>
      {!isMobile ? (
        <Table>
          <thead>
            <TrHead>
              <Th className="text-left">{t('token')}</Th>
              <Th className="text-right">Deposits</Th>
              <Th className="text-right">Borrows</Th>
            </TrHead>
          </thead>
          <tbody>
            {banks.map((bank) => {
              const deposits = bank.uiDeposits()
              const borrows = bank.uiBorrows()
              return (
                <TrBody key={bank.name} className="text-sm">
                  <Td>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
                      >
                        <TokenLogo bank={bank} size={28} />
                      </div>
                      <div>
                        <h3>{formatTokenSymbol(bank.name)}</h3>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-th-fgd-1">
                        <FormatNumericValue value={deposits} decimals={2} />
                      </span>
                      <p className="font-normal text-th-fgd-4">
                        {formatCurrencyValue(deposits * bank.uiPrice)}
                      </p>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col items-end">
                      {bank.name === 'USDC' ? (
                        <>
                          <span className="text-xl font-bold text-th-fgd-1">
                            <FormatNumericValue value={borrows} decimals={2} />
                          </span>
                          <p className="font-normal text-th-fgd-4">
                            {formatCurrencyValue(borrows * bank.uiPrice)}
                          </p>
                        </>
                      ) : (
                        '–'
                      )}
                    </div>
                  </Td>
                </TrBody>
              )
            })}
          </tbody>
        </Table>
      ) : (
        <div className="mt-4 space-y-2">
          {banks.map((bank) => {
            const deposits = bank.uiDeposits()
            const borrows = bank.uiBorrows()
            return (
              <div
                className="border-th-bk-3 rounded-xl border p-4"
                key={bank.name}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
                  >
                    <TokenLogo bank={bank} size={28} />
                  </div>
                  <div>
                    <h3>{formatTokenSymbol(bank.name)}</h3>
                  </div>
                </div>
                <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
                  <div className="flex w-1/2 flex-col">
                    <p className="text-th-fgd-4">Deposits</p>
                    <span className="text-xl font-bold text-th-fgd-1">
                      <FormatNumericValue value={deposits} decimals={2} />
                    </span>
                    <p className="font-normal text-th-fgd-4">
                      {formatCurrencyValue(deposits * bank.uiPrice)}
                    </p>
                  </div>
                  <div className="flex w-1/2 flex-col">
                    <p className="text-th-fgd-4">Borrows</p>
                    {bank.name === 'USDC' ? (
                      <>
                        <span className="text-xl font-bold text-th-fgd-1">
                          <FormatNumericValue value={borrows} decimals={2} />
                        </span>
                        <p className="font-normal text-th-fgd-4">
                          {formatCurrencyValue(borrows * bank.uiPrice)}
                        </p>
                      </>
                    ) : (
                      '–'
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <HistoricalStats />
    </div>
  )
}

export default StatsPage
