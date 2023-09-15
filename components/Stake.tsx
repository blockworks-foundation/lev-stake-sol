import TokenButton from './TokenButton'
import { useCallback, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import AccountStats from './AccountStats'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS } from 'utils/constants'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const selectedToken = mangoStore((s) => s.selectedToken)

  const onClose = useCallback(() => {
    console.log('StakeForm onSuccess')
  }, [])

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
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
      <div className="grid grid-cols-12">
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
