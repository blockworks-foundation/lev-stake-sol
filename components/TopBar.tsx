import { useEffect, useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectedMenu from './wallet/ConnectedMenu'
import ConnectWalletButton from './wallet/ConnectWalletButton'
// import SolanaTps from './SolanaTps'
import useOnlineStatus from 'hooks/useOnlineStatus'
import mangoStore from '@store/mangoStore'
import ThemeToggle from './ThemeToggle'

const TopBar = () => {
  const { connected } = useWallet()
  const themeData = mangoStore((s) => s.themeData)

  const [copied, setCopied] = useState('')
  const isOnline = useOnlineStatus()

  useEffect(() => {
    setTimeout(() => setCopied(''), 2000)
  }, [copied])

  return (
    <div className="mb-8 flex h-20 items-center justify-between pr-4">
      <div className="flex w-full items-center justify-between">
        <img
          className="relative top-6 h-auto w-[200px] flex-shrink-0"
          src={themeData.logoPath}
          alt="logo"
        />
        {!isOnline ? (
          <div className="bg-th-down absolute left-1/2 top-3 z-10 flex h-10 w-max -translate-x-1/2 items-center rounded-full px-4 py-2 md:top-8">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-th-fgd-1" />
            <p className="ml-2 text-th-fgd-1">
              Your connection appears to be offline
            </p>
          </div>
        ) : null}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {connected ? <ConnectedMenu /> : <ConnectWalletButton />}
        </div>
      </div>
    </div>
  )
}

export default TopBar
