import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'

const TokenButton = ({
  handleTokenSelect,
  selectedToken,
  tokenName,
}: {
  tokenName: string
  selectedToken: string
  handleTokenSelect: (v: string) => void
}) => {
  const leverage = useLeverageMax(tokenName) * 0.9

  const { stakeBankDepositRate, estimatedNetAPY } = useBankRates(
    tokenName,
    leverage,
  )

  const UiRate = tokenName == 'USDC' ? stakeBankDepositRate : estimatedNetAPY

  return (
    <button
      className={`col-span-1 flex items-center justify-center border-r border-th-fgd-1 p-4 first:rounded-tl-[13px] last:rounded-tr-[13px] last:border-r-0 hover:cursor-pointer ${
        selectedToken === tokenName
          ? 'inner-shadow-top bg-th-active'
          : 'inner-shadow-bottom default-transition bg-th-bkg-1 md:hover:bg-th-bkg-2'
      }`}
      onClick={() => handleTokenSelect(tokenName)}
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border ${
            selectedToken === tokenName
              ? 'inner-shadow-top-sm border-th-bkg-1 bg-gradient-to-b from-th-active to-th-active-dark'
              : 'inner-shadow-bottom-sm border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2'
          }`}
        >
          <Image
            src={`/icons/${tokenName.toLowerCase()}.svg`}
            width={24}
            height={24}
            alt="Select a token"
          />
        </div>
        <span className={`mt-1 text-lg font-bold text-th-fgd-1`}>
          {formatTokenSymbol(tokenName)}
        </span>
        <span
          className={`font-medium ${
            selectedToken === tokenName ? 'text-th-fgd-1' : 'text-th-fgd-4'
          }`}
        >
          {
            // isLoading ? (
            //   <SheenLoader>
            //     <div
            //       className={`h-5 w-10 ${
            //         selectedToken === tokenName
            //           ? 'bg-th-active-dark'
            //           : 'bg-th-bkg-2'
            //       }`}
            //     />
            //   </SheenLoader>
            // ) :
            tokenName === 'USDC'
              ? `${UiRate.toFixed(2)}%`
              : `Up to ${UiRate.toFixed(2)}%`
          }
        </span>
      </div>
    </button>
  )
}

export default TokenButton
