import { useQuery } from '@tanstack/react-query'
import { OHLCVPairItem, fetchOHLCPair } from 'apis/birdeye/helpers'
import {
  SOL_MINT,
  STAKEABLE_TOKENS_DATA,
  StakeableTokensData,
  USDC_MINT,
} from 'utils/constants'

const avgOpenClose = (i: OHLCVPairItem) => (i.c + i.o) * 0.5
const sum = (x: number, y: number) => x + y
const ANNUAL_SECONDS = 60 * 60 * 24 * 365

const calculateRateFromOhlcv = (ohlcvs: OHLCVPairItem[]) => {
  if (ohlcvs && ohlcvs?.length > 30) {
    // basic least squares regression:
    // https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/statistics/regression-and-correlation/simple-linear-regression.html
    const xs = ohlcvs.map((o) => o.unixTime)
    const ys = ohlcvs.map(avgOpenClose)
    const x_sum = xs.reduce(sum, 0)
    const y_sum = ys.reduce(sum, 0)
    const x_mean = x_sum / xs.length
    const y_mean = y_sum / ys.length
    const S_xy = xs
      .map((xi, i) => (xi - x_mean) * (ys[i] - y_mean))
      .reduce(sum, 0)
    const S_xx = xs.map((xi) => (xi - x_mean) ** 2).reduce(sum, 0)
    const b = S_xy / S_xx
    const a = y_mean - b * x_mean

    const start = a + b * xs[0]
    const end = a + b * (xs[0] + ANNUAL_SECONDS)
    return { rate: (end - start) / start, start, end, a, b, S_xx, S_xy }
  } else {
    return { rate: 0.082 } // fixed rate to avoid outliers
  }
}

const fetchRates = async () => {
  try {
    const promises = STAKEABLE_TOKENS_DATA.filter(
      (token) => token.mint_address !== USDC_MINT,
    ).map(async (t) => {
      const isUsdcBorrow = t.symbol === 'JLP' || t.symbol === 'USDC'
      const quoteMint = isUsdcBorrow ? USDC_MINT : SOL_MINT
      const dailyCandles = await fetchOHLCPair(t.mint_address, quoteMint, '90')
      return dailyCandles
    })

    const monthlyLstPriceChanges = await fetchApyToSol(STAKEABLE_TOKENS_DATA)
    const [
      jlpPrices,
      msolPrices,
      jitoPrices,
      bsolPrices,
      infPrices,
      jsolPrices,
    ] = await Promise.all(promises)
    // may be null if the price range cannot be calculated
    /*
    
    const msolRange = getPriceRangeFromPeriod(msolPrices, PERIOD.DAYS_30)
    const jitoRange = getPriceRangeFromPeriod(jitoPrices, PERIOD.DAYS_30)
    const bsolRange = getPriceRangeFromPeriod(bsolPrices, PERIOD.DAYS_30)
    const lidoRange = getPriceRangeFromPeriod(lidoPrices, PERIOD.DAYS_30)
    
    */
    console.log(monthlyLstPriceChanges)
    const rateData: Record<string, number> = {}
    rateData.jlp = calculateRateFromOhlcv(jlpPrices)?.rate ?? rateData.jlp
    rateData.msol = calculateRateFromOhlcv(msolPrices)?.rate ?? rateData.msol
    rateData.jitosol =
      calculateRateFromOhlcv(jitoPrices)?.rate ?? rateData.jitosol
    rateData.bsol = calculateRateFromOhlcv(bsolPrices)?.rate ?? rateData.bsol
    rateData.inf = calculateRateFromOhlcv(infPrices)?.rate ?? rateData.inf
    rateData.jsol = calculateRateFromOhlcv(jsolPrices)?.rate ?? rateData.jsol
    rateData.hubsol = monthlyLstPriceChanges['hubsol'] ?? 0
    rateData.digitsol = monthlyLstPriceChanges['digitsol'] ?? 0
    rateData.dualsol = monthlyLstPriceChanges['dualsol'] ?? 0
    rateData.mangosol = monthlyLstPriceChanges['mangosol'] ?? 0
    rateData.compasssol = monthlyLstPriceChanges['compasssol'] ?? 0
    rateData.stepsol = 0.0672 ?? 0
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
    refetchOnWindowFocus: false,
  })

  return {
    data: response.data,
    isLoading: response.isFetching || response.isLoading,
  }
}

async function fetchApyToSol(tokensData: StakeableTokensData[]) {
  const resp = await fetch(
    'https://api.mngo.cloud/data/boost/stats/monthly-sol-price',
  )
  const json: { data: { mint: string; monthly_price_change: number }[] } =
    await resp.json()
  const tokenToApy: { [key: string]: number } = {}
  for (const token of tokensData) {
    const record = json.data.find((x) => x.mint === token.mint_address)
    const apy = (1 + (record?.monthly_price_change || 0)) ** 12 - 1
    tokenToApy[token.symbol.toLowerCase()] = apy
  }
  return tokenToApy
}
