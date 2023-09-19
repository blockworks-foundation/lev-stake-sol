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
            className={`default-transition h-12 rounded-full ${
              isDesktop ? 'w-48 pl-1.5' : 'w-12'
            } hover:bg-th-bkg-2 focus:outline-none focus-visible:bg-th-bkg-3`}
          >
            <div
              className="flex items-center justify-center md:justify-start"
              id="account-step-one"
            >
              {!mangoAccountLoading ? (
                <ProfileImage
                  imageSize="40"
                  placeholderSize="24"
                  isOwnerProfile
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-th-bkg-2">
                  <Loading className="h-6 w-6" />
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
                  {/* <p className="truncate pr-2 text-sm font-bold capitalize text-th-fgd-1">
                      {profileDetails?.profile_name
                        ? profileDetails.profile_name
                        : 'Profile Unavailabe'}
                    </p> */}
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
            <Popover.Panel className="absolute right-0 top-[52px] z-20 mt-1 w-48 space-y-1.5 rounded-md rounded-t-none bg-th-bkg-2 px-4 py-2.5 focus:outline-none">
              <button
                className="flex w-full flex-row items-center rounded-none py-0.5 text-sm font-normal focus:outline-none focus-visible:text-th-active md:hover:cursor-pointer md:hover:text-th-fgd-1"
                onClick={handleDisconnect}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <div className="pl-2 text-left">
                  <div className="pb-0.5">{t('disconnect')}</div>
                  {publicKey ? (
                    <div className="font-mono text-xs text-th-fgd-4">
                      {abbreviateAddress(publicKey)}
                    </div>
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
