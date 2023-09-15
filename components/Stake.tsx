import { STAKEABLE_TOKENS } from 'pages'
import TokenButton from './TokenButton'
import { useCallback, useEffect, useState } from 'react'
import mangoStore from '@store/mangoStore'
import { ACCOUNT_PREFIX } from 'utils/transactions'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import AccountStats from './AccountStats'

const set = mangoStore.getState().set

const Stake = () => {
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
    <>
      <div className="grid grid-cols-5 rounded-t-2xl border border-b-0 border-th-fgd-1">
        {STAKEABLE_TOKENS.map((token) => (
          <TokenButton
            key={token}
            handleTokenSelect={handleTokenSelect}
            selectedToken={selectedToken}
            tokenName={token}
          />
        ))}
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
    </>
  )
}

export default Stake
