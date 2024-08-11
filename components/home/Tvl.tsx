import { ZigZagLine } from '@components/NavTabs'
import FormatNumericValue from '@components/shared/FormatNumericValue'
import useBanks from 'hooks/useBanks'
import { useMemo } from 'react'

const Tvl = () => {
  const { jlpBanks, lstBanks } = useBanks()

  const tvl = useMemo(() => {
    const combinedBanks = [...jlpBanks, ...lstBanks]
    const tvl = combinedBanks.reduce((a, c) => {
      const deposits = c.uiDeposits()
      const price = c.uiPrice
      const value = deposits * price
      return a + value
    }, 0)
    return tvl
  }, [jlpBanks, lstBanks])

  return (
    <div className="relative flex flex-col items-center">
      <ZigZagLine className="absolute -bottom-4 w-20" reverse />
      <ZigZagLine className="absolute -top-4 w-20" reverse />
      <span className="mb-2 text-4xl font-bold text-th-fgd-1 md:text-5xl">
        {tvl ? <FormatNumericValue value={tvl} isUsd /> : '...'}
      </span>
      <p className="text-th-fgd-4">{`TVL across ${
        jlpBanks?.length ? jlpBanks.length + lstBanks.length : '...'
      } listed tokens`}</p>
    </div>
  )
}

export default Tvl
