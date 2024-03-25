import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import { useMemo } from 'react'
import FormatNumericValue from './shared/FormatNumericValue'
import { walletBalanceForToken } from './StakeForm'
import usePositions from 'hooks/usePositions'
import { ClientContextKeys } from 'utils/constants'

const TokenSelect = ({
  onClick,
  tokenName,
  clientContext,
  showPositionSize,
}: {
  tokenName: string
  onClick: () => void
  clientContext: ClientContextKeys
  showPositionSize?: boolean
}) => {
  const leverage = useLeverageMax(tokenName)
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const walletTokens = mangoStore((s) => s.wallet.tokens)
  const { positions } = usePositions()

  const { stakeBankDepositRate, financialMetrics } = useBankRates(
    tokenName,
    leverage,
  )

  const { financialMetrics: estimatedNetAPYFor1xLev } = useBankRates(
    tokenName,
    1,
  )

  const walletBalance = useMemo(() => {
    return walletBalanceForToken(walletTokens, tokenName, clientContext)
  }, [walletTokens, tokenName, clientContext])

  const position = useMemo(() => {
    if (!positions || !positions?.length) return
    return positions.find((position) => position.bank.name === tokenName)
  }, [positions, tokenName])

  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const UiRate =
    tokenName === 'USDC'
      ? APY_Daily_Compound * 100
      : Math.max(estimatedNetAPYFor1xLev.APY, financialMetrics.APY)

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
              src={`/icons/${tokenName.toLowerCase()}.svg`}
              width={24}
              height={24}
              alt="Select a token"
            />
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold text-th-fgd-1 sm:text-lg`}>
              {formatTokenSymbol(tokenName)}
            </p>
            <span className={`text-sm text-th-fgd-4`}>
              {!groupLoaded ? (
                <SheenLoader>
                  <div className={`h-5 w-10 bg-th-bkg-2`} />
                </SheenLoader>
              ) : !UiRate || isNaN(UiRate) ? (
                'Rate Unavailable'
              ) : tokenName === 'USDC' ? (
                `${UiRate.toFixed(2)}% APY`
              ) : (
                `Up to ${UiRate.toFixed(2)}% APY`
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
