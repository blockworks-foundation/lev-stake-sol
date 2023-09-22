import Positions from '@components/Positions'
import Stake from '@components/Stake'
import Stats from '@components/Stats'
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
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const Index: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Boost')
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
    <div className="mx-auto max-w-3xl px-6 pb-12 md:pb-20 lg:px-12">
      <div className="mb-6 grid grid-cols-4 rounded-lg border-2 border-th-fgd-1 bg-white text-lg">
        <button
          className={`col-span-1 mx-auto w-full rounded-l-[5px] border-r border-th-fgd-1 pb-2 pt-3 font-display ${
            activeTab === 'Boost'
              ? 'text-shadow inner-shadow-top-sm bg-th-primary-2 text-th-active'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          onClick={() => setActiveTab('Boost')}
        >
          Boost!
        </button>
        <button
          className={`col-span-1 mx-auto w-full border-r border-th-fgd-1 pb-2 pt-3 font-display ${
            activeTab === 'Positions'
              ? 'text-shadow inner-shadow-top-sm bg-th-primary-2 text-th-active'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          onClick={() => setActiveTab('Positions')}
        >
          Positions
        </button>
        <button
          className={`col-span-1 mx-auto w-full border-r border-th-fgd-1 pb-2 pt-3 font-display ${
            activeTab === 'History'
              ? 'text-shadow inner-shadow-top-sm bg-th-primary-2 text-th-active'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          onClick={() => setActiveTab('History')}
        >
          History
        </button>
        <button
          className={`col-span-1 mx-auto w-full rounded-r-[5px] pb-2 pt-3 font-display ${
            activeTab === 'Stats'
              ? 'text-shadow inner-shadow-top-sm bg-th-primary-2 text-th-active'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          onClick={() => setActiveTab('Stats')}
        >
          Stats
        </button>
      </div>
      <TabContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
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
    case 'Boost':
      return <Stake />
    case 'Positions':
      return <Positions setActiveTab={setActiveTab} />
    case 'History':
      return <TransactionHistory />
    case 'Stats':
      return <Stats />
    default:
      return <Stake />
  }
}
