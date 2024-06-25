import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import { useMemo } from 'react'
import FormatNumericValue from './shared/FormatNumericValue'
import { walletBalanceForToken } from './StakeForm'
import usePositions from 'hooks/usePositions'
import { ClientContextKeys } from 'utils/constants'
import { StakeableToken } from 'hooks/useStakeableTokens'
import { SOL_YIELD } from './Stake'

const TokenSelect = ({
  onClick,
  tokenInfo,
  clientContext,
  showPositionSize,
}: {
  tokenInfo: StakeableToken
  onClick: () => void
  clientContext: ClientContextKeys
  showPositionSize?: boolean
}) => {
  const { symbol } = tokenInfo.token
  const { estNetApy } = tokenInfo
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const walletTokens = mangoStore((s) => s.wallet.tokens)
  const { positions } = usePositions()

  const walletBalance = useMemo(() => {
    return walletBalanceForToken(walletTokens, symbol, clientContext)
  }, [walletTokens, symbol, clientContext])

  const position = useMemo(() => {
    if (!positions || !positions?.length) return
    return positions.find((position) => position.bank.name === symbol)
  }, [positions, symbol])

  return (
    <button
      className="default-transition w-full rounded-lg p-3 md:hover:bg-th-bkg-2"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`inner-shadow-bottom-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <Image
              src={`/icons/${symbol.toLowerCase()}.svg`}
              width={24}
              height={24}
              alt="Select a token"
            />
          </div>
          <div className="text-left">
            <p className={`text-sm text-th-fgd-1 lg:text-base`}>
              {formatTokenSymbol(symbol)}
            </p>
            <span
              className={`text-sm font-bold leading-none text-th-fgd-1 sm:text-lg`}
            >
              {!groupLoaded ? (
                <SheenLoader>
                  <div className={`h-5 w-10 bg-th-bkg-2`} />
                </SheenLoader>
              ) : !estNetApy || isNaN(estNetApy) ? (
                'Rate Unavailable'
              ) : symbol === 'USDC' ? (
                <>
                  {`${estNetApy.toFixed(2)}%`}
                  <div className="mt-1 flex items-center">
                    <Image
                      className="mr-1"
                      src={`/icons/usdc.svg`}
                      width={14}
                      height={14}
                      alt="USDC Logo"
                    />
                    <span className="text-sm font-normal text-th-fgd-4">
                      Earn USDC
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {`${estNetApy.toFixed(2)}%`}
                  <div className="mt-1">
                    {SOL_YIELD.includes(symbol) ? (
                      <div className="flex items-center">
                        <Image
                          className="mr-1"
                          src={`/icons/sol.svg`}
                          width={14}
                          height={14}
                          alt="SOL Logo"
                        />
                        <span className="text-sm font-normal text-th-fgd-4">
                          Earn SOL
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Image
                          className="mr-1"
                          src={`/icons/usdc.svg`}
                          width={14}
                          height={14}
                          alt="USDC Logo"
                        />
                        <span className="text-sm font-normal text-th-fgd-4">
                          Earn USDC
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="pl-3 text-right">
          {showPositionSize ? (
            position ? (
              <>
                <span className="text-sm font-bold text-th-fgd-1 sm:text-lg">
                  <FormatNumericValue
                    value={
                      position.stakeBalance *
                      (position.bank.name != 'USDC'
                        ? position.bank?.uiPrice
                        : 1)
                    }
                    decimals={2}
                  />{' '}
                  {'USDC'}
                </span>
                {position.bank.name !== 'USDC' ? (
                  <p className="text-sm text-th-fgd-4">
                    <FormatNumericValue
                      roundUp={true}
                      value={position.stakeBalance}
                      decimals={3}
                    />{' '}
                    {formatTokenSymbol(position.bank.name)}
                  </p>
                ) : null}
              </>
            ) : (
              '–'
            )
          ) : (
            <FormatNumericValue
              value={walletBalance.maxAmount}
              decimals={walletBalance.maxDecimals}
            />
          )}
        </div>
      </div>
    </button>
  )
}

export default TokenSelect
