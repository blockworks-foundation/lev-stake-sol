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
  return (
    <button onClick={() => handleTokenSelect(tokenName)}>
      <div
        className={`h-16 w-16 rounded-full border  bg-th-bkg-1 p-4 hover:cursor-pointer hover:border-2 hover:border-orange-400 ${
          selectedToken === tokenName ? 'border-black' : ''
        }`}
      >
        <Image
          src={`/icons/${tokenName.toLowerCase()}.svg`}
          width={100}
          height={100}
          alt="Select a token"
        />
      </div>
    </button>
  )
}

export default TokenButton
