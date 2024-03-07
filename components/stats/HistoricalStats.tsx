import { useQuery } from '@tanstack/react-query'
import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo, useState } from 'react'
import { fetchTokenStatsData } from 'utils/stats'
import TokenRatesChart from './TokenRatesChart'

const HistoricalStats = () => {
  const { group } = useMangoGroup()
  const [depositDaysToShow, setDepositDaysToShow] = useState('30')

  const { data: historicalStats, isLoading: loadingHistoricalStats } = useQuery(
    ['historical-stats'],
    () => fetchTokenStatsData(group),
    {
      cacheTime: 1000 * 60 * 10,
      staleTime: 1000 * 60,
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!group,
    },
  )

  const usdcStats = useMemo(() => {
    if (!historicalStats?.length) return []
    return historicalStats
      .filter((token) => token.symbol === 'USDC')
      .sort(
        (a, b) =>
          new Date(a.date_hour).getTime() - new Date(b.date_hour).getTime(),
      )
  }, [historicalStats])

  const chartData = useMemo(() => {
    if (!usdcStats?.length) return []
    const statsToFormat = [...usdcStats]
    for (const stat of statsToFormat) {
      const APY_Daily_Compound = Math.pow(1 + stat.deposit_rate / 365, 365) - 1
      stat.deposit_apy = APY_Daily_Compound
    }
    return statsToFormat
  }, [usdcStats])

  return (
    <div className="px-6 pt-8">
      <TokenRatesChart
        data={chartData}
        dataKey="deposit_apy"
        daysToShow={depositDaysToShow}
        loading={loadingHistoricalStats}
        setDaysToShow={setDepositDaysToShow}
        title={`USDC Deposit Rates (APR)`}
      />
    </div>
  )
}

export default HistoricalStats
