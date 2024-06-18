import { useQuery } from '@tanstack/react-query'
import { OHLCVPairItem, fetchOHLCPair } from 'apis/birdeye/helpers'
import { SOL_MINT, STAKEABLE_TOKENS_DATA, USDC_MINT } from 'utils/constants'

const avgOHCL = (i: OHLCVPairItem) => (i.c + i.o) * 0.5

const calculateRate = (ohlcvs: OHLCVPairItem[]) => {
  if (ohlcvs && ohlcvs?.length > 6) {
    const startSamples = [
      avgOHCL(ohlcvs[0]),
      avgOHCL(ohlcvs[1]),
      avgOHCL(ohlcvs[2]),
      avgOHCL(ohlcvs[3]),
      avgOHCL(ohlcvs[4]),
      avgOHCL(ohlcvs[5]),
    ]
    // 67th percentile of first 6 days
    const start = startSamples.sort()[startSamples.length - 3]
    const endSamples = [
      avgOHCL(ohlcvs[ohlcvs.length - 1]),
      avgOHCL(ohlcvs[ohlcvs.length - 2]),
      avgOHCL(ohlcvs[ohlcvs.length - 3]),
      avgOHCL(ohlcvs[ohlcvs.length - 4]),
      avgOHCL(ohlcvs[ohlcvs.length - 5]),
      avgOHCL(ohlcvs[ohlcvs.length - 6]),
    ]
    // 67th percentile of last 6 days
    const end = endSamples.sort()[endSamples.length - 3]

    // percentiles cut off 3 samples at the start and 2 at the end
    const annualized = 365 / (ohlcvs.length - 5)
    return {
      rate: (annualized * (end - start)) / start,
      start: [start, ...startSamples],
      end: [end, ...endSamples],
    }
  }
}

const fetchRates = async () => {
  try {
    const promises = STAKEABLE_TOKENS_DATA.filter(
      (token) => token.mint_address !== USDC_MINT,
    ).map((t) => {
      const isUsdcBorrow = t.name === 'JLP' || t.name === 'USDC'
      const quoteMint = isUsdcBorrow ? USDC_MINT : SOL_MINT
      return fetchOHLCPair(t.mint_address, quoteMint, '90')
    })
    const [
      jlpPrices,
      msolPrices,
      jitoPrices,
      bsolPrices,
      jsolPrices,
      infPrices,
      hubSOLPrices,
      digitSOLPrices,
      dualSOLPrices,
      mangoSOLPrices,
      compassSOLPrices,
    ] = await Promise.all(promises)
    console.log({
      digitSOLPrices,
      dualSOLPrices,
      mangoSOLPrices,
      compassSOLPrices,
    })
    // may be null if the price range cannot be calculated
    /*
    
    const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
    const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
    const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
    const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
    
    */

    const rateData: Record<string, number> = {}
    rateData.jlp = calculateRate(jlpPrices)?.rate ?? rateData.jlp
    rateData.msol = calculateRate(msolPrices)?.rate ?? rateData.msol
    rateData.jitosol = calculateRate(jitoPrices)?.rate ?? rateData.jitosol
    rateData.bsol = calculateRate(bsolPrices)?.rate ?? rateData.bsol
    rateData.jsol = calculateRate(jsolPrices)?.rate ?? rateData.jsol
    rateData.inf = calculateRate(infPrices)?.rate ?? rateData.inf
    rateData.hubsol = calculateRate(hubSOLPrices)?.rate ?? rateData.hubsol
    rateData.digitsol = calculateRate(digitSOLPrices)?.rate ?? rateData.digitsol
    rateData.dualsol = calculateRate(dualSOLPrices)?.rate ?? rateData.dualsol
    rateData.mangosol = calculateRate(mangoSOLPrices)?.rate ?? rateData.mangosol
    rateData.compasssol =
      calculateRate(compassSOLPrices)?.rate ?? rateData.compasssol

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
