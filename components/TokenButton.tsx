import useStakeApr from 'hooks/useStakeAprs'
import Image from 'next/image'

const TokenButton = ({
  handleTokenSelect,
  selectedToken,
  tokenName,
}: {
  tokenName: string
  selectedToken: string
  handleTokenSelect: (v: string) => void
}) => {
  const { data: stakeAprs } = useStakeApr()

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
          {tokenName}
        </span>
        <span>
          {stakeAprs?.[tokenName.toLowerCase()]
            ? (stakeAprs?.[tokenName.toLowerCase()] * 100).toFixed(2)
            : null}
          %
        </span>
      </div>
    </button>
  )
}

export default TokenButton
