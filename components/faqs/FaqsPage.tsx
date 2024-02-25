import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const FAQS = [
  {
    question: 'How does Boost! work?',
    answer: (
      <p>
        Boost! allows you to increase your position size by borrowing USDC and
        swapping it for JLP. This means you earn more yield
        from JLP due to a larger position size. As long
        as this yield exceeds the rate of the USDC borrow and collateral fees, you earn a premium.
      </p>
    ),
  },
  {
    question: 'How does unboosting work?',
    answer: (
      <p>
        Unboosting works by selling some of your JLP token to repay your USDC borrow
        and withdrawing to your wallet. If the JLP token price increases enough to cover your borrow fee and collateral fee, you will earn a higher APY over time.
      </p>
    ),
  },
  {
    question: 'What are the risks?',
    answer: (
      <>
        <p>
          The following risks are non-exhaustive. It&apos;s important to have a
          good understanding of these risks and how Boost! works before
          depositing any funds
        </p>
        <h4>Code</h4>
        <p>
          Boost! is an integration with the Mango v4 program. Although it is
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
          Opening and closing positions on Boost! relies on swapping between the
          staking tokens and USDC without significant price impact. During an
          extreme market event there could be issues liquidating position
          effectively. This could affect the liquidity available to open/close
          positions.
        </p>
        <h4>Oracles</h4>
        <p>
          The price data for Boost! comes from third party oracle providers.
          It&apos;s possible for the data to be incorrect due to a failure with
          the oracle provider. This could result in bad liquidations and loss of
          funds.
        </p>
        <h4>Yield Duration</h4>
        <p>
          When you borrow USDC to open a position on Boost! you&apos;ll be paying
          an initial loan origination fee, interest on the borrowed amount, and a collateral fee instantaneously. This means you
          could open a position and close it before earning any additional yeild,
          whilst paying interest and collateral fees to borrow USDC.
        </p>
      </>
    ),
  },
  {
    question: 'Where does the yield come from?',
    answer: (
      <p>
        The price of JLP vs USDC. JLP is a liquidity pool provider token composed of assets, trading fees and traders profits and losses. Boost!
        increases the position size of your staking token by borrowing USDC. This
        means you earn more of the staking reward every epoch. It&apos;s
        important to account for the cost of borrowing USDC. This is displayed in
        the UI.
      </p>
    ),
  },
  {
    question: 'Why is my Ledger not working with Boost!?',
    answer: (
      <p>
        If your Ledger isn&apos;t working it&apos;s most likely because it
        doesn&apos;t support versioned transactions.
      </p>
    ),
  },
  {
    question: 'Who made Boost!?',
    answer: (
      <p>
        Boost! is made and maintained by long-term contributors to{' '}
        <a
          href="https://dao.mango.markets"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mango DAO
        </a>
        .
      </p>
    ),
  },
]

const FaqsPage = () => {
  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1 className="mb-4">FAQs</h1>
      <div className="space-y-2">
        {/* <Disclosure key={'How does Boost! work?'}>
          {({ open }) => (
            <div>
              <Disclosure.Button
                className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${
                  open ? 'rounded-b-none border-b-0' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{'How does Boost! work?'}</p>
                  <ChevronDownIcon
                    className={`${
                      open ? 'rotate-180' : ''
                    } h-6 w-6 shrink-0 text-th-fgd-1`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                <p>
                  Leveraged staking with Boost! amplifies yields by recursively
                  borrowing and lending between SOL and its supported tokens:
                  mSOL, jitoSOL, bSOL, and stSOL. Users can deposit any of these
                  tokens and then borrow SOL to enhance their returns.
                </p>

                <p>Example with jitoSOL:</p>
                <ul className="list-inside list-disc">
                  <li>
                    A user deposits jitoSOL into Mango&apos;s borrowing/lending
                    program via Boost!.
                  </li>
                  <li>
                    Boost! then leverages the deposited jitoSOL to borrow SOL,
                    based on the user&apos;s desired leverage ratio on Mango.
                  </li>
                  <li>
                    This process effectively increases the user&apos;s position
                    size in jitoSOL, amplifying the base yield.
                  </li>
                </ul>

                <p>
                  When the returns from staking surpass the costs of borrowing,
                  users enjoy a premium from this enhanced staking with Boost!.
                </p>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Disclosure key={'What are the risks?'}>
          {({ open }) => (
            <div>
              <Disclosure.Button
                className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${
                  open ? 'rounded-b-none border-b-0' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{'What are the risks?'}</p>
                  <ChevronDownIcon
                    className={`${
                      open ? 'rotate-180' : ''
                    } h-6 w-6 shrink-0 text-th-fgd-1`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                <ul className="list-inside list-disc">
                  <li>
                    There&apos;s a risk that tokens like mSOL, jitoSOL, bSOL, or
                    stSOL may deviate significantly from the SOL price. If the
                    token prices drop by 20% or SOL gains a premium of 18.5%,
                    your position may face liquidation, particularly for high
                    leverage positions. Deppegs, although infrequent, can occur
                    due to market liquidity, pricing anomalies, or smart
                    contract bugs.
                  </li>

                  <li>
                    Liquidity pertains to quickly converting staked tokens into
                    SOL without major price impact.
                  </li>

                  <li>
                    The underlying liqduid staking tokens as well as Mango are
                    susceptible to risks linked to smart contract flaws and UI
                    mishaps, which might lead to unexpected results or fund
                    losses.
                  </li>

                  <li>
                    If your margin ratio falls below maintenance, you risk
                    liquidation. A drop in staked asset value below the
                    maintenance margin can result in partial or total sale of
                    your collateral. Your liquidation ratio is displayed in the
                    user interface.
                  </li>

                  <li>
                    Mango depends on external oracles for pricing. Inaccuracies
                    from these oracles, whether due to technical issues,
                    manipulation, etc., can cause undesired liquidations,
                    potentially causing losses.
                  </li>

                  <li>
                    Instant SOL borrow interest payments contrast with token
                    staking rewards paid every epoch (~2.5 days). Thus, users
                    entering and exiting within these boundaries might pay
                    interest without gaining staking rewards. It&apos;s vital to
                    be familiar with{' '}
                    <a href="https://docs.solana.com/cluster/stake-delegation-and-rewards">
                      Solana staking mechanics
                    </a>
                    .
                  </li>
                </ul>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure> */}
        {FAQS.map((faq) => {
          const { question, answer } = faq
          return (
            <Disclosure key={question}>
              {({ open }) => (
                <div>
                  <Disclosure.Button
                    className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${
                      open ? 'rounded-b-none border-b-0' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{question}</p>
                      <ChevronDownIcon
                        className={`${
                          open ? 'rotate-180' : 'rotate-360'
                        } h-6 w-6 flex-shrink-0 text-th-fgd-1`}
                      />
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                    {answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          )
        })}
      </div>
    </div>
  )
}

export default FaqsPage
