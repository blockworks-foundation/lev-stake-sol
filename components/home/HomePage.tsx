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

const FAQS = [
  {
    question: 'How does it work?',
    answer: (
      <>
        <h4>JLP</h4>
        <p>
          Adding leverage to JLP works by using your deposited JLP as collateral
          to borrow USDC which is then swapped to JLP. This leaves you with an
          increased balance of JLP and a borrowed amount of USDC.
        </p>
        <p>The JLP pool is completely isolated from Mango v4.</p>
        <h4>Liquid staking tokens (LSTs)</h4>
        <p>
          Adding leverage to liquid staking tokens (mSOL, JitoSOL, bSOL etc)
          works by using your deposited token as collateral to borrow SOL which
          is then swapped to more of your deposited token. This leaves you with
          an increased balance of your LST and a borrowed amount of USDC.
        </p>
        <p>
          The pools for LSTs on yield.fan draw from the same liquidity available
          on Mango v4.
        </p>
        <h4>USDC</h4>
        <p>
          USDC is part of the isolated JLP group. When you deposit USDC it will
          be lent out to users adding leverage to JLP. You earn a varialbe
          interest rate in return that is determined by the amount of USDC
          deposited and the amount borrowed.
        </p>
      </>
    ),
  },
  {
    question: 'How do I withdraw?',
    answer: (
      <>
        <h4>JLP/Liquid staking tokens</h4>
        <p>
          Withdrawals work by unwinding your leveraged position. Your borrow
          will be repaid by swapping the token you leveraged to the token you
          borrowed with the remainder being withdrawn to your wallet.
        </p>
        <p>
          There are no fees associated with withdrawals however, there could be
          up to 1% slippage when swapping to repay your loan.
        </p>
        <h4>USDC</h4>
        <p>
          Withdrawing USDC removes it from the lending pool and withdraws it to
          your wallet.
        </p>
        <p>There are no fees associated with withdrawing USDC.</p>
      </>
    ),
  },
  {
    question: 'Why would I want to add leverage?',
    answer: (
      <>
        <h4>JLP/Liquid staking tokens</h4>
        <p>
          The tokens listed on yield.fan (excluding USDC) all have native yield
          so in the right market conditions you can borrow to increase your
          exposure to this native yield. When the extra yield is larger than
          your cost of borrowing you earn more yield than you would by simply
          holding the token.
        </p>
        <h4>USDC</h4>
        <p>
          USDC is different in that when you deposit USDC you are adding it to
          the lending pool for users adding leverage to JLP. There is no
          leverage involved and JLP borrowers pay a variable interest rate to
          borrow your USDC.
        </p>
      </>
    ),
  },
  {
    question: 'Is adding leverage always profitable?',
    answer: (
      <>
        <h4>JLP/Liquid staking tokens</h4>
        <p>
          No. For one, there is a risk of liquidation (especially when
          leveraging JLP). If the price of your leveraged token drops below your
          liquidation threshold you will lose some or all of your funds. This
          risk increases with the amount of leverage you use.
        </p>
        <p>
          There are also fees and costs for borrowing that will affect your
          positions profitability. To earn more yield than simply holding JLP or
          an LST the cost of borrowing needs to be less than the additional
          yield you earn.
        </p>
        <h4>USDC</h4>
        <p>
          Depositing USDC is always profitable unless there is a systemic
          failure that results in loss of funds. See the risks FAQ to learn
          about some of the potential risks of using yield.fan
        </p>
      </>
    ),
  },
  {
    question: 'What are the costs/fees?',
    answer: (
      <>
        <p>The costs and fees depend on the token you are leveraging.</p>
        <h4>JLP/Liquid staking tokens</h4>
        <p className="font-bold">Borrow Interest Rate</p>
        <p>
          This variable APR can change significantly and frequently depending on
          the ratio of deposits and borrows. It is charged continuosly on the
          balance of your USDC or SOL borrow and paid to USDC depositors
          (lenders) on yield.fan and SOL depositors on Mango v4.
        </p>
        <p className="font-bold">Loan Origination Fee</p>
        <p>
          This is a one-time, 50 basis points (0.5%) fee applied to the total
          balance of your borrow and paid to Mango DAO.
        </p>
        <p className="font-bold">Collateral Fee (JLP Only)</p>
        <p>
          This is charged on your JLP collateral once every two days as
          insurance for JLP suffering a catastrophic failure resulting in bad
          debt. It will reduce the size of your JLP position over time. The fee
          accrues to Mango DAO.
        </p>
        <p>
          The collateral fee is a dynamic formula that uses a fixed Annual
          Percentage Rate (APR) of 41%. This rate is then multiplied by the
          ratio of your USDC liabilities (the amount you&apos;ve borrowed)
          against your &quot;weighted&quot; JLP deposits (the value of your
          position adjusted by a factor between 0 and 1). The JLP weight is
          currently set at 0.9.
        </p>
        <p>
          The key aspect of this fee is its dynamism; it scales with your
          position&apos;s proximity to the liquidation price. Positions closer
          to liquidation are subjected to a higher fee, reflecting increased
          risk, while positions further from liquidation incur a lower fee.
          Consequently, the more leverage you take on the more collateral fees
          you&apos;ll pay.
        </p>
        <p className="font-bold">Position Entry Costs</p>
        <p>
          When adding funds the USDC or SOL you borrow gets swapped via Jupiter
          to more of your leveraged token. This can incur up to 1% slippage
          resulting in an entry price worse than expected.
        </p>
        <h4>USDC</h4>
        <p>There are no fees associated with depositing USDC.</p>
      </>
    ),
  },
  {
    question: 'Why is my "Total Earned" negative?',
    answer: (
      <>
        <p>
          When you open a leveraged position there are some immediate costs
          associated with borrowing. You&apos;ll be paying a loan origination
          fee, interest on the borrowed amount, and a collateral fee (if adding
          leverage to JLP) instantaneously. Over time and in the right market
          conditions your &quot;Total Earned&quot; will become positive.
        </p>
      </>
    ),
  },
  {
    question: 'What are the risks?',
    answer: (
      <>
        <p>
          The following risks are non-exhaustive. It&apos;s important to have a
          good understanding of these risks and how yield.fan works before
          depositing any funds
        </p>
        <h4>Code</h4>
        <p>
          yield.fan is an integration with the Mango v4 program. Although it is
          open source and has been audited extensively, it&apos;s possible bugs
          and exploits exist that could result in the loss of funds. It&apos;s
          also possible for a bug in the UI to affect the ability to open and
          close positions in a timely manner.
        </p>
        <h4>Price Depeg</h4>
        <p>
          It&apos;s possible for the staking token price to diverge
          significantly from the USDC price. A large drop in price could result
          in postions being liquidated. Positions with higher leverage are more
          exposed to this risk.
        </p>
        <h4>Liquidity</h4>
        <p>
          Opening and closing positions relies on swapping between the staking
          tokens and USDC without significant price impact. During an extreme
          market event there could be issues liquidating positions effectively.
          This could affect the liquidity available to open/close positions.
        </p>
        <h4>Oracles</h4>
        <p>
          The price data comes from third party oracle providers. It&apos;s
          possible for the data to be incorrect due to a failure with the oracle
          provider. This could result in bad liquidations and loss of funds.
        </p>
        <h4>Yield Duration</h4>
        <p>
          When you borrow USDC or SOL to open a position you&apos;ll be paying
          an initial loan origination fee, interest on the borrowed amount, and
          a collateral fee instantaneously. This means you could open a position
          and close it before earning any additional yeild, whilst paying
          interest and collateral fees to borrow USDC or SOL.
        </p>
      </>
    ),
  },
  {
    question: 'Where does the yield come from?',
    answer: (
      <p>
        The price of JLP vs USDC. JLP is a liquidity pool provider token
        composed of assets, trading fees and traders profits and losses.
        yield.fan increases the position size of your staking token by borrowing
        USDC. This means you earn more of the staking reward every epoch.
        It&apos;s important to account for the cost of borrowing USDC. This is
        displayed in the UI.
      </p>
    ),
  },
  {
    question: 'Why is my Ledger not working?',
    answer: (
      <p>
        If your Ledger isn&apos;t working it&apos;s most likely because it
        doesn&apos;t support versioned transactions.
      </p>
    ),
  },
]

const WRAPPER_Y_PADDING = 'py-12 md:py-20'

const HomePage = () => {
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
        <ButtonLink path="/dashboard">Launch App</ButtonLink>
      </div>
      <div
        className={`flex flex-col items-center bg-th-bkg-1 ${WRAPPER_Y_PADDING} relative`}
      >
        <TokenParticles />
        <Tvl />
      </div>
      <div className={`bg-th-primary-1 ${WRAPPER_Y_PADDING}`}>
        <div className="flex items-center justify-center gap-6 px-6 md:gap-12 md:px-12">
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
              <ButtonLink path="/dashboard">Get Started</ButtonLink>
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
            extensively audited contracts. Most protocals call it quits after
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
            <ButtonLink path="/dashboard" size="small">
              Let&apos;s Go
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
