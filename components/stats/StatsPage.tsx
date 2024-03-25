import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import { STAKEABLE_TOKENS } from 'utils/constants'
import HistoricalStats from './HistoricalStats'
import StatsTable from './StatsTable'

const StatsPage = () => {
  const { jlpGroup, lstGroup } = useMangoGroup()

  const [jlpBanks, lstBanks] = useMemo(() => {
    const jlpBanks = []
    const lstBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const isJlpGroup = token === 'JLP' || token === 'USDC'
      const bank = isJlpGroup
        ? jlpGroup?.banksMapByName.get(token)?.[0]
        : lstGroup?.banksMapByName.get(token)?.[0]
      if (bank !== undefined) {
        isJlpGroup ? jlpBanks.push(bank) : lstBanks.push(bank)
      }
    }
    return [jlpBanks, lstBanks]
  }, [jlpGroup, lstGroup])

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1 className="mb-6">Stats</h1>
      <h2>Isolated JLP Pool</h2>
      <div className="pb-8">
        <StatsTable banks={jlpBanks} />
        <HistoricalStats />
      </div>
      <h2>Mango v4 Pools</h2>
      <StatsTable banks={lstBanks} />
    </div>
  )
}

export default StatsPage
