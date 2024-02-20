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

  const jlpPricesData = await (await fetch(`https://api.coingecko.com/api/v3/coins/jupiter-perpetuals-liquidity-provider-token/market_chart?vs_currency=usd&days=30`)).json();
  const jlpPricesPrice = jlpPricesData.prices.map((priceAndTime: Array<Number>) => priceAndTime[1])

  // may be null if the price range cannot be calculated
  const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
  const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
  const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
  const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
  const jlpRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)

  const rateData: Record<string, number> = {}
  rateData.jlp = 12 * (jlpPricesPrice[jlpPricesPrice.length - 1] - jlpPricesPrice[0]) / jlpPricesPrice[0]

  if (msolRange) {
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
