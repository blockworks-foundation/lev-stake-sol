import { useQuery } from '@tanstack/react-query'
import { OHLCVPairItem, fetchOHLCPair } from 'apis/birdeye/helpers'
import { SOL_MINT, STAKEABLE_TOKENS_DATA, USDC_MINT } from 'utils/constants'

const avgOpenClose = (i: OHLCVPairItem) => (i.c + i.o) * .5;
const sum = (x: number, y: number) => x + y;
const ANNUAL_SECONDS = 60 * 60 * 24 * 365;

const calculateRate = (ohlcvs: OHLCVPairItem[]) => {


  if (ohlcvs && ohlcvs?.length > 30) {

    // basic least squares regression:
    // https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/statistics/regression-and-correlation/simple-linear-regression.html
    const xs = ohlcvs.map(o => o.unixTime);
    const ys = ohlcvs.map(avgOpenClose);
    const x_sum = xs.reduce(sum, 0);
    const y_sum = ys.reduce(sum, 0);
    const x_mean = x_sum / xs.length;
    const y_mean = y_sum / ys.length;
    const S_xy = xs.map((xi, i) => (xi - x_mean) * (ys[i] - y_mean)).reduce(sum, 0);
    const S_xx = xs.map((xi) => (xi - x_mean) ** 2).reduce(sum, 0);
    const b = S_xy / S_xx;
    const a = y_mean - b * x_mean;

    const start = a + b * xs[0];
    const end = a + b * (xs[0] + ANNUAL_SECONDS);
    return { rate: (end - start)/start, start, end, a, b, S_xx, S_xy};
  } else {
    return { rate: 0.082 }; // fixed rate to avoid outliers
  }
}

const fetchRates = async () => {
  try {
    const promises = STAKEABLE_TOKENS_DATA.filter(
      (token) => token.mint_address !== USDC_MINT,
    ).map(async (t) => {
      const isUsdcBorrow = t.name === 'JLP' || t.name === 'USDC'
      const quoteMint = isUsdcBorrow ? USDC_MINT : SOL_MINT
      const dailyCandles = await fetchOHLCPair(t.mint_address, quoteMint, '90');
      return dailyCandles;
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
