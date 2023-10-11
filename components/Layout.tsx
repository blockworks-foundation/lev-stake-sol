import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import mangoStore from '@store/mangoStore'
import TopBar from './TopBar'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { ACCEPT_TERMS_KEY, SECONDS } from '../utils/constants'
import { useWallet } from '@solana/wallet-adapter-react'
import useInterval from './shared/useInterval'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import TermsOfUseModal from './modals/TermsOfUseModal'
import SunburstBackground from './SunburstBackground'
import Footer from './Footer'

export const sideBarAnimationDuration = 300
const termsLastUpdated = 1679441610978

const Layout = ({ children }: { children: ReactNode }) => {
  const themeData = mangoStore((s) => s.themeData)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <main
      className={`${themeData.fonts.body.variable} ${themeData.fonts.display.variable} font-sans bg-th-primary-2`}
    >
      <SunburstBackground className="text-th-primary-1" />
      <div className={`relative min-h-screen`}>
        {/* <div className="border-th-primary-4 from-th-primary-3 to-th-primary-2 absolute bottom-0 h-44 w-full border-b-[20px] bg-gradient-to-b" /> */}
        <div className="relative z-10">
          <TopBar />
          <div className="mx-auto max-w-3xl px-6 pb-20 lg:px-12">
            {children}
            <Footer />
          </div>
          <DeployRefreshManager />
          <TermsOfUse />
        </div>
      </div>
    </main>
  )
}

export default Layout

const TermsOfUse = () => {
  const { connected } = useWallet()
  const [acceptTerms, setAcceptTerms] = useLocalStorageState(
    ACCEPT_TERMS_KEY,
    '',
  )

  const showTermsOfUse = useMemo(() => {
    return (!acceptTerms || acceptTerms < termsLastUpdated) && connected
  }, [acceptTerms, connected])

  return (
    <>
      {showTermsOfUse ? (
        <TermsOfUseModal
          isOpen={showTermsOfUse}
          onClose={() => setAcceptTerms(Date.now())}
        />
      ) : null}
    </>
  )
}

function DeployRefreshManager(): JSX.Element | null {
  const { t } = useTranslation('common')
  const [newBuildAvailable, setNewBuildAvailable] = useState(false)

  useInterval(async () => {
    const response = await fetch('/api/build-id')
    const { buildId } = await response.json()

    if (buildId && process.env.BUILD_ID && buildId !== process.env.BUILD_ID) {
      // There's a new version deployed that we need to load
      setNewBuildAvailable(true)
    }
  }, 300 * SECONDS)

  return (
    <Transition
      appear={true}
      show={newBuildAvailable}
      as={Fragment}
      enter="transition ease-in duration-300"
      enterFrom="translate-y-0"
      enterTo="-translate-y-[130px] md:-translate-y-20"
      leave="transition ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <button
        className="default-transition fixed -bottom-[46px] left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border-2 border-th-fgd-1 bg-th-bkg-1 px-4 py-3 shadow-md focus:outline-none md:hover:bg-th-bkg-2 md:hover:shadow-none"
        onClick={() => window.location.reload()}
      >
        <p className="mr-2 whitespace-nowrap text-th-fgd-1">
          {t('new-version')}
        </p>
        <ArrowPathIcon className="h-5 w-5" />
      </button>
    </Transition>
  )
}
