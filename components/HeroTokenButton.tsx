import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import Tooltip from './shared/Tooltip'
import Link from 'next/link'
import { StakeableToken } from 'hooks/useStakeableTokens'
import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid'

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
  const { symbol, name } = tokenInfo.token ?? {}
  const { estNetApy } = tokenInfo ?? {}
  const groupLoaded = mangoStore((s) => s.groupLoaded)

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

  const emoji = renderRateEmoji(symbol, estNetApy)

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
              <div className="flex items-center">
                <span className="mr-1.5 text-xl font-bold">
                  {formatTokenSymbol(symbol)}
                </span>
                <Tooltip
                  content={
                    <>
                      <p>
                        {tokenInfo?.token?.description
                          ? tokenInfo.token.description
                          : name}
                      </p>
                      <div className="flex">
                        {tokenInfo?.token?.links?.website ? (
                          <a
                            className="mr-2 mt-2 flex items-center"
                            href={tokenInfo.token.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="mr-0.5">Website</span>
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                          </a>
                        ) : null}
                        {tokenInfo?.token?.links?.twitter ? (
                          <a
                            className="mt-2 flex items-center"
                            href={tokenInfo.token.links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="mr-0.5">Twitter</span>
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                    </>
                  }
                >
                  <InformationCircleIcon className="mb-0.5 h-4 w-4 cursor-help text-th-bkg-4" />
                </Tooltip>
              </div>
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
                  ) : !estNetApy || isNaN(estNetApy) ? (
                    <span className="text-base font-normal text-th-fgd-4">
                      Rate Unavailable
                    </span>
                  ) : (
                    `${estNetApy.toFixed(2)}%`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export default HeroTokenButton
