import AccountStats from '@components/AccountStats'
import StakeForm from '@components/StakeForm'
import TokenButton from '@components/TokenButton'
import UnstakeForm from '@components/UnstakeForm'
import TabUnderline from '@components/shared/TabUnderline'
import mangoStore from '@store/mangoStore'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCallback, useEffect, useState } from 'react'
import { ACCOUNT_ACTION_MODAL_INNER_HEIGHT } from 'utils/constants'
import { ACCOUNT_PREFIX } from 'utils/transactions'

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
  const [selectedToken, setSelectedToken] = useState('MSOL')

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
    <div className="m-auto max-w-4xl flex-col">
      <div className="flex-col">
        {/* <div className="mb-4 text-center text-5xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          LEVERAGE STAKE SOL
        </div> */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex-col">
            <TokenButton
              handleTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              tokenName="MSOL"
            />
            <div className="text-center">mSOL</div>
          </div>
          <div className="flex-col">
            <TokenButton
              handleTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              tokenName="JitoSOL"
            />
            <div className="text-center">JitoSOL</div>
          </div>
          <div className="flex-col">
            <TokenButton
              handleTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              tokenName="stSOL"
            />
            <div className="text-center">stSOL</div>
          </div>
          <div className="flex-col">
            <TokenButton
              handleTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              tokenName="LDO"
            />
            <div className="text-center">LDO</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full max-w-4xl">
        <div
          className={`min-h-[${ACCOUNT_ACTION_MODAL_INNER_HEIGHT}] relative z-20 rounded-xl border border-black bg-th-bkg-1 p-2 text-th-fgd-1`}
        >
          <div className={`relative h-[500px]`}>
            <div className="m-6">
              <TabUnderline
                activeValue={activeTab}
                values={['Stake', 'Unstake']}
                onChange={(v) => setActiveTab(v)}
              />
            </div>
            {activeTab === 'Stake' ? (
              <StakeForm onSuccess={onClose} token={selectedToken} />
            ) : null}
            {activeTab === 'Unstake' ? (
              <UnstakeForm onSuccess={onClose} token={selectedToken} />
            ) : null}
          </div>
        </div>
        <div
          className={`min-h-[${ACCOUNT_ACTION_MODAL_INNER_HEIGHT}] relative z-10 -ml-4 rounded rounded-r-xl border-y border-r border-black bg-th-bkg-2 p-2 pl-8 text-th-fgd-1`}
        >
          <AccountStats token={selectedToken} />
        </div>
      </div>
    </div>
  )
}

export default Index
