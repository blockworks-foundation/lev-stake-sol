import ButtonGroup from '@components/forms/ButtonGroup'
import Label from '@components/forms/Label'
import Select from '@components/forms/Select'
import LeverageSlider from '@components/shared/LeverageSlider'
import dayjs from 'dayjs'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'
import useMangoGroup from 'hooks/useMangoGroup'
import useStakeableTokens from 'hooks/useStakeableTokens'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { JLP_BORROW_TOKEN, LST_BORROW_TOKEN } from 'utils/constants'
import {
  floorToDecimal,
  formatCurrencyValue,
  formatNumericValue,
  numberCompacter,
} from 'utils/numbers'
import { formatTokenSymbol } from 'utils/tokens'

const DEFAULT_FORM = {
  amount: '100',
  period: '90',
  leverage: 1,
  token: 'JLP',
}

const YieldCalculator = () => {
  const [form, setForm] = useState(DEFAULT_FORM)
  const { stakeableTokens } = useStakeableTokens()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const leverageMax = useLeverageMax(form.token)
  const { financialMetrics } = useBankRates(form.token, form.leverage)
  const { financialMetrics: nativeFinancialMetrics } = useBankRates(
    form.token,
    1,
  )

  const changeLeverage = (v: number) => {
    setForm({ ...form, leverage: v * 1 })
  }

  const [tokenBank, borrowBank] = useMemo(() => {
    if (form.token === 'JLP') {
      return [
        jlpGroup?.banksMapByName.get('JLP')?.[0],
        jlpGroup?.banksMapByName.get(JLP_BORROW_TOKEN)?.[0],
      ]
    } else
      return [
        lstGroup?.banksMapByName.get(form.token)?.[0],
        lstGroup?.banksMapByName.get(LST_BORROW_TOKEN)?.[0],
      ]
  }, [jlpGroup, lstGroup, form])

  const positionValue = useMemo(() => {
    if (!tokenBank || !borrowBank) return 0
    const numberAmount = parseFloat(form.amount)
    const price = tokenBank.uiPrice / borrowBank.uiPrice
    return price * numberAmount
  }, [tokenBank, borrowBank, form])

  const chartData = useMemo(() => {
    if (!financialMetrics?.APY || !nativeFinancialMetrics?.APY) return []

    const numberPeriod = parseFloat(form.period)

    const nativeEffectiveRate =
      Math.pow(1 + nativeFinancialMetrics.APY / 100, 1 / 365) - 1
    const leveragedEffectiveRate =
      Math.pow(1 + financialMetrics.APY / 100, 1 / 365) - 1

    const data = []

    let nativeAmount = parseFloat(form.amount)
    let leveragedAmount = parseFloat(form.amount)

    if (tokenBank) {
      if (form.token === 'JLP') {
        nativeAmount = nativeAmount *= tokenBank.uiPrice
        leveragedAmount = leveragedAmount *= tokenBank.uiPrice
      } else {
        if (borrowBank) {
          const price = tokenBank.uiPrice / borrowBank.uiPrice
          nativeAmount = nativeAmount *= price
          leveragedAmount = leveragedAmount *= price
        }
      }
    }

    const today = new Date()

    for (let i = 0; i < numberPeriod; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const dateString = currentDate.toISOString().split('T')[0]

      nativeAmount *= 1 + nativeEffectiveRate
      leveragedAmount *= 1 + leveragedEffectiveRate

      data.push({
        date: dateString,
        nativeAmount: nativeAmount.toFixed(2),
        leveragedAmount: leveragedAmount.toFixed(2),
      })
    }

    return data
  }, [form, financialMetrics, nativeFinancialMetrics, tokenBank, borrowBank])

  const [nativeTotal, leveragedTotal] = useMemo(() => {
    if (!chartData.length) return [0, 0]
    const lastValues = chartData[chartData.length - 1]
    return [
      parseFloat(lastValues.nativeAmount),
      parseFloat(lastValues.leveragedAmount),
    ]
  }, [chartData])

  const calculatorTokens = useMemo(() => {
    if (!stakeableTokens?.length) return []
    return stakeableTokens
      .filter((token) => token.token.symbol !== 'USDC')
      .sort((a, b) => b.estNetApy - a.estNetApy)
  }, [stakeableTokens])

  const handleTokenChange = (token: string) => {
    setForm({ ...form, leverage: 1, token })
  }

  const renderPeriod = (period: string) => {
    if (period === '30') {
      return '1 month'
    } else if (period === '90') {
      return '3 months'
    } else if (period === '180') {
      return '6 months'
    } else return '1 year'
  }

  const isSolYield = form.token !== 'JLP'

  return (
    <div className="grid grid-cols-12 gap-4 px-6 md:gap-6 xl:px-0">
      <div className="order-2 col-span-12 space-y-4 rounded-xl bg-th-bkg-1 p-6 md:order-1 md:col-span-4">
        <div>
          <Label text="Token" />
          <Select
            value={form.token}
            onChange={(token) => handleTokenChange(token)}
            className="w-full"
            icon={
              <div className="mr-2">
                <Image
                  src={`/icons/${form.token.toLowerCase()}.svg`}
                  alt="Logo"
                  height={16}
                  width={16}
                />
              </div>
            }
          >
            {calculatorTokens.map((token) => (
              <Select.Option
                key={token.token.symbol}
                value={token.token.symbol}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={`/icons/${token.token.symbol.toLowerCase()}.svg`}
                      alt="Logo"
                      height={16}
                      width={16}
                    />
                    <span>{token.token.symbol}</span>
                  </div>
                  <span>{token.estNetApy.toFixed(2)}%</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <Label text={`Amount`} />
          <div className="relative">
            <NumberFormat
              name="amountIn"
              id="amountIn"
              inputMode="decimal"
              thousandSeparator=","
              allowNegative={false}
              isNumericString={true}
              decimalScale={tokenBank?.mintDecimals || 6}
              className="inner-shadow-top-sm h-12 w-full rounded-lg border border-th-bkg-3 bg-th-input-bkg pl-9 pr-3 text-left text-base font-bold text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:border-th-bkg-4 md:hover:focus-visible:border-th-fgd-4"
              placeholder="0.00"
              value={form.amount}
              onValueChange={(e: NumberFormatValues) => {
                setForm({
                  ...form,
                  amount: !Number.isNaN(Number(e.value)) ? e.value : '',
                })
              }}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Image
                src={`/icons/${form.token.toLowerCase()}.svg`}
                alt="Logo"
                height={16}
                width={16}
              />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="font-bold text-th-fgd-1">
                {formatTokenSymbol(form.token)}
              </span>
            </div>
          </div>
          <span className="mt-2 flex justify-end text-sm">
            {form.token === 'JLP'
              ? `${formatCurrencyValue(positionValue)}`
              : `${formatNumericValue(positionValue)} SOL`}
          </span>
        </div>
        <div>
          <Label text="Period" />
          <ButtonGroup
            activeValue={form.period}
            onChange={(p) => setForm({ ...form, period: p })}
            values={['30', '90', '180', '365']}
            names={['1M', '3M', '6M', '1Y']}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label text="Leverage" />
            <p className="mb-2 font-bold text-th-fgd-1">{form.leverage}x</p>
          </div>
          <LeverageSlider
            startingValue={0}
            leverageMax={floorToDecimal(leverageMax, 2).toNumber()}
            onChange={changeLeverage}
            step={0.01}
          />
        </div>
      </div>
      <div className="order-1 col-span-12 md:order-2 md:col-span-8">
        <div className="mb-4 grid grid-cols-3 rounded-xl bg-th-bkg-1 p-6 md:mb-6">
          <div className="col-span-3 mb-3 flex justify-center">
            <span className="rounded-lg bg-th-bkg-2 px-3 py-1 text-th-fgd-1">{`${
              form.token === 'JLP' ? 'USDC' : 'SOL'
            } value after ${renderPeriod(form.period)}`}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-display text-xl md:text-2xl">
              {`${isSolYield ? '' : '$'}${
                leveragedTotal > 999
                  ? numberCompacter.format(leveragedTotal)
                  : formatNumericValue(leveragedTotal)
              } ${isSolYield ? 'SOL' : ''}`}
            </span>
            <span className="mb-2 text-xs">
              {financialMetrics?.APY.toFixed(2)}% APY
            </span>
            <div className="flex items-center space-x-1.5">
              <Image
                src="/logos/yieldfan.png"
                alt="Logo"
                height={16}
                width={16}
              />
              <span className="text-xs">Yield Fan</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-th-bkg-2">
              <span className="text-sm font-semibold text-th-bkg-4">VS</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-right font-display text-xl md:text-2xl">
              {`${isSolYield ? '' : '$'}${
                nativeTotal > 999
                  ? numberCompacter.format(nativeTotal)
                  : formatNumericValue(nativeTotal)
              } ${isSolYield ? 'SOL' : ''}`}
            </span>
            <span className="mb-2 text-xs">
              {nativeFinancialMetrics?.APY.toFixed(2)}% APY
            </span>
            <div className="flex items-center space-x-1.5">
              <Image
                src={`/icons/${form.token.toLowerCase()}.svg`}
                alt="Logo"
                height={16}
                width={16}
              />
              <span className="text-xs">{form.token}</span>
            </div>
          </div>
        </div>
        <div className="h-64 rounded-xl bg-th-bkg-1 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                axisLine={false}
                dataKey="date"
                minTickGap={16}
                padding={{ left: 20, right: 20 }}
                tick={{
                  fill: 'var(--fgd-4)',
                  fontSize: 10,
                }}
                tickLine={false}
                tickFormatter={(d) => dayjs(d).format('D MMM')}
              />
              <YAxis
                axisLine={false}
                domain={[form.amount, 'dataMax']}
                padding={{ top: 20, bottom: 20 }}
                tick={{
                  fill: 'var(--fgd-4)',
                  fontSize: 10,
                }}
                tickLine={false}
                tickFormatter={(v) =>
                  v > 999 ? numberCompacter.format(v) : formatNumericValue(v)
                }
              />
              <Line
                type="monotone"
                dataKey="nativeAmount"
                dot={false}
                stroke="var(--bkg-4)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <Line
                type="monotone"
                dataKey="leveragedAmount"
                dot={false}
                stroke="var(--success)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default YieldCalculator
