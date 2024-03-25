import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const FAQS = [
  {
    question: 'Why would I want to Boost!?',
    answer: (
      <>
        <h3>JLP/Liquid staking tokens</h3>
        <p>
          Boost! let&apos;s you easily add leverage to your token positions. The
          tokens listed on Boost! (excluding USDC) all have native yield so in
          the right market conditions you can borrow to increase your exposure
          to this native yield. When the extra yield is larger than your cost of
          borrowing you earn more yield than you would by simply holding the
          token.
        </p>
        <h3>USDC</h3>
        <p>
          Boosting USDC is different in that when you deposit USDC you are
          adding it to the lending pool for JLP boosters. There is no leverage
          involved and JLP borrowers pay a variable interest rate to borrow your
          USDC.
        </p>
      </>
    ),
  },
  {
    question: 'How does Boost! work?',
    answer: (
      <>
        <h3>JLP</h3>
        <p>
          Boosting JLP works by using your deposited JLP as collateral to borrow
          USDC which is then swapped to JLP. This leaves you with an increased
          balance of JLP and a borrowed amount of USDC.
        </p>
        <p>The JLP pool is completely isolated from Mango v4.</p>
        <h3>Liquid staking tokens (LSTs)</h3>
        <p>
          Boosting liquid staking tokens (mSOL, JitoSOL, bSOL etc) works by
          using your deposited token as collateral to borrow SOL which is then
          swapped to more of your deposited token. This leaves you with an
          increased balance of your LST and a borrowed amount of USDC.
        </p>
        <p>
          The pools for LSTs on Boost! draw from the same liquidity available on
          Mango v4.
        </p>
        <h3>USDC</h3>
        <p>
          USDC is part of the isolated JLP group. When you deposit USDC it will
          be lent out to JLP boosters. You earn a varialbe interest rate in
          return that is determined by the amount of USDC deposited and the
          amount borrowed.
        </p>
      </>
    ),
  },
  {
    question: 'How does unboosting work?',
    answer: (
      <>
        <h3>JLP/Liquid staking tokens</h3>
        <p>
          Unboosting works by unwinding your leveraged position. Your borrow
          will be repaid by swapping the token you boosted to the token you
          borrowed with the remainder being withdrawn to your wallet.
        </p>
        <p>
          There are no fees associated with unboosting however, there could be
          up to 1% slippage when swapping to repay your loan.
        </p>
        <h3>USDC</h3>
        <p>
          Unboosting USDC removes it from the lending pool and withdraws it to
          your wallet.
        </p>
        <p>There are no fees associated with unboosting USDC.</p>
      </>
    ),
  },
  {
    question: 'Is boosting always profitalbe?',
    answer: (
      <>
        <h3>JLP/Liquid staking tokens</h3>
        <p>
          No. For one, there is a risk of liquidation (especially when boosting
          JLP). If the price of your boosted token drops below your liquidation
          threshold you will lose some or all of your funds. This risk increases
          with the amount of leverage you use.
        </p>
        <p>
          There are also fees and costs for borrowing that will affect your
          positions profitability. To earn more yield than simply holding JLP or
          an LST the cost of borrowing needs to be less than the additional
          yield you earn.
        </p>
        <h3>USDC</h3>
        <p>
          Boosting USDC is always profitable unless there is a systemic failure
          that results in loss of funds. See the risks FAQ to learn about some
          of the potential risks of using Boost!
        </p>
      </>
    ),
  },
  {
    question: 'What are the costs/fees?',
    answer: (
      <>
        <p>The costs and fees depend on the token you are boosting.</p>
        <h3>JLP/Liquid staking tokens</h3>
        <p className="font-bold">Borrow Interest Rate</p>
        <p>
          This variable APR can change significantly and frequently depending on
          the ratio of deposits and borrows. It is charged continuosly on the
          balance of your USDC or SOL borrow and paid to USDC depositors
          (lenders) on Boost! and SOL depositors on Mango v4.
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
          When boosting the USDC or SOL you borrow gets swapped via Jupiter to
          more of your boosted token. This can incur up to 1% slippage resulting
          in an entry price worse than expected.
        </p>
        <h3>USDC</h3>
        <p>There are no fees associated with boosting USDC.</p>
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
          fee, interest on the borrowed amount, and a collateral fee (if
          boosting JLP) instantaneously. Over time and in the right market
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
          good understanding of these risks and how Boost! works before
          depositing any funds
        </p>
        <h3>Code</h3>
        <p>
          Boost! is an integration with the Mango v4 program. Although it is
          open source and has been audited extensively, it&apos;s possible bugs
          and exploits exist that could result in the loss of funds. It&apos;s
          also possible for a bug in the UI to affect the ability to open and
          close positions in a timely manner.
        </p>
        <h3>Price Depeg</h3>
        <p>
          It&apos;s possible for the staking token price to diverge
          significantly from the USDC price. A large drop in price could result
          in postions being liquidated. Positions with higher leverage are more
          exposed to this risk.
        </p>
        <h3>Liquidity</h3>
        <p>
          Opening and closing positions on Boost! relies on swapping between the
          staking tokens and USDC without significant price impact. During an
          extreme market event there could be issues liquidating positions
          effectively. This could affect the liquidity available to open/close
          positions.
        </p>
        <h3>Oracles</h3>
        <p>
          The price data for Boost! comes from third party oracle providers.
          It&apos;s possible for the data to be incorrect due to a failure with
          the oracle provider. This could result in bad liquidations and loss of
          funds.
        </p>
        <h3>Yield Duration</h3>
        <p>
          When you borrow USDC or SOL to open a position on Boost! you&apos;ll
          be paying an initial loan origination fee, interest on the borrowed
          amount, and a collateral fee (if boosting JLP) instantaneously. This
          means you could open a position and close it before earning any
          additional yeild, whilst paying interest and collateral fees to borrow
          USDC or SOL.
        </p>
      </>
    ),
  },
  {
    question: 'Where does the yield come from?',
    answer: (
      <p>
        The price of JLP vs USDC. JLP is a liquidity pool provider token
        composed of assets, trading fees and traders profits and losses. Boost!
        increases the position size of your staking token by borrowing USDC.
        This means you earn more of the staking reward every epoch. It&apos;s
        important to account for the cost of borrowing USDC. This is displayed
        in the UI.
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
                        } h-6 w-6 shrink-0 text-th-fgd-1`}
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
