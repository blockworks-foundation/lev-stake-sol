import Link from 'next/link'
import DiscordIcon from './icons/DiscordIcon'
import { XIcon } from './icons/XIcon'

const Footer = () => {
  return (
    <>
      <div className="my-6 flex items-center justify-between rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-4">
        <a
          href="https://app.mango.markets"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="font-bold text-th-fgd-1">Powered by 🥭</span>
        </a>
        <div className="flex items-center space-x-4">
          <a
            className="text-th-fgd-1 md:hover:text-th-fgd-3"
            href="https://discord.gg/2uwjsBc5yw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon className="h-5 w-5" />
          </a>
          <a
            className="text-th-fgd-1 md:hover:text-th-fgd-3"
            href="https://x.com/mangomarkets"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <Link
          className="font-bold text-th-fgd-1 md:hover:text-th-fgd-3"
          href="/risks"
        >
          Risks
        </Link>
        <a
          className="font-bold text-th-fgd-1 md:hover:text-th-fgd-3"
          href="https://docs.mango.markets/legal/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Use
        </a>
      </div>
    </>
  )
}

export default Footer
