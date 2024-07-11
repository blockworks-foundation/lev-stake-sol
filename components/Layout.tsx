import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import mangoStore from '@store/mangoStore'
import TopBar from './TopBar'
import useLocalStorageState from '../hooks/useLocalStorageState'
import {
  ACCEPT_TERMS_KEY,
  SECONDS,
  YIELD_FANS_INTRO_KEY,
} from '../utils/constants'
import useInterval from './shared/useInterval'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import TermsOfUseModal from './modals/TermsOfUseModal'
import SunburstBackground from './SunburstBackground'
import Footer from './Footer'
import useIpAddress from 'hooks/useIpAddress'
import RestrictedCountryModal from './shared/RestrictedCountryModal'
import { useRouter } from 'next/router'
import Modal from './shared/Modal'
import { ModalProps } from 'types/modal'
import Button from './shared/Button'
import Image from 'next/image'

export const NON_RESTRICTED_JURISDICTION_KEY = 'non-restricted-jurisdiction-0.1'

export const sideBarAnimationDuration = 300
const termsLastUpdated = 1679441610978

const Layout = ({ children }: { children: ReactNode }) => {
  const { ipCountry, loadingIpCountry } = useIpAddress()
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
          <div className="mx-auto max-w-3xl px-6 pb-20 md:pb-12 lg:px-12">
            {children}
            <Footer />
          </div>
          <DeployRefreshManager />
          <TermsOfUse />
          <YieldFansIntro />
          <RestrictedCountryCheck
            ipCountry={ipCountry}
            loadingIpCountry={loadingIpCountry}
          />
        </div>
      </div>
    </main>
  )
}

export default Layout

const TermsOfUse = () => {
  const { asPath } = useRouter()
  const [acceptTerms, setAcceptTerms] = useLocalStorageState(
    ACCEPT_TERMS_KEY,
    '',
  )
  const [, setYieldFansIntro] = useLocalStorageState(
    YIELD_FANS_INTRO_KEY,
    false,
  )

  const showTermsOfUse = useMemo(() => {
    return (
      (!acceptTerms || acceptTerms < termsLastUpdated) && asPath !== '/risks'
    )
  }, [acceptTerms, asPath])

  const handleClose = () => {
    setAcceptTerms(Date.now())
    setYieldFansIntro(true)
  }

  return (
    <>
      {showTermsOfUse ? (
        <TermsOfUseModal isOpen={showTermsOfUse} onClose={handleClose} />
      ) : null}
    </>
  )
}

const YieldFansIntro = () => {
  const [acceptTerms] = useLocalStorageState(ACCEPT_TERMS_KEY, '')
  const [yieldFansIntro, setYieldFansIntro] = useLocalStorageState(
    YIELD_FANS_INTRO_KEY,
    false,
  )

  const showModal = useMemo(() => {
    return acceptTerms && !yieldFansIntro
  }, [acceptTerms, yieldFansIntro])

  return showModal ? (
    <Modal isOpen={showModal} onClose={() => setYieldFansIntro(true)}>
      <div className="flex flex-col items-center">
        <Image
          className="mb-3"
          src="/logos/yield-fans.png"
          alt="Logo"
          height={48}
          width={48}
        />
        <h2 className="mb-1 text-center">New name. Same APYs.</h2>
        <p className="text-center">
          Are you a fan of epic yields? Boost! is now yield.fan
        </p>
        <Button
          className="mt-6"
          onClick={() => setYieldFansIntro(true)}
          size="medium"
        >
          Let&apos;s Go
        </Button>
      </div>
    </Modal>
  ) : null
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
        className="default-transition fixed bottom-[-46px] left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border-2 border-th-fgd-1 bg-th-bkg-1 px-4 py-3 shadow-md focus:outline-none md:hover:bg-th-bkg-2 md:hover:shadow-none"
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

const RestrictedCountryCheck = ({
  ipCountry,
  loadingIpCountry,
}: {
  ipCountry: string
  loadingIpCountry: boolean
}) => {
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const [confirmedCountry, setConfirmedCountry] = useLocalStorageState(
    NON_RESTRICTED_JURISDICTION_KEY,
    false,
  )

  const showModal = useMemo(() => {
    return !confirmedCountry && !ipCountry && !loadingIpCountry && groupLoaded
  }, [confirmedCountry, ipCountry, loadingIpCountry, groupLoaded])

  return showModal ? (
    <RestrictedCountryModal
      isOpen={showModal}
      onClose={() => {
        setConfirmedCountry(true)
      }}
    />
  ) : null
}
