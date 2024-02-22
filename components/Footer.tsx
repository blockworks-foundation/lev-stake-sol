import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

const Footer = () => {
  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-4">
      <a
        href="https://app.mango.markets"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="font-bold text-th-fgd-1">Powered by 🥭</span>
      </a>
      <a
        className="flex items-center rounded bg-th-bkg-1 px-1.5 py-1 text-th-fgd-1"
        target="_blank"
        href="https://lev-stake-sol-msol.vercel.app/"
        rel="noopener noreferrer"
      >
        <span className="mr-1.5 block font-bold leading-none">Boost! v1</span>
        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
      </a>
    </div>
  )
}

export default Footer
