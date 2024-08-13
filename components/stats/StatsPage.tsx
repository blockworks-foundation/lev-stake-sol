import HistoricalStats from './HistoricalStats'
import StatsTable from './StatsTable'
import useBanks from 'hooks/useBanks'

const StatsPage = () => {
  const { jlpBanks, lstBanks } = useBanks()

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
