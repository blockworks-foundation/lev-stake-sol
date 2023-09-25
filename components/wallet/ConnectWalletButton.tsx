import React, { Fragment, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { LAST_WALLET_NAME } from 'utils/constants'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import mangoStore from '@store/mangoStore'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'

export default function ConnectWalletButton() {
  const { t } = useTranslation('common')
  const { wallet, wallets, select, connected, connect } = useWallet()
  const mangoAccountLoading = mangoStore((s) => s.mangoAccount.initialLoad)
  const [lastWalletName] = useLocalStorageState<WalletName | null>(
    LAST_WALLET_NAME,
    '',
  )

  const detectedWallets = useMemo(() => {
    return wallets.filter(
      (w) =>
        w.readyState === WalletReadyState.Installed ||
        w.readyState === WalletReadyState.Loadable,
    )
  }, [wallets])

  const walletIcon = useMemo(() => {
    const wallet = wallets.find((w) => w.adapter.name === lastWalletName)
    return wallet?.adapter.icon || wallets[0]?.adapter.icon
  }, [wallets, lastWalletName])

  return (
    <div className="relative">
      <div className="raised-button-neutral flex h-12 w-44 items-center rounded-full bg-th-bkg-3">
        <button
          onClick={() => {
            if (wallet) {
              connect()
            } else {
              select(lastWalletName)
            }
          }}
          className="relative flex h-12 rounded-full"
        >
          <div className="relative z-10 flex h-full items-center justify-center space-x-2 px-4">
            {connected && mangoAccountLoading ? (
              <div></div>
            ) : (
              <div
                className={`flex h-[28px] w-[28px] items-center justify-center rounded-full ${
                  wallet?.adapter.name === 'Solflare' ? 'bg-black' : ''
                }`}
              >
                <img
                  src={walletIcon}
                  className={`
                      ${
                        wallet?.adapter.name === 'Solflare'
                          ? 'h-auto w-[20px]'
                          : 'h-auto w-[28px]'
                      }`}
                  alt={`${wallet?.adapter.name} icon`}
                />
              </div>
            )}
            <div className="text-left">
              <div className="text-sm font-bold text-th-fgd-1">
                {t('connect')}
              </div>

              <div className="text-xs font-normal leading-none text-th-fgd-3">
                {lastWalletName}
              </div>
            </div>
          </div>
        </button>
      </div>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className={`absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-th-bkg-2 text-th-fgd-3 focus:outline-none focus-visible:bg-th-bkg-3 md:hover:bg-th-bkg-3`}
            >
              <ChevronDownIcon
                className={`h-6 w-6 flex-shrink-0 ${
                  open ? 'rotate-180' : 'rotate-360'
                }`}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-in duration-200"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="transition ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel className="absolute right-0 top-14 z-20 mt-1 w-44 space-y-2 rounded-xl border-2 border-th-fgd-1 bg-th-bkg-1 px-4 py-2.5 focus:outline-none">
                {detectedWallets.map((wallet, index) => (
                  <button
                    className="flex w-full flex-row items-center rounded-none py-0.5 text-sm font-bold focus:outline-none md:hover:cursor-pointer md:hover:text-th-fgd-4"
                    onClick={() => {
                      select(wallet.adapter.name)
                    }}
                    key={wallet.adapter.name + index}
                  >
                    <div className="flex items-center">
                      <img
                        src={wallet.adapter.icon}
                        className="mr-2.5 h-5 w-5"
                        alt={`${wallet.adapter.name} icon`}
                      />
                      {wallet.adapter.name}
                    </div>
                  </button>
                ))}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
