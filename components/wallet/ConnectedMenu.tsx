import { Popover, Transition } from '@headlessui/react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import { Fragment, useCallback, useEffect } from 'react'
import mangoStore from '@store/mangoStore'
import { notify } from '../../utils/notifications'
import ProfileImage from '../profile/ProfileImage'
import { abbreviateAddress } from '../../utils/formatting'
import { useViewport } from 'hooks/useViewport'
import Loading from '@components/shared/Loading'

const set = mangoStore.getState().set
const actions = mangoStore.getState().actions

const ConnectedMenu = () => {
  const { t } = useTranslation('common')
  const { publicKey, disconnect, wallet } = useWallet()
  const { isDesktop } = useViewport()
  const loadProfileDetails = mangoStore((s) => s.profile.loadDetails)
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const mangoAccountLoading = mangoStore((s) => s.mangoAccount.initialLoad)

  const handleDisconnect = useCallback(() => {
    set((state) => {
      state.activityFeed.feed = []
      state.mangoAccount.current = undefined
      state.mangoAccounts = []
      state.mangoAccount.initialLoad = true
    })
    disconnect()
    notify({
      type: 'info',
      title: t('wallet-disconnected'),
    })
  }, [t, disconnect])

  useEffect(() => {
    if (publicKey && wallet && groupLoaded) {
      actions.connectMangoClientWithWallet(wallet)
      actions.fetchMangoAccounts(publicKey)
      actions.fetchProfileDetails(publicKey.toString())
      actions.fetchWalletTokens(publicKey)
    }
  }, [publicKey, wallet, groupLoaded])

  return (
    <>
      <Popover>
        <div className="relative">
          <Popover.Button
            className={`raised-button-neutral group flex h-12 items-center justify-center after:rounded-full md:justify-start ${
              isDesktop ? 'w-44' : 'w-12'
            } focus:outline-none`}
          >
            <div className="flex items-center group-hover:mt-1 group-active:mt-2 md:ml-1.5">
              {!mangoAccountLoading ? (
                <ProfileImage
                  imageSize={!isDesktop ? '32' : '40'}
                  placeholderSize={!isDesktop ? '20' : '24'}
                  isOwnerProfile
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-th-bkg-2 md:h-10 md:w-10">
                  <Loading className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              )}
              {!loadProfileDetails && isDesktop ? (
                <div className="ml-2.5 overflow-hidden text-left">
                  <p className="text-xs text-th-fgd-3">
                    {wallet?.adapter.name}
                  </p>
                  <p className="truncate pr-2 text-sm font-bold text-th-fgd-1">
                    {publicKey ? abbreviateAddress(publicKey) : ''}
                  </p>
                </div>
              ) : null}
            </div>
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
            <Popover.Panel className="absolute right-0 top-14 z-20 mt-1 w-44 space-y-1.5 rounded-xl border-2 border-th-fgd-1 bg-th-bkg-1 px-4 py-2.5 focus:outline-none">
              <button
                className="flex w-full flex-row items-center rounded-none py-0.5 text-sm font-bold focus:outline-none md:hover:cursor-pointer md:hover:text-th-fgd-4"
                onClick={handleDisconnect}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <div className="pl-2 text-left">
                  <span>{t('disconnect')}</span>
                  {publicKey ? (
                    <p className="text-xs font-medium text-th-fgd-4">
                      {abbreviateAddress(publicKey)}
                    </p>
                  ) : null}
                </div>
              </button>
            </Popover.Panel>
          </Transition>
        </div>
      </Popover>
    </>
  )
}

export default ConnectedMenu
