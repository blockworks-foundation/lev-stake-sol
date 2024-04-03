import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'

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

  return (
    <button
      className={`inner-shadow-bottom default-transition w-full rounded-xl border border-th-bkg-3 bg-th-bkg-1 p-6 text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:bg-th-bkg-2 md:hover:focus-visible:border-th-fgd-4`}
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
            <span className={`text-xl font-bold`}>
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
              <span className="text-sm text-th-fgd-4">
                {tokenName === 'USDC' ? 'APY' : 'Max APY'}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  )
}

export default HeroTokenButton
