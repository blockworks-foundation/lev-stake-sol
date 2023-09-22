import TokenButton from './TokenButton'
import { useCallback, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
// import AccountStats from './AccountStats'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS } from 'utils/constants'
import { formatTokenSymbol } from 'utils/tokens'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const selectedToken = mangoStore((s) => s.selectedToken)

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
  }, [])

  return (
    <>
      <div className="grid grid-cols-4 rounded-t-2xl border-2 border-b-0 border-th-fgd-1 bg-white">
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
        {/* <div
          className={`order-2 col-span-12 rounded-b-2xl border border-th-fgd-1 bg-white text-th-fgd-1 md:order-2 md:col-span-7 md:rounded-br-none`}
        > */}
        <div
          className={`col-span-12 rounded-b-2xl border-2 border-t border-th-fgd-1 bg-white text-th-fgd-1`}
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
              <StakeForm token={selectedToken} />
            ) : null}
            {activeFormTab === 'Remove' ? (
              <UnstakeForm token={selectedToken} />
            ) : null}
          </div>
        </div>
        {/* <div
          className={`order-1 col-span-12 border-x border-t border-th-fgd-1 bg-th-bkg-2 p-8 pt-6 md:order-2 md:col-span-5 md:rounded-br-2xl md:border-b md:border-l-0`}
        >
          <AccountStats token={selectedToken} />
        </div> */}
      </div>
      {activeFormTab === 'Add' ? (
        <div className="fixed bottom-8 left-8">
          <button className="raised-button text-shadow flex h-20 w-20 items-center justify-center rounded-full border border-th-button-hover p-3 text-center font-display text-base">
            <div>
              <p className="text-th-active">Buy</p>
              <p className="-mt-1.5 text-th-active">
                {formatTokenSymbol(selectedToken)}
              </p>
            </div>
          </button>
        </div>
      ) : null}
    </>
  )
}

export default Stake
