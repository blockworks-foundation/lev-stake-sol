import { useEffect, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
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
    <div className="mb-8 flex h-20 items-center justify-between px-6">
      <Link href="/" shallow={true}>
        <div className="group flex items-center">
          <BoostLogo className="h-auto w-10 shrink-0 cursor-pointer group-hover:animate-shake" />
          <span className="text-shadow ml-2 hidden text-[27px] font-black text-th-bkg-1 md:block">
            Boost!
          </span>
        </div>
      </Link>
      <div className="flex items-center justify-end space-x-2 md:space-x-4">
        <div className="px-2 md:px-4">
          <NavLink active={pathname === '/faqs'} path="/faqs" text="FAQs" />
        </div>
        <ThemeToggle />
        {connected ? <ConnectedMenu /> : <ConnectWalletButton />}
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
}: {
  active: boolean
  path: string
  text: string
}) => {
  return (
    <Link href={path} shallow={true}>
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
