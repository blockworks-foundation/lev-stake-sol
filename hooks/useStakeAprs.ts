import { useQuery } from '@tanstack/react-query'
import {
  fetchAndParsePricesCsv,
  getPriceRangeFromPeriod,
  calcYield,
  DATA_SOURCE,
  PERIOD,
} from '@glitchful-dev/sol-apy-sdk'

const fetchApr = async () => {
  const [msolPrices, jitoPrices, bsolPrices, lidoPrices] = await Promise.all([
    fetchAndParsePricesCsv(DATA_SOURCE.MARINADE_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.JITO_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.SOLBLAZE_CSV),
    fetchAndParsePricesCsv(DATA_SOURCE.LIDO_CSV),
  ])
  console.log('jitosol', jitoPrices)

  // may be null if the price range cannot be calculated
  const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_14)
  const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_14)
  const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_14)
  const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_14)

  const aprData: Record<string, number> = {}

  if (msolRange) {
    console.log('APR: ', calcYield(msolRange)?.apr) // 0.06493501845986677 => 6.49 %
    console.log('APY: ', calcYield(msolRange)?.apy) // 0.06707557862842384 => 6.71 %
    aprData.msol = calcYield(msolRange)?.apr
  }
  if (jitoRange) {
    aprData.jitosol = calcYield(jitoRange)?.apr
  }
  if (bsolRange) {
    aprData.bsol = calcYield(bsolRange)?.apr
  }
  if (lidoRange) {
    aprData.stsol = calcYield(lidoRange)?.apr
  }
  return aprData
}

fetchApr()

export default function useStakeApr() {
  const response = useQuery(['apr'], () => fetchApr(), {
    cacheTime: 1000 * 60 * 5,
    staleTime: 1000 * 60,
    retry: 3,
    refetchOnWindowFocus: true,
  })

  return response
}
