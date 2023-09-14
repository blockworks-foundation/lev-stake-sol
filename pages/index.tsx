import AccountStats from '@components/AccountStats'
import StakeForm from '@components/StakeForm'
import TokenButton from '@components/TokenButton'
import UnstakeForm from '@components/UnstakeForm'
import TabUnderline from '@components/shared/TabUnderline'
import mangoStore from '@store/mangoStore'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCallback, useEffect, useState } from 'react'
import { ACCOUNT_PREFIX } from 'utils/transactions'

const STAKEABLE_TOKENS = ['mSOL', 'JitoSOL', 'stSOL', 'LDO']

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const set = mangoStore.getState().set

const Index: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Stake')
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const [selectedToken, setSelectedToken] = useState(STAKEABLE_TOKENS[0])

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

  const onClose = useCallback(() => {
    console.log('StakeForm onSuccess')
  }, [])

  const handleTokenSelect = useCallback((token: string) => {
    setSelectedToken(token)
  }, [])

  return (
    <div className="mx-auto max-w-4xl flex-col pb-20">
      <div className="flex-col">
        {/* <div className="mb-4 text-center text-5xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          LEVERAGE STAKE SOL
        </div> */}
        <div className="mb-6 grid grid-cols-2 rounded-xl border border-th-fgd-1">
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
            className={`col-span-1 mx-auto w-full rounded-r-xl py-4 font-bold ${
              activeTab === 'Positions'
                ? 'bg-th-bkg-2 text-th-fgd-1'
                : 'text-th-fgd-3'
            }`}
            onClick={() => setActiveTab('Positions')}
          >
            Your Positions
          </button>
        </div>
        {/* <h2 className="mb-4 text-xl">Tokens</h2> */}
        <div className="grid grid-cols-4 rounded-t-2xl border border-b-0 border-th-fgd-1">
          {STAKEABLE_TOKENS.map((token) => (
            <TokenButton
              key={token}
              handleTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              tokenName={token}
            />
          ))}
        </div>
      </div>
      <div className="grid max-w-4xl grid-cols-12">
        <div
          className={`col-span-7 rounded-bl-2xl border border-th-fgd-1 bg-th-bkg-1 text-th-fgd-1`}
        >
          <div className={`p-8 pt-6`}>
            <div className="pb-2">
              <TabUnderline
                activeValue={activeFormTab}
                values={['Add', 'Remove']}
                onChange={(v) => setActiveFormTab(v)}
              />
            </div>
            {activeFormTab === 'Add' ? (
              <StakeForm onSuccess={onClose} token={selectedToken} />
            ) : null}
            {activeFormTab === 'Remove' ? (
              <UnstakeForm onSuccess={onClose} token={selectedToken} />
            ) : null}
          </div>
        </div>
        <div
          className={`col-span-5 rounded-br-2xl border-y border-r border-th-fgd-1 bg-th-bkg-2 p-8 pt-6`}
        >
          <AccountStats token={selectedToken} />
        </div>
      </div>
    </div>
  )
}

export default Index
