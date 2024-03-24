import TokenButton from './TokenButton'
import { useCallback, useMemo, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS, STAKEABLE_TOKENS_DATA } from 'utils/constants'
import { formatTokenSymbol } from 'utils/tokens'
import { useViewport } from 'hooks/useViewport'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import DespositForm from './DepositForm'
import { EnterBottomExitBottom } from './shared/Transitions'
import TokenSelect from './TokenSelect'
import Label from './forms/Label'
import usePositions from 'hooks/usePositions'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const selectedToken = mangoStore((s) => s.selectedToken)
  const { isDesktop } = useViewport()
  const { positions } = usePositions()

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
    setShowTokenSelect(false)
  }, [])

  const hasPosition = useMemo(() => {
    if (!positions || !selectedToken) return false
    return positions.find((position) => position.bank.name === selectedToken)
  }, [positions, selectedToken])

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveFormTab(tab)
      if (tab === 'Remove' && positions?.length && !hasPosition) {
        set((state) => {
          state.selectedToken = positions[0].bank.name
        })
      }
    },
    [hasPosition, positions],
  )

  const selectableTokens = useMemo(() => {
    if (activeFormTab === 'Add') {
      return STAKEABLE_TOKENS
    } else if (positions?.length) {
      const positionTokens = positions.map((position) => position.bank.name)
      return positionTokens
    } else return []
  }, [activeFormTab, positions])

  const swapUrl = `https://app.mango.markets/swap?in=USDC&out=${selectedToken}&walletSwap=true`

  return (
    <>
      <div className="relative overflow-hidden">
        <EnterBottomExitBottom
          className="thin-scroll absolute bottom-0 left-0 z-20 h-full w-full overflow-auto rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6 pb-0"
          show={!!showTokenSelect}
        >
          <h2 className="mb-4 text-center">
            Select token to {activeFormTab === 'Add' ? 'Boost!' : 'Unboost'}
          </h2>
          <div className="space-y-4">
            {selectableTokens.map((token) => (
              <TokenSelect
                key={token}
                onClick={() => handleTokenSelect(token)}
                tokenName={token}
              />
            ))}
          </div>
        </EnterBottomExitBottom>
        <div
          className={`rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 text-th-fgd-1`}
        >
          <div className={`p-6 pt-4 md:p-8 md:pt-6`}>
            <div className="pb-2">
              <TabUnderline
                activeValue={activeFormTab}
                values={['Add', 'Remove']}
                onChange={(v) => handleTabChange(v)}
              />
            </div>
            {selectableTokens.length ? (
              <>
                <div className="pb-6">
                  <Label text="Token" />
                  <TokenButton
                    onClick={() => setShowTokenSelect(true)}
                    tokenName={selectedToken}
                  />
                </div>
                {selectedToken == 'USDC' ? (
                  <>
                    {activeFormTab === 'Add' ? (
                      <DespositForm
                        token="USDC"
                        clientContext={
                          STAKEABLE_TOKENS_DATA.find((x) => x.name === 'USDC')!
                            .clientContext
                        }
                      />
                    ) : null}
                    {activeFormTab === 'Remove' ? (
                      <UnstakeForm
                        token="USDC"
                        clientContext={
                          STAKEABLE_TOKENS_DATA.find((x) => x.name === 'USDC')!
                            .clientContext
                        }
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    {activeFormTab === 'Add' ? (
                      <StakeForm
                        token={selectedToken}
                        clientContext={
                          STAKEABLE_TOKENS_DATA.find(
                            (x) => x.name === selectedToken,
                          )!.clientContext
                        }
                      />
                    ) : null}
                    {activeFormTab === 'Remove' ? (
                      <UnstakeForm
                        token={selectedToken}
                        clientContext={
                          STAKEABLE_TOKENS_DATA.find(
                            (x) => x.name === selectedToken,
                          )!.clientContext
                        }
                      />
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <div className="p-10">
                <p className="text-center text-th-fgd-4">
                  No positions to remove
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {activeFormTab === 'Add' ? (
        <div className="fixed bottom-0 left-0 z-20 w-full lg:bottom-8 lg:left-8 lg:w-auto">
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
