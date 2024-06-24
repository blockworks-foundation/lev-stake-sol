import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import Tooltip from './shared/Tooltip'
import Link from 'next/link'
import { StakeableToken } from 'hooks/useStakeableTokens'

export const HERO_TOKEN_BUTTON_CLASSES =
  'inner-shadow-bottom default-transition relative w-full rounded-xl border border-th-bkg-3 bg-th-bkg-1 px-6 py-4 text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:bg-th-bkg-2 md:hover:focus-visible:border-th-fgd-4'

export const HERO_TOKEN_IMAGE_WRAPPER_CLASSES =
  'inner-shadow-bottom-sm mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2 shrink-0'

const HeroTokenButton = ({
  onClick,
  tokenInfo,
}: {
  tokenInfo: StakeableToken
  onClick: () => void
}) => {
  const { symbol, name } = tokenInfo.token
  const { APY } = tokenInfo.financialMetrics
  // const leverage = useLeverageMax(symbol)
  const groupLoaded = mangoStore((s) => s.groupLoaded)

  // const { stakeBankDepositRate, financialMetrics } = useBankRates(
  //   symbol,
  //   leverage,
  // )

  // const { financialMetrics: estimatedNetAPYFor1xLev } = useBankRates(symbol, 1)

  // const APY_Daily_Compound =
  //   Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  // const UiRate =
  //   symbol === 'USDC'
  //     ? APY_Daily_Compound * 100
  //     : Math.max(estimatedNetAPYFor1xLev.APY, financialMetrics.APY)

  const renderRateEmoji = (token: string, rate: number) => {
    if (token.toLowerCase().includes('sol')) {
      if (rate >= 20) {
        return '🎉'
      } else return ''
    }
    if (token === 'JLP') {
      if (rate >= 300) {
        return '🎉'
      } else return ''
    }
    if (token === 'USDC') {
      if (rate >= 20) {
        return '🎉'
      } else return ''
    }
  }

  const emoji = renderRateEmoji(symbol, APY)

  return (
    <button className={HERO_TOKEN_BUTTON_CLASSES} onClick={onClick}>
      <div>
        <div className="flex items-center space-x-2.5">
          <div className={HERO_TOKEN_IMAGE_WRAPPER_CLASSES}>
            <Image
              src={`/icons/${symbol.toLowerCase()}.svg`}
              width={32}
              height={32}
              alt="Select a token"
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="text-left">
              <span className="text-xl font-bold">
                {formatTokenSymbol(symbol)}
              </span>
              <p className={`text-xs text-th-fgd-4`}>{name}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs text-th-fgd-4`}>Max APY</p>
              <div className="flex items-center">
                {emoji ? (
                  <Tooltip
                    content={
                      <>
                        <p className="mb-2">
                          The max APY is favorable right now. Rates can change
                          very quickly. Make sure you understand the risks
                          before boosting.
                        </p>
                        <Link href="/risks" shallow>
                          Risks
                        </Link>
                      </>
                    }
                  >
                    <span className="mr-2 text-lg">{emoji}</span>
                  </Tooltip>
                ) : null}
                <span className={`text-xl font-bold`}>
                  {!groupLoaded ? (
                    <SheenLoader>
                      <div className={`h-6 w-10 bg-th-bkg-2`} />
                    </SheenLoader>
                  ) : !APY || isNaN(APY) ? (
                    <span className="text-base font-normal text-th-fgd-4">
                      Rate Unavailable
                    </span>
                  ) : (
                    `${APY.toFixed(2)}%`
                  )}
                </span>
              </div>
            </div>
            {/* {groupLoaded ? (
              <div className="mt-1 flex items-center">
                {SOL_YIELD.includes(tokenName) ? (
                  <>
                    <Image
                      className="mr-1.5"
                      src={`/icons/sol.svg`}
                      width={16}
                      height={16}
                      alt="SOL Logo"
                    />
                    <span className="text-sm text-th-fgd-4">Earn SOL</span>
                  </>
                ) : (
                  <>
                    <Image
                      className="mr-1.5"
                      src={`/icons/usdc.svg`}
                      width={16}
                      height={16}
                      alt="USDC Logo"
                    />
                    <span className="text-sm text-th-fgd-4">Earn USDC</span>
                  </>
                )}
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    </button>
  )
}

export default HeroTokenButton
