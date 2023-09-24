import { useEffect, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectedMenu from './wallet/ConnectedMenu'
import ConnectWalletButton from './wallet/ConnectWalletButton'
// import SolanaTps from './SolanaTps'
import useOnlineStatus from 'hooks/useOnlineStatus'
import mangoStore from '@store/mangoStore'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TopBar = () => {
  const { connected } = useWallet()
  const themeData = mangoStore((s) => s.themeData)

  const [copied, setCopied] = useState('')
  const isOnline = useOnlineStatus()
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    setTimeout(() => setCopied(''), 2000)
  }, [copied])

  return (
    <div className="mb-8 flex h-20 items-center justify-between pr-4">
      <div className="flex w-full items-center justify-between">
        <Link href="/" shallow={true}>
          <img
            className="relative top-6 h-auto w-[200px] flex-shrink-0 cursor-pointer"
            src={themeData.logoPath}
            alt="logo"
          />
        </Link>
        {!isOnline ? (
          <div className="absolute left-1/2 top-3 z-10 flex h-10 w-max -translate-x-1/2 items-center rounded-full bg-th-down px-4 py-2 md:top-8">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-th-fgd-1" />
            <p className="ml-2 text-th-fgd-1">
              Your connection appears to be offline
            </p>
          </div>
        ) : null}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-6 pr-4">
            <NavLink active={pathname === '/'} path="/" text="Boost!" />
            <NavLink active={pathname === '/faqs'} path="/faqs" text="FAQs" />
          </div>
          <ThemeToggle />
          {connected ? <ConnectedMenu /> : <ConnectWalletButton />}
        </div>
      </div>
    </div>
  )
}

export default TopBar

const NavLink = ({
  active,
  path,
  text,
}: {
  active: boolean
  path: string
  text: string
}) => {
  return (
    <Link href={path} shallow={true}>
      <span
        className={`default-transition border-b-4 border-th-active font-display text-xl md:hover:text-th-active ${
          active ? 'text-th-active' : 'text-th-bkg-1'
        }`}
      >
        {text}
      </span>
    </Link>
  )
}
