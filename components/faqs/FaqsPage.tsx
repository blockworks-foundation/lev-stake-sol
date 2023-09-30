import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const FAQS = [
  {
    question: 'How does unboosting work?',
    answer:
      'Unboosting your position involves selling some of your stake deposits to repay any SOL borrowings. Once SOL debts are settled, you can retrieve your staked holdings. Be mindful that potential losses might occur due to factors like price changes, slippage, and transaction fees.',
  },
  {
    question: 'Why is the max leverage different between tokens?',
    answer:
      'The max leverage changes based on the asset and liability weights of the staked token which are determined by the Mango smart contract.',
  },
  {
    question: 'Is the contract audited?',
    answer:
      'The underlying mango smart contract is audited by OtterSec https://osec.io/',
  },
]

const FaqsPage = () => {
  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1 className="mb-1">FAQs</h1>
      <div className="space-y-2">
        <Disclosure key={'How does Boost! work?'}>
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
        </Disclosure>
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
                    <p>{answer}</p>
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
