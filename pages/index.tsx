import NavTabs from '@components/NavTabs'
import Positions from '@components/Positions'
import Stake from '@components/Stake'
import TransactionHistory from '@components/TransactionHistory'
import mangoStore from '@store/mangoStore'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { BOOST_ACCOUNT_PREFIX } from 'utils/constants'

const set = mangoStore.getState().set

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'swap'])),
    },
  }
}

const Index: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Boost!')
  const selectedToken = mangoStore((s) => s.selectedToken)

  useEffect(() => {
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const selectedMangoAccount = mangoAccounts.find(
      (ma) =>
        ma.name.toLowerCase() ===
        `${(BOOST_ACCOUNT_PREFIX + selectedToken).toLowerCase()}`,
    )
    console.log(
      'selectedMangoAccount',
      (BOOST_ACCOUNT_PREFIX + selectedToken).toLowerCase(),
      selectedMangoAccount,
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
          values={['Boost!', 'Positions', 'Activity']}
          onChange={setActiveTab}
        />
      </div>
      <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  )
}

export default Index

const TabContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
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
