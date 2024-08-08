import Link from 'next/link'
import DiscordIcon from './icons/DiscordIcon'
import { XIcon } from './icons/XIcon'
import MangoMade from './icons/MangoMade'

const Footer = () => {
  return (
    <>
      <div className="my-6 flex items-center justify-between rounded-xl border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-4">
        <a
          className="text-th-fgd-4 focus:outline-none md:hover:text-th-fgd-2"
          href="https://mango.markets"
          rel="noreferrer noopener"
          target="_blank"
        >
          <MangoMade className="h-4 w-auto" />
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
            href="https://x.com/yieldfan"
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
        <Link
          className="font-bold text-th-fgd-1 md:hover:text-th-fgd-3"
          href="/terms-of-use"
        >
          Terms of Use
        </Link>
        <Link
          className="font-bold text-th-fgd-1 md:hover:text-th-fgd-3"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
    </>
  )
}

export default Footer
