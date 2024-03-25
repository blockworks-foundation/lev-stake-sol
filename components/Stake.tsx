import TokenButton from './TokenButton'
import { useCallback, useMemo, useState } from 'react'
import TabUnderline from './shared/TabUnderline'
import StakeForm, { walletBalanceForToken } from '@components/StakeForm'
import UnstakeForm from '@components/UnstakeForm'
import mangoStore from '@store/mangoStore'
import { STAKEABLE_TOKENS } from 'utils/constants'
import {
  formatTokenSymbol,
  getStakableTokensDataForTokenName,
} from 'utils/tokens'
import { useViewport } from 'hooks/useViewport'
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/20/solid'
import DespositForm from './DepositForm'
import { EnterBottomExitBottom } from './shared/Transitions'
import TokenSelect from './TokenSelect'
import Label from './forms/Label'
import usePositions from 'hooks/usePositions'
import { IconButton } from './shared/Button'

const set = mangoStore.getState().set

const Stake = () => {
  const [activeFormTab, setActiveFormTab] = useState('Add')
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const selectedToken = mangoStore((s) => s.selectedToken)
  const walletTokens = mangoStore((s) => s.wallet.tokens)
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
      return STAKEABLE_TOKENS.sort((a: string, b: string) => {
        if (activeFormTab === 'Add') {
          const aClientContext =
            getStakableTokensDataForTokenName(a).clientContext
          const aWalletBalance = walletBalanceForToken(
            walletTokens,
            a,
            aClientContext,
          )
          const bClientContext =
            getStakableTokensDataForTokenName(b).clientContext
          const bWalletBalance = walletBalanceForToken(
            walletTokens,
            b,
            bClientContext,
          )
          return bWalletBalance.maxAmount - aWalletBalance.maxAmount
        } else {
          const aHasPosition = positions.find((pos) => pos.bank.name === a)
          const bHasPosition = positions.find((pos) => pos.bank.name === b)
          const aPositionValue = aHasPosition
            ? aHasPosition.stakeBalance * aHasPosition.bank.uiPrice
            : 0
          const bPositionValue = bHasPosition
            ? bHasPosition.stakeBalance * bHasPosition.bank.uiPrice
            : 0
          return bPositionValue - aPositionValue
        }
      })
    } else if (positions?.length) {
      const positionTokens = positions.map((position) => position.bank.name)
      return positionTokens
    } else return []
  }, [activeFormTab, positions, walletTokens])

  const swapUrl = `https://app.mango.markets/swap?in=USDC&out=${selectedToken}&walletSwap=true`

  return (
    <>
      <div className="relative overflow-hidden">
        <EnterBottomExitBottom
          className="absolute bottom-0 left-0 z-20 h-full w-full overflow-hidden rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 px-3 py-6 pb-0"
          show={showTokenSelect}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-10 w-10" />
            <h2>
              Select token to {activeFormTab === 'Add' ? 'Boost!' : 'Unboost'}
            </h2>
            <IconButton
              onClick={() => setShowTokenSelect(false)}
              hideBg
              size="medium"
            >
              <XMarkIcon className="h-6 w-6" />
            </IconButton>
          </div>
          <div className="mb-2 flex justify-between px-3">
            <p className="text-sm text-th-fgd-4">Token</p>
            <p className="text-sm text-th-fgd-4">
              {activeFormTab === 'Add' ? 'Wallet Balance' : 'Position Size'}
            </p>
          </div>
          <div>
            {selectableTokens.map((token) => (
              <TokenSelect
                key={token}
                onClick={() => handleTokenSelect(token)}
                tokenName={token}
                clientContext={
                  getStakableTokensDataForTokenName(token).clientContext
                }
                showPositionSize={activeFormTab === 'Remove'}
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
                          getStakableTokensDataForTokenName('USDC')
                            .clientContext
                        }
                      />
                    ) : null}
                    {activeFormTab === 'Remove' ? (
                      <UnstakeForm
                        token="USDC"
                        clientContext={
                          getStakableTokensDataForTokenName('USDC')
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
                          getStakableTokensDataForTokenName(selectedToken)
                            .clientContext
                        }
                      />
                    ) : null}
                    {activeFormTab === 'Remove' ? (
                      <UnstakeForm
                        token={selectedToken}
                        clientContext={
                          getStakableTokensDataForTokenName(selectedToken)
                            .clientContext
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
