import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { SOL_YIELD } from './Stake'
import useStakeableTokens, { StakeableToken } from 'hooks/useStakeableTokens'
import { useMemo } from 'react'

const TokenButton = ({
  onClick,
  tokenName,
}: {
  tokenName: string
  onClick: () => void
}) => {
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const { stakeableTokens } = useStakeableTokens()

  const tokenInfo: StakeableToken | undefined = useMemo(() => {
    if (!tokenName || !stakeableTokens?.length) return
    return stakeableTokens.find((token) => token.token.symbol === tokenName)
  }, [tokenName, stakeableTokens])

  const apy = tokenInfo?.financialMetrics?.APY

  return (
    <button
      className={`inner-shadow-bottom-sm default-transition w-full rounded-xl border border-th-bkg-3 bg-th-bkg-1 p-3 text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:bg-th-bkg-2 md:hover:focus-visible:border-th-fgd-4`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <Image
              src={`/icons/${tokenName.toLowerCase()}.svg`}
              width={24}
              height={24}
              alt="Select a token"
            />
          </div>
          <div className="text-left">
            <p className={`mb-0.5 text-th-fgd-1`}>
              {formatTokenSymbol(tokenName)}
            </p>
            <span className={`text-lg font-bold leading-none text-th-fgd-1`}>
              {!groupLoaded ? (
                <SheenLoader>
                  <div className={`h-5 w-10 bg-th-bkg-2`} />
                </SheenLoader>
              ) : !apy || isNaN(apy) ? (
                <span className="text-base font-normal text-th-fgd-4">
                  Rate Unavailable
                </span>
              ) : tokenName === 'USDC' ? (
                <>
                  {`${apy.toFixed(2)}%`}
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
                  {`${apy.toFixed(2)}%`}
                  <div className="mt-1">
                    {SOL_YIELD.includes(tokenName) ? (
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
        <ChevronDownIcon className="h-6 w-6" />
      </div>
    </button>
  )
}

export default TokenButton
