import TokenButton from './TokenButton'
import { useCallback, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS } from 'utils/constants'
import Terminal from './Terminal'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState<'Add' | 'Remove'>('Add')
  const selectedToken = mangoStore((s) => s.selectedToken)

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
  }, [])

  return (
    <>
      <Terminal activeFormTab={activeFormTab} />

      <div className="grid grid-cols-3 rounded-t-2xl border-2 border-b-0 border-th-fgd-1 bg-th-bkg-1">
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
          className={`col-span-12 rounded-b-2xl border-2 border-t border-th-fgd-1 bg-th-bkg-1 text-th-fgd-1`}
        >
          <div className={`p-6 pt-4 md:p-8 md:pt-6`}>
            <div className="pb-2">
              <TabUnderline
                activeValue={activeFormTab}
                values={['Add', 'Remove']}
                onChange={(v) => setActiveFormTab(v)}
              />
            </div>
            {activeFormTab === 'Add' ? (
              <StakeForm token={selectedToken} />
            ) : null}
            {activeFormTab === 'Remove' ? (
              <UnstakeForm token={selectedToken} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Stake
