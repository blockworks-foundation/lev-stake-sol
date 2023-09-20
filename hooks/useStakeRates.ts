import { useQuery } from '@tanstack/react-query'
import {
  fetchAndParsePricesCsv,
  getPriceRangeFromPeriod,
  calcYield,
  DATA_SOURCE,
  PERIOD,
} from '@glitchful-dev/sol-apy-sdk'

const fetchRates = async () => {
  const [msolPrices, jitoPrices, bsolPrices, lidoPrices] = await Promise.all([
    fetchAndParsePricesCsv(DATA_SOURCE.MARINADE_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.JITO_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.SOLBLAZE_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.LIDO_CSV),
  ])
  console.log('jitosol', jitoPrices)

  // may be null if the price range cannot be calculated
  const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
  const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
  const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
  const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
  console.log('msol prices', msolPrices)

  const rateData: Record<string, number> = {}

  if (msolRange) {
    console.log('APY: ', calcYield(msolRange)?.apy) // 0.06707557862842384 => 6.71 %
    rateData.msol = calcYield(msolRange)?.apy
  }
  if (jitoRange) {
    rateData.jitosol = calcYield(jitoRange)?.apy
  }
  if (bsolRange) {
    rateData.bsol = calcYield(bsolRange)?.apy
  }
  if (lidoRange) {
    rateData.stsol = calcYield(lidoRange)?.apy
  }
  return rateData
}

fetchRates()

export default function useStakeRates() {
  const response = useQuery(['stake-rates'], () => fetchRates(), {
    cacheTime: 1000 * 60 * 5,
    staleTime: 1000 * 60,
    retry: 3,
    refetchOnWindowFocus: true,
  })

  return {
    data: response.data,
    isLoading: response.isFetching || response.isLoading,
  }
}
