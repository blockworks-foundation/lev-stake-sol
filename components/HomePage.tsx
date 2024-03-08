import usePositions from 'hooks/usePositions'
import NavTabs from './NavTabs'
import Positions from './Positions'
import Stake from './Stake'
import TransactionHistory from './TransactionHistory'
import mangoStore, { ActiveTab } from '@store/mangoStore'
import { useCallback, useEffect } from 'react'
import { BOOST_ACCOUNT_PREFIX } from 'utils/constants'
import HowItWorks from './HowItWorks'

const set = mangoStore.getState().set

const HomePage = () => {
  const activeTab = mangoStore((s) => s.activeTab)
  const selectedToken = mangoStore((s) => s.selectedToken)
  const { positions } = usePositions()

  const setActiveTab = useCallback((tab: ActiveTab) => {
    return set((s) => {
      s.activeTab = tab
    })
  }, [])

  useEffect(() => {
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const selectedMangoAccount = mangoAccounts.find(
      (ma) =>
        ma.name.toLowerCase() ===
        `${(BOOST_ACCOUNT_PREFIX + selectedToken).toLowerCase()}`,
    )

    set((s) => {
      s.mangoAccount.current = selectedMangoAccount
    })
  }, [selectedToken])

  return (
    <>
      <div className="mb-6 grid grid-cols-3">
        <NavTabs
          activeValue={activeTab}
          values={[
            ['Boost!', 0],
            ['Positions', positions.length],
            ['Activity', 0],
          ]}
          onChange={setActiveTab}
        />
      </div>
      <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
      <HowItWorks />
    </>
  )
}

export default HomePage

const TabContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (tab: ActiveTab) => void
}) => {
  switch (activeTab) {
    case 'Boost!':
      return <Stake />
    case 'Positions':
      return <Positions setActiveTab={setActiveTab} />
    case 'Activity':
      return <TransactionHistory />
    default:
      return <Stake />
  }
}
