import Link from 'next/link'
import DiscordIcon from './icons/DiscordIcon'
import { XIcon } from './icons/XIcon'
import MangoMade from './icons/MangoMade'
import Image from 'next/image'
import { ZigZagRepeatLine } from './Stake'

const Footer = () => {
  return (
    <div className="bg-th-bkg-1">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-4 gap-4 p-8">
          <div className="col-span-4 md:col-span-1">
            <Link className="mb-3 block focus:outline-none" href="/">
              <Image
                src="/logos/yieldfan.png"
                alt="Logo"
                height={48}
                width={48}
              />
            </Link>
            <p className="mb-4 text-th-fgd-4">
              Multiply your yield on
              <br />
              Solana&apos;s best yield farm.
            </p>
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
          <div className="col-span-4 space-y-3 md:col-span-1">
            <h4>Get started</h4>
            <Link
              className="block text-th-fgd-1 md:hover:text-th-fgd-3"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="block text-th-fgd-1 md:hover:text-th-fgd-3"
              href="/stats"
            >
              Stats
            </Link>
          </div>
          <div className="col-span-4 space-y-3 md:col-span-1">
            <h4>Important Info</h4>
            <Link
              className="block text-th-fgd-1 md:hover:text-th-fgd-3"
              href="/risks"
            >
              Risks
            </Link>
            <Link
              className="block text-th-fgd-1 md:hover:text-th-fgd-3"
              href="/terms-of-use"
            >
              Terms of Use
            </Link>
            <Link
              className="block text-th-fgd-1 md:hover:text-th-fgd-3"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="px-6">
          <ZigZagRepeatLine />
        </div>
        <div className="flex justify-center px-6 py-4">
          <a
            className="text-th-fgd-4 focus:outline-none md:hover:text-th-fgd-2"
            href="https://mango.markets"
            rel="noreferrer noopener"
            target="_blank"
          >
            <MangoMade className="h-4 w-auto" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
