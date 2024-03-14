import { useQuery } from '@tanstack/react-query'
import { fetchSwapChartPrices } from 'apis/birdeye/helpers'
import { STAKEABLE_TOKENS_DATA } from 'utils/constants'

const fetchRates = async () => {
  try {
    const [jlpPrices] = await Promise.all([
      fetchSwapChartPrices(STAKEABLE_TOKENS_DATA[0]?.mint_address, STAKEABLE_TOKENS_DATA[1]?.mint_address, '30')
    ])

    // may be null if the price range cannot be calculated
    /*
    
    const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
    const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
    const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
    const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
    
    */

    const rateData: Record<string, number> = {}
    rateData.jlp =
      (12 * (jlpPrices[jlpPrices.length - 1].price - jlpPrices[0].price)) /
      jlpPrices[0].price


    /*
    
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
    
    */
   
    return rateData
  } catch (e) {
    return {}
  }
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
