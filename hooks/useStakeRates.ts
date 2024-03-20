import { useQuery } from '@tanstack/react-query'
import { fetchSwapChartPrices } from 'apis/birdeye/helpers'
import { SOL_MINT, STAKEABLE_TOKENS_DATA, USDC_MINT } from 'utils/constants'

const fetchRates = async () => {
  try {
    const promises = STAKEABLE_TOKENS_DATA.filter(
      (token) => token.mint_address !== USDC_MINT,
    ).map((t) => {
      const isUsdcBorrow = t.name === 'JLP' || t.name === 'USDC'
      const outputMint = isUsdcBorrow ? USDC_MINT : SOL_MINT
      return fetchSwapChartPrices(t.mint_address, outputMint, '30')
    })
    const [jlpPrices, msolPrices, jitoPrices, bsolPrices] =
      await Promise.all(promises)

    // may be null if the price range cannot be calculated
    /*
    
    const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
    const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
    const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
    const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
    
    */

    const rateData: Record<string, number> = {}
    if (jlpPrices && jlpPrices?.length > 1) {
      rateData.jlp =
        (12 * (jlpPrices[jlpPrices.length - 2].price - jlpPrices[0].price)) /
        jlpPrices[0].price
    }
    if (msolPrices && msolPrices?.length > 1) {
      rateData.msol =
        (12 * (msolPrices[msolPrices.length - 2].price - msolPrices[0].price)) /
        msolPrices[0].price
    }
    if (jitoPrices && jitoPrices?.length > 1) {
      rateData.jito =
        (12 * (jitoPrices[jitoPrices.length - 2].price - jitoPrices[0].price)) /
        jitoPrices[0].price
    }
    if (bsolPrices && bsolPrices?.length > 1) {
      rateData.bsol =
        (12 * (bsolPrices[bsolPrices.length - 2].price - bsolPrices[0].price)) /
        bsolPrices[0].price
    }

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
