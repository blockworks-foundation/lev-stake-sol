import { Fragment, useEffect, useState } from 'react'
import {
  Bars3Icon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectedMenu from './wallet/ConnectedMenu'
import ConnectWalletButton from './wallet/ConnectWalletButton'
import useOnlineStatus from 'hooks/useOnlineStatus'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BoostLogo from './BoostLogo'
import { IconButton } from './shared/Button'
import { Transition } from '@headlessui/react'
import { useViewport } from 'hooks/useViewport'

const TopBar = () => {
  const { connected } = useWallet()
  const { isMobile } = useViewport()
  const [copied, setCopied] = useState('')
  const isOnline = useOnlineStatus()
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    setTimeout(() => setCopied(''), 2000)
  }, [copied])

  return (
    <div className="mb-8 grid h-20 grid-cols-3 px-6">
      <div className="col-span-1 flex items-center">
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
      <div className="col-span-1 flex items-center justify-center space-x-4">
        {!isMobile ? (
          <>
            <NavLink active={pathname === '/'} path="/" text="Boost!" />
            <NavLink
              active={pathname === '/stats'}
              path="/stats"
              text="Stats"
            />
            <NavLink active={pathname === '/faqs'} path="/faqs" text="FAQs" />
          </>
        ) : null}
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <div className="flex space-x-3">
          {isMobile ? <MobileNavigation /> : <ThemeToggle />}
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

const MobileNavigation = () => {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div className="lg:hidden">
      <div className="flex items-center space-x-2">
        <IconButton onClick={() => setShowMenu(true)} size="large">
          <Bars3Icon className="h-5 w-5" />
        </IconButton>
      </div>
      <MenuPanel showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  )
}

const MenuPanel = ({
  showMenu,
  setShowMenu,
}: {
  showMenu: boolean
  setShowMenu: (showMenu: boolean) => void
}) => {
  const closeOnClick = () => {
    setShowMenu(false)
  }

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-40 h-screen w-[90%] overflow-hidden bg-th-bkg-2 transition duration-300 ease-in-out ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end px-6 py-3">
          <IconButton onClick={() => setShowMenu(false)} hideBg size="medium">
            <XMarkIcon className="h-8 w-8" />
          </IconButton>
        </div>
        <div className="space-y-4 px-6">
          <Link
            className="block text-xl font-bold text-th-fgd-1"
            href="/"
            onClick={closeOnClick}
            shallow
          >
            Boost!
          </Link>
          <Link
            className="block text-xl font-bold text-th-fgd-1"
            href="/stats"
            onClick={closeOnClick}
            shallow
          >
            Stats
          </Link>
          <Link
            className="block text-xl font-bold text-th-fgd-1"
            href="/faqs"
            onClick={closeOnClick}
            shallow
          >
            FAQs
          </Link>
        </div>
        <div className="absolute bottom-8 right-8">
          <ThemeToggle />
        </div>
      </div>
      <Transition
        as={Fragment}
        show={showMenu}
        enter="transition-all ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all ease-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`fixed right-0 top-0 z-30 h-screen w-full backdrop-brightness-[0.3]`}
          aria-hidden="true"
        />
      </Transition>
    </>
  )
}

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
        className={`default-transition flex items-center rounded-md border-th-bkg-3 bg-th-bkg-1 px-2 py-0.5 text-sm font-bold md:text-base md:hover:text-th-link-hover ${
          active ? 'border-t-2 text-th-fgd-1' : 'border-b-2 text-th-fgd-4'
        }`}
      >
        {text}
      </span>
    </Link>
  )
}
