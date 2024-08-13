import Image from 'next/image'
import ButtonLink from '../shared/ButtonLink'
import Tvl from './Tvl'
import NumberBg from '@components/icons/NumberBg'
import Ottersec from '@components/icons/Ottersec'
import TokenParticles from './TokenParticles'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import BestApy from './BestApy'
import { ZigZagLine } from '@components/NavTabs'
import { FAQS } from '@components/faqs/FaqsPage'
import { usePlausible } from 'next-plausible'

const WRAPPER_Y_PADDING = 'py-12 md:py-20'

const HomePage = () => {
  const plausible = usePlausible()
  return (
    <>
      <div className={`flex flex-col items-center ${WRAPPER_Y_PADDING} px-6`}>
        <span className="mb-8 rounded-md bg-black px-2 py-1 font-bold text-light-theme-primary-2">
          Earn up to <BestApy /> APY
        </span>
        <h1 className="text-shadow mb-2 text-center text-3xl text-th-button-text md:text-6xl">
          For the Yield Fans.
        </h1>
        <p className="mb-8 text-center text-xl">
          Multiply your yield on Solana&apos;s best yield farm.
        </p>
        <ButtonLink
          path="/dashboard"
          onClick={() => {
            plausible('HomeCtaClick', {
              props: {
                button: 'hero panel',
              },
            })
          }}
        >
          Launch App
        </ButtonLink>
      </div>
      <div
        className={`flex flex-col items-center bg-th-bkg-1 ${WRAPPER_Y_PADDING} relative`}
      >
        <TokenParticles />
        <Tvl />
      </div>
      <div className={`bg-th-primary-1 ${WRAPPER_Y_PADDING}`}>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-6 px-6 md:gap-12 md:px-0">
            <div className="hidden lg:block">
              <img
                className="h-auto w-64"
                src="/images/positions-mock.png"
                alt="Positions example"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-shadow text-3xl text-th-button-text md:text-5xl">
                Getting started is easy.
              </h2>
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10">
                  <NumberBg className="h-10 w-10 text-black" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-light-theme-primary-2">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 leading-none">Choose a token</h3>
                  <p>Choose a token with a juicy APY to deposit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10">
                  <NumberBg className="h-10 w-10 text-black" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-light-theme-primary-2">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 leading-none">Select your leverage</h3>
                  <p>
                    Wind up the leverage. The more you add the riskier your
                    position is.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10">
                  <NumberBg className="h-10 w-10 text-black" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-light-theme-primary-2">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 leading-none">Monitor your position</h3>
                  <p>
                    Keep an eye on your earnings, liqudation risk and borrowing
                    costs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Image
                  src="/logos/yieldfan.png"
                  alt="Logo"
                  height={40}
                  width={40}
                />
                <div>
                  <h3 className="mb-2 leading-none">Enjoy your extra yield</h3>
                  <p>You can withdraw your position at any time. No lockups.</p>
                </div>
              </div>
              <div className="pt-2">
                <ButtonLink
                  path="/dashboard"
                  onClick={() => {
                    plausible('HomeCtaClick', {
                      props: {
                        button: 'get started',
                      },
                    })
                  }}
                >
                  Get Started
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${WRAPPER_Y_PADDING}`}>
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <h2 className="text-shadow mb-4 text-center text-3xl text-th-button-text md:text-5xl">
            Audits. Audits. Audits.
          </h2>
          <p className="mb-6 text-center text-xl">
            Yield Fan is powered by{' '}
            <a
              href="https://mango.markets"
              target="_blank"
              rel="noreferrer noopenner"
            >
              Mango&apos;s
            </a>{' '}
            extensively audited contracts. Most protocols call it quits after
            one audit. Our contracts are audited after every program change.
          </p>
          <Ottersec className="h-10 w-auto text-th-fgd-1" />
        </div>
      </div>
      <div className={`bg-th-primary-1 ${WRAPPER_Y_PADDING}`}>
        <div className="px-6">
          <h2 className="text-shadow mb-6 text-center text-3xl text-th-button-text md:text-5xl">
            FAQs
          </h2>
          <div className="mx-auto max-w-3xl space-y-2">
            {FAQS.map((faq) => {
              const { question, answer } = faq
              return (
                <Disclosure key={question}>
                  {({ open }) => (
                    <div>
                      <Disclosure.Button
                        className={`default-transition w-full rounded-xl bg-th-bkg-1 px-6 py-5 text-left focus:outline-none ${
                          open
                            ? 'rounded-b-none border-b-0'
                            : 'inner-shadow-bottom-sm md:hover:bg-th-bkg-2'
                        }`}
                        onClick={() => {
                          if (!open) {
                            plausible('FaqClick', {
                              props: {
                                faqClicked: question,
                              },
                            })
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold">{question}</p>
                          <ChevronDownIcon
                            className={`${
                              open ? 'rotate-180' : 'rotate-360'
                            } h-6 w-6 shrink-0 text-th-fgd-1`}
                          />
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="inner-shadow-bottom-sm space-y-2 rounded-xl rounded-t-none bg-th-bkg-1 px-6 pb-4">
                        {answer}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              )
            })}
          </div>
        </div>
      </div>
      <div className={`${WRAPPER_Y_PADDING} px-6`}>
        <div className="mx-auto max-w-3xl rounded-2xl bg-th-bkg-1 p-12">
          <div className="relative flex flex-col items-center">
            <ZigZagLine className="absolute -bottom-6 w-20" reverse />
            <ZigZagLine className="absolute -top-4 w-20" reverse />
            <p className="mb-2 text-th-fgd-4">Earn up to</p>
            <span className="mb-4 text-4xl font-bold text-th-fgd-1 md:text-5xl">
              <BestApy /> APY
            </span>
            <ButtonLink
              path="/dashboard"
              size="small"
              onClick={() => {
                plausible('HomeCtaClick', {
                  props: {
                    button: 'top apy bottom panel',
                  },
                })
              }}
            >
              Let&apos;s Go
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
