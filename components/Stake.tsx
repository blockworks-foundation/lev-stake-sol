import TokenButton from './TokenButton'
import { useCallback, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS } from 'utils/constants'
import { formatTokenSymbol } from 'utils/tokens'
import { useViewport } from 'hooks/useViewport'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const selectedToken = mangoStore((s) => s.selectedToken)
  const { isDesktop } = useViewport()

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
  }, [])

  const swapUrl = `https://app.mango.markets/swap?in=USDC&out=${selectedToken}&walletSwap=true`

  return (
    <>
      <div className="grid grid-cols-4 rounded-t-2xl border-2 border-b-0 border-th-fgd-1 bg-th-bkg-1">
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
      </div>
      {activeFormTab === 'Add' ? (
        <div className="fixed bottom-0 left-0 w-full md:bottom-8 md:left-8 md:w-auto">
          {isDesktop ? (
            <a
              className="raised-button text-shadow group flex h-20 w-20 cursor-pointer items-center justify-center p-3 text-center text-base font-extrabold after:rounded-full"
              href={swapUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="group-hover:mt-1 group-active:mt-2">
                <p className="text-th-bkg-1">Buy</p>
                <p className="-mt-1.5 text-th-bkg-1">
                  {formatTokenSymbol(selectedToken)}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex justify-end border-t-2 border-th-fgd-1 bg-th-bkg-1 px-4 py-3">
              <a href={swapUrl} rel="noopener noreferrer" target="_blank">
                <div className="flex items-center">
                  <span className="mr-1.5 font-bold">{`Buy ${formatTokenSymbol(
                    selectedToken,
                  )}`}</span>
                  <ArrowTopRightOnSquareIcon className="-mt-0.5 h-5 w-5" />
                </div>
              </a>
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}

export default Stake
