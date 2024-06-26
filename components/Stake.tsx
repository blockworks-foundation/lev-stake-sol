import { useCallback, useMemo, useState } from 'react'
import StakeForm from '@components/StakeForm'
import mangoStore from '@store/mangoStore'
import {
  formatTokenSymbol,
  getStakableTokensDataForTokenName,
} from 'utils/tokens'
import { useViewport } from 'hooks/useViewport'
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import DespositForm from './DepositForm'
import { EnterBottomExitBottom } from './shared/Transitions'
import TokenSelect from './TokenSelect'
import { IconButton } from './shared/Button'
import HeroTokenButton, {
  HERO_TOKEN_BUTTON_CLASSES,
  HERO_TOKEN_IMAGE_WRAPPER_CLASSES,
} from './HeroTokenButton'
import Image from 'next/image'
import useStakeableTokens, { StakeableToken } from 'hooks/useStakeableTokens'

const set = mangoStore.getState().set

export const SOL_YIELD = [
  'bSOL',
  'MSOL',
  'JitoSOL',
  'JSOL',
  'INF',
  'hubSOL',
  'digitSOL',
  'dualSOL',
  'mangoSOL',
  'compassSOL',
]
const USDC_YIELD = ['JLP', 'USDC']

const Stake = () => {
  const [tokensToShow, setTokensToShow] = useState('')
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const selectedToken = mangoStore((s) => s.selectedToken)
  // const walletTokens = mangoStore((s) => s.wallet.tokens)
  const { isDesktop } = useViewport()
  const { stakeableTokens } = useStakeableTokens()

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
    setShowTokenSelect(false)
  }, [])

  const selectableTokens = useMemo(() => {
    return stakeableTokens.sort((a: StakeableToken, b: StakeableToken) => {
      // const aClientContext = getStakableTokensDataForTokenName(
      //   a.token.symbol,
      // ).clientContext
      // const aWalletBalance = walletBalanceForToken(
      //   walletTokens,
      //   a.token.symbol,
      //   aClientContext,
      // )
      // const bClientContext = getStakableTokensDataForTokenName(
      //   b.token.symbol,
      // ).clientContext
      // const bWalletBalance = walletBalanceForToken(
      //   walletTokens,
      //   b.token.symbol,
      //   bClientContext,
      // )

      // const aMaxAmount = aWalletBalance.maxAmount
      // const bMaxAmount = bWalletBalance.maxAmount
      const aApy = a.estNetApy
      const bApy = b.estNetApy

      // if (bMaxAmount !== aMaxAmount) {
      //   return bMaxAmount - aMaxAmount
      // } else {
      //   return bApy - aApy
      // }
      return bApy - aApy
    })
  }, [stakeableTokens])

  // const swapUrl = `https://app.mango.markets/swap?in=USDC&out=${selectedToken}&walletSwap=true`

  return (
    <>
      <div className="relative overflow-hidden">
        <EnterBottomExitBottom
          className="absolute bottom-0 left-0 z-20 h-full w-full overflow-hidden rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 px-3 py-6 pb-0"
          show={showTokenSelect}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-10 w-10" />
            <h2>Select token to Boost!</h2>
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
            <p className="text-sm text-th-fgd-4">Wallet Balance</p>
          </div>
          <div className="h-full max-h-[500px] overflow-auto pb-10">
            {selectableTokens.map((token) => (
              <TokenSelect
                key={token.token.symbol}
                onClick={() => handleTokenSelect(token.token.symbol)}
                tokenInfo={token}
                clientContext={
                  getStakableTokensDataForTokenName(token.token.symbol)
                    .clientContext
                }
              />
            ))}
          </div>
        </EnterBottomExitBottom>
        <div
          className={`rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6 text-th-fgd-1 md:p-8`}
        >
          {selectableTokens.length ? (
            !selectedToken ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-full border-b border-th-bkg-3 pb-6 text-center md:pb-8">
                    <h1 className="mb-1">Let&apos;s Boost!</h1>
                    <p>Leverage up your liquid staking yield.</p>
                  </div>
                  <div className="w-full py-6 md:py-8">
                    <h2 className="mb-3 text-center text-lg font-normal">
                      Select your yield
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                      <button
                        className={`${HERO_TOKEN_BUTTON_CLASSES} ${
                          tokensToShow === 'SOL' ? 'bg-th-bkg-2' : ''
                        }`}
                        onClick={() => setTokensToShow('SOL')}
                      >
                        <div className="flex flex-col items-center">
                          <div className={HERO_TOKEN_IMAGE_WRAPPER_CLASSES}>
                            <Image
                              src={`/icons/sol.svg`}
                              width={32}
                              height={32}
                              alt="Select a token"
                            />
                          </div>
                          <span>SOL</span>
                        </div>
                      </button>
                      <button
                        className={`${HERO_TOKEN_BUTTON_CLASSES} ${
                          tokensToShow === 'USDC' ? 'bg-th-bkg-2' : ''
                        }`}
                        onClick={() => setTokensToShow('USDC')}
                      >
                        <div className="flex flex-col items-center">
                          <div className={HERO_TOKEN_IMAGE_WRAPPER_CLASSES}>
                            <Image
                              src={`/icons/usdc.svg`}
                              width={32}
                              height={32}
                              alt="Select a token"
                            />
                          </div>
                          <span>USDC</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {tokensToShow ? (
                  <div className="space-y-3 border-t border-th-bkg-3 pt-6 md:pt-8">
                    <h2 className="text-center text-lg font-normal">
                      Select a token to Boost!
                    </h2>
                    {selectableTokens
                      .filter((t) => {
                        if (tokensToShow === 'SOL') {
                          return SOL_YIELD.includes(t.token.symbol)
                        } else if (tokensToShow === 'USDC') {
                          return USDC_YIELD.includes(t.token.symbol)
                        } else return
                      })
                      .map((token) => {
                        const { symbol } = token.token
                        return (
                          <HeroTokenButton
                            key={symbol}
                            onClick={() =>
                              set((state) => {
                                state.selectedToken = symbol
                              })
                            }
                            tokenInfo={token}
                          />
                        )
                      })}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="mb-6 flex items-center space-x-3">
                  <IconButton
                    onClick={() =>
                      set((state) => {
                        state.selectedToken = ''
                      })
                    }
                    size="small"
                    isPrimary
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </IconButton>
                  <h2>Boost! {selectedToken}</h2>
                </div>
                {selectedToken === 'USDC' ? (
                  <DespositForm
                    token="USDC"
                    clientContext={
                      getStakableTokensDataForTokenName('USDC').clientContext
                    }
                  />
                ) : (
                  <StakeForm
                    token={selectedToken}
                    clientContext={
                      getStakableTokensDataForTokenName(selectedToken)
                        ?.clientContext
                    }
                  />
                )}
              </>
            )
          ) : (
            <div className="p-10">
              <p className="text-center text-th-fgd-4">
                No positions to remove
              </p>
            </div>
          )}
        </div>
      </div>
      {/* {selectedToken ? (
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
      ) : null} */}
    </>
  )
}

export default Stake
