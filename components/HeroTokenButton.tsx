import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import { SOL_YIELD } from './Stake'
import Tooltip from './shared/Tooltip'
import Link from 'next/link'

const HeroTokenButton = ({
  onClick,
  tokenName,
}: {
  tokenName: string
  onClick: () => void
}) => {
  const leverage = useLeverageMax(tokenName)
  const groupLoaded = mangoStore((s) => s.groupLoaded)

  const { stakeBankDepositRate, financialMetrics } = useBankRates(
    tokenName,
    leverage,
  )

  const { financialMetrics: estimatedNetAPYFor1xLev } = useBankRates(
    tokenName,
    1,
  )

  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const UiRate =
    tokenName === 'USDC'
      ? APY_Daily_Compound * 100
      : Math.max(estimatedNetAPYFor1xLev.APY, financialMetrics.APY)

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

  const emoji = renderRateEmoji(tokenName, UiRate)

  return (
    <button
      className={`inner-shadow-bottom default-transition relative w-full rounded-xl border border-th-bkg-3 bg-th-bkg-1 p-6 text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:bg-th-bkg-2 md:hover:focus-visible:border-th-fgd-4`}
      onClick={onClick}
    >
      <div>
        <div className="flex flex-col items-center">
          <div
            className={`inner-shadow-bottom-sm mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <Image
              src={`/icons/${tokenName.toLowerCase()}.svg`}
              width={32}
              height={32}
              alt="Select a token"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className={`text-th-fgd-1`}>{formatTokenSymbol(tokenName)}</p>
            <span className={`text-2xl font-bold`}>
              {!groupLoaded ? (
                <SheenLoader>
                  <div className={`h-6 w-10 bg-th-bkg-2`} />
                </SheenLoader>
              ) : !UiRate || isNaN(UiRate) ? (
                <span className="text-base font-normal text-th-fgd-4">
                  Rate Unavailable
                </span>
              ) : (
                `${UiRate.toFixed(2)}%`
              )}
            </span>
            {groupLoaded ? (
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
            ) : null}
          </div>
        </div>
      </div>
      {emoji ? (
        <div
          className="absolute left-0 top-0 h-0 w-0 rounded-tl-xl"
          style={{
            borderTopWidth: '100px',
            borderRightWidth: '100px',
            borderTopColor: 'var(--bkg-2)',
            borderRightColor: 'transparent',
          }}
        >
          <Tooltip
            content={
              <>
                <p className="mb-2">
                  The max APY is favorable right now. Rates can change very
                  quickly. Make sure you understand the risks before boosting.
                </p>
                <Link href="/risks" shallow>
                  Risks
                </Link>
              </>
            }
          >
            <span className="absolute bottom-12 left-4 text-2xl">{emoji}</span>
          </Tooltip>
        </div>
      ) : null}
    </button>
  )
}

export default HeroTokenButton
