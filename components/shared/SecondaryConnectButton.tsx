import { useTranslation } from 'react-i18next'
import Button from './Button'
import { useWallet } from '@solana/wallet-adapter-react'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { LAST_WALLET_NAME } from 'utils/constants'
import { notify } from 'utils/notifications'
import { useCallback } from 'react'
import WalletIcon from '@components/icons/WalletIcon'

const SecondaryConnectButton = ({
  className,
  isLarge,
}: {
  className?: string
  isLarge?: boolean
}) => {
  const { t } = useTranslation('common')
  const { connect, wallet, wallets, select } = useWallet()
  const [lastWalletName] = useLocalStorageState<WalletName | null>(
    LAST_WALLET_NAME,
    '',
  )

  const handleConnect = useCallback(() => {
    if (wallet) {
      connect()
    } else if (lastWalletName) {
      select(lastWalletName)
    } else {
      const walletToConnect = wallets.find(
        (w) =>
          w.readyState === WalletReadyState.Installed ||
          w.readyState === WalletReadyState.Loadable,
      )
      if (walletToConnect) {
        select(walletToConnect.adapter.name)
      } else {
        notify({
          title: 'No wallet found. Install a Solana wallet and try again',
          type: 'error',
        })
      }
    }
  }, [connect, lastWalletName, select, wallet, wallets])

  return (
    <Button
      className={className}
      onClick={handleConnect}
      size={isLarge ? 'large' : 'medium'}
    >
      <div className="flex items-center">
        <WalletIcon className="icon-shadow mr-1.5 h-5 w-5" />
        <span>{t('connect')}</span>
      </div>
    </Button>
  )
}

export default SecondaryConnectButton
