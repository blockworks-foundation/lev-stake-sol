import { useEffect, useState } from 'react'
import {
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectedMenu from './wallet/ConnectedMenu'
import ConnectWalletButton from './wallet/ConnectWalletButton'
import useOnlineStatus from 'hooks/useOnlineStatus'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BoostLogo from './BoostLogo'

const TopBar = () => {
  const { connected } = useWallet()

  const [copied, setCopied] = useState('')
  const isOnline = useOnlineStatus()
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    setTimeout(() => setCopied(''), 2000)
  }, [copied])

  return (
    <div className="mb-8 grid h-20 grid-cols-2 px-6 sm:grid-cols-3">
      <div className="col-span-1 hidden sm:flex sm:items-center">
        <a
          className="flex items-center rounded bg-th-bkg-1 px-1.5 py-1 text-th-fgd-1"
          target="_blank"
          href="https://boost-v1.mango.markets/"
          rel="noopener noreferrer"
        >
          <span className="mr-1.5 block font-bold leading-none">Boost! v1</span>
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        </a>
      </div>
      <div className="col-span-1 flex items-center sm:justify-center">
        <Link href="/" shallow={true}>
          <div className="group flex items-center">
            <BoostLogo className="h-auto w-12 shrink-0 cursor-pointer group-hover:animate-shake" />
            <span className="text-shadow ml-2 hidden text-[32px] font-black text-th-bkg-1 md:block">
              Boost!
            </span>
            <div className="ml-2.5 hidden rounded border border-th-fgd-1 bg-th-active px-1.5 py-1 md:block">
              <span className="block font-mono text-xxs font-black leading-none text-th-fgd-1">
                v2
              </span>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-span-1 flex items-center justify-end space-x-6">
        <NavLink active={pathname === '/stats'} path="/stats" text="Stats" />
        <NavLink active={pathname === '/faqs'} path="/faqs" text="FAQs" />
        <div className="flex space-x-3">
          <ThemeToggle />
          {connected ? <ConnectedMenu /> : <ConnectWalletButton />}
        </div>
      </div>
      {!isOnline ? (
        <div className="bg-th-down absolute left-1/2 top-3 z-10 flex h-10 w-max -translate-x-1/2 items-center rounded-full px-4 py-2 md:top-8">
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-th-fgd-1" />
          <p className="ml-2 text-th-fgd-1">
            Your connection appears to be offline
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default TopBar

const NavLink = ({
  active,
  path,
  text,
  target,
}: {
  active: boolean
  path: string
  text: string
  target?: string
}) => {
  return (
    <Link target={target ? target : undefined} href={path} shallow={true}>
      <span
        className={`default-transition border-b-2 text-sm font-bold md:text-base md:hover:text-th-active ${
          active
            ? 'border-th-active text-th-active'
            : 'border-th-fgd-1 text-th-fgd-1'
        }`}
      >
        {text}
      </span>
    </Link>
  )
}
