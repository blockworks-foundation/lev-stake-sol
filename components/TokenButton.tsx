import useStakeRates from 'hooks/useStakeRates'
import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import SheenLoader from './shared/SheenLoader'

const TokenButton = ({
  handleTokenSelect,
  selectedToken,
  tokenName,
}: {
  tokenName: string
  selectedToken: string
  handleTokenSelect: (v: string) => void
}) => {
  const {
    data: stakeRates,
    isLoading: loadingStakeRates,
    isFetching: fetchingStakeRates,
  } = useStakeRates()

  const loadingRates = loadingStakeRates || fetchingStakeRates

  return (
    <button
      className={`col-span-1 flex items-center justify-center border-r border-th-fgd-1 p-4  first:rounded-tl-2xl last:rounded-tr-2xl last:border-transparent hover:cursor-pointer ${
        selectedToken === tokenName ? 'bg-th-bkg-2' : ''
      }`}
      onClick={() => handleTokenSelect(tokenName)}
    >
      <div className="flex flex-col items-center">
        <Image
          src={`/icons/${tokenName.toLowerCase()}.svg`}
          width={40}
          height={40}
          alt="Select a token"
        />
        <span className="mt-2 text-lg font-bold text-th-fgd-1">
          {formatTokenSymbol(tokenName)}
        </span>
        <span>
          {loadingRates ? (
            <SheenLoader className="mt-0.5">
              <div className="h-5 w-10 bg-th-bkg-3" />
            </SheenLoader>
          ) : stakeRates?.[tokenName.toLowerCase()] ? (
            `${(stakeRates?.[tokenName.toLowerCase()] * 100).toFixed(2)}%`
          ) : null}
        </span>
      </div>
    </button>
  )
}

export default TokenButton
