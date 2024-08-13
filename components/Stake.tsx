import { useCallback, useEffect, useMemo, useState } from 'react'
import StakeForm, { MIN_SOL_BALANCE_FOR_ACCOUNT } from '@components/StakeForm'
import mangoStore from '@store/mangoStore'
import { getStakableTokensDataForTokenName } from 'utils/tokens'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import DespositForm from './DepositForm'
import { EnterBottomExitBottom } from './shared/Transitions'
import TokenSelect from './TokenSelect'
import { IconButton } from './shared/Button'
import HeroTokenButton from './HeroTokenButton'
import useStakeableTokens, { StakeableToken } from 'hooks/useStakeableTokens'
import { useTheme } from 'next-themes'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import usePositions from 'hooks/usePositions'
import InlineNotification from './shared/InlineNotification'
import { useWallet } from '@solana/wallet-adapter-react'

const set = mangoStore.getState().set

export const YIELD_BUTTON_CLASSES = `flex items-center justify-center rounded-xl raised-button-neutral group after:rounded-xl h-32 px-6 md:px-6 w-full after:border after:border-th-bkg-3 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`

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

const Stake = () => {
  const { connected } = useWallet()
  const { positions } = usePositions()
  const walletTokens = mangoStore((s) => s.wallet.tokens)
  const [showTokenSelect, setShowTokenSelect] = useState(false)
  const selectedToken = mangoStore((s) => s.selectedToken)
  const { stakeableTokens } = useStakeableTokens()

  const handleTokenSelect = useCallback((token: string) => {
    set((state) => {
      state.selectedToken = token
    })
    setShowTokenSelect(false)
  }, [])

  const selectableTokens = useMemo(() => {
    return stakeableTokens.sort((a: StakeableToken, b: StakeableToken) => {
      const aApy = a.estNetApy
      const bApy = b.estNetApy
      return bApy - aApy
    })
  }, [stakeableTokens])

  const solBalance = useMemo(() => {
    if (!walletTokens?.length) return 0
    const solInWallet = walletTokens.find(
      (token) => token.mint.toString() === WRAPPED_SOL_MINT.toString(),
    )
    return solInWallet ? solInWallet.uiAmount : 0
  }, [walletTokens])

  const isExistingPosition = useMemo(() => {
    return positions.find((p) => p.bank.name === selectedToken)
  }, [positions, selectedToken])

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
                  <div className="w-full pb-6 text-center md:pb-8">
                    <h1 className="mb-1">Welcome yield fan 👋</h1>
                    <p>It&apos;s time to multiply your liquid staking yield.</p>
                  </div>
                  <ZigZagRepeatLine />
                </div>
                <div className="space-y-3 pt-6 md:pt-8">
                  <h2 className="text-center text-lg font-normal">
                    Select to earn leveraged yield
                  </h2>
                  {selectableTokens.map((token) => {
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
                  <h2>Add {selectedToken}</h2>
                </div>
                {connected &&
                solBalance < MIN_SOL_BALANCE_FOR_ACCOUNT &&
                !isExistingPosition ? (
                  <div className="mb-4">
                    <InlineNotification
                      type="error"
                      desc={`You need at least ${MIN_SOL_BALANCE_FOR_ACCOUNT} SOL. Most of this is refunded when you close your position and the rest is to pay for transactions.`}
                    />
                  </div>
                ) : null}
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
    </>
  )
}

export default Stake

export const ZigZagRepeatLine = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <div
      className={`bg-x-repeat h-2 w-full ${
        theme === 'Light'
          ? `bg-[url('/images/zigzag-repeat.svg')]`
          : `bg-[url('/images/zigzag-repeat-dark.svg')]`
      } bg-contain opacity-20`}
    />
  )
}
