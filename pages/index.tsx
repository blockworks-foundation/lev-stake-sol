import Positions from '@components/Positions'
import Stake from '@components/Stake'
import TransactionHistory from '@components/TransactionHistory'
import mangoStore from '@store/mangoStore'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { ACCOUNT_PREFIX } from 'utils/transactions'

const set = mangoStore.getState().set

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const Index: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Stake')
  const selectedToken = mangoStore((s) => s.selectedToken)

  useEffect(() => {
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const selectedMangoAccount = mangoAccounts.find(
      (ma) => ma.name === `${ACCOUNT_PREFIX}${selectedToken}`,
    )
    console.log('selectedMangoAccount', selectedMangoAccount)

    set((s) => {
      s.mangoAccount.current = selectedMangoAccount
    })
  }, [selectedToken])

  return (
    <div className="mx-auto max-w-4xl flex-col pb-20">
      <div className="mb-6 grid grid-cols-3 rounded-xl border border-th-fgd-1">
        <button
          className={`col-span-1 mx-auto w-full rounded-l-xl border-r border-th-fgd-1 py-4 font-bold ${
            activeTab === 'Stake'
              ? 'bg-th-bkg-2 text-th-fgd-1'
              : 'text-th-fgd-3'
          }`}
          onClick={() => setActiveTab('Stake')}
        >
          Stake
        </button>
        <button
          className={`col-span-1 mx-auto w-full border-r border-th-fgd-1 py-4 font-bold ${
            activeTab === 'Positions'
              ? 'bg-th-bkg-2 text-th-fgd-1'
              : 'text-th-fgd-3'
          }`}
          onClick={() => setActiveTab('Positions')}
        >
          Your Positions
        </button>
        <button
          className={`col-span-1 mx-auto w-full rounded-r-xl py-4 font-bold ${
            activeTab === 'History'
              ? 'bg-th-bkg-2 text-th-fgd-1'
              : 'text-th-fgd-3'
          }`}
          onClick={() => setActiveTab('History')}
        >
          Transaction History
        </button>
      </div>
      <TabContent activeTab={activeTab} />
    </div>
  )
}

export default Index

const TabContent = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'Stake':
      return <Stake />
    case 'Positions':
      return <Positions />
    case 'History':
      return <TransactionHistory />
    default:
      return <Stake />
  }
}
