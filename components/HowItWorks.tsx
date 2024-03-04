const HowItWorks = () => {
  return (
    <div className="mt-6 rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h2 className="mb-1">Before you jump in</h2>
      <p className="mb-6 leading-relaxed">
        Boost! is high risk. Make sure you understand how it works before
        risking any funds. Please refer to the <a>Boost! docs</a> for the full
        technical details.
      </p>
      <h3 className="mb-1">The basics of JLP</h3>
      <p className="mb-3 leading-relaxed">
        JLP is the liquidity provider token for Jupiter Perps. It represents a
        pool of assets that traders borrow from to open leveraged perp
        positions.
      </p>
      <p className="mb-6 leading-relaxed">
        Liquidity providers can deposit assets like BTC or SOL into the pool and
        receive JLP in return. To incentivize this liquidity, JLP earns 70% of
        all perp trading fees. This is automatically accrued in the price of JLP
        over time and is represented as an APR.
      </p>
      <h3 className="mb-1">The basics of boosting JLP</h3>
      <p className="mb-3 leading-relaxed">
        Boost! offers a simple way to add leverage to your JLP position. It
        works by borrowing USDC against your deposited JLP and then swapping the
        borrowed USDC to JLP. This leaves you with more JLP than you deposited
        and a borrowed amount of USDC.
      </p>
      <p className="mb-6 leading-relaxed">
        The idea is to increase your return by harvesting more of the native
        yield of JLP. So... borrow USDC to buy JLP to get more exposure to the
        JLP yield. As long as your borrow costs are less than the extra JLP
        yield you make a profit.
      </p>
      <h3 className="mb-1">Is boosting JLP always profitable?</h3>
      <p className="mb-3 leading-relaxed">
        No. For one, there is a real risk of liquidation. If the price of JLP
        drops below your liquidation threshold you will lose some or all of your
        JLP.
      </p>
      <p className="mb-3 leading-relaxed">
        There are also fees and costs for borrowing USDC that will affect your
        positions profitability.
      </p>
      <h4 className="mb-1">USDC Borrow Rate</h4>
      <p className="mb-3 leading-relaxed">
        This variable APR can change significantly and frequently depending on
        the ratio or USDC deposits and borrows. It is charged continuosly on the
        balance of your USDC borrow and paid to USDC depositors (lenders) on
        Boost!.
      </p>
      <h4 className="mb-1">USDC Loan Origination Fee</h4>
      <p className="mb-3 leading-relaxed">
        This is a one-time, 50 basis points (0.5%) fee applied to the balance of
        your USDC borrow and paid to Mango DAO.
      </p>
      <h4 className="mb-1">JLP Collateral Fee</h4>
      <p className="mb-3 leading-relaxed">
        This is charged on your JLP collateral as insurance in case JLP blows up
        and can&apos;t be liquidated. It will reduce the size of your JLP
        position over time. This fee accrues to Mango DAO.
      </p>
      <h4 className="mb-1">Position Entry Costs</h4>
      <p className="mb-3 leading-relaxed">
        When boosting JLP the USDC you borrow gets swapped via Jupiter to more
        JLP. This can incur some slippage resulting in an entry price worse than
        expected.
      </p>
      <p className="mb-6 leading-relaxed">
        So, for boosting JLP to be profitable the extra yield needs to be
        greater than these costs. It can also take some time for your position
        to be in profit because of the upfront fees paid to borrow USDC.
      </p>
      <h3 className="mb-1">Boosting USDC</h3>
      <p className="mb-3 leading-relaxed">
        Boosting USDC is simply supplying it to the lending pool. Your USDC
        balance will lent to JLP boosters and will continously earn the variable
        interest rate.
      </p>
      <p className="mb-3 leading-relaxed">
        There are no fees associated with lending USDC but there are risks. If
        there was a catastrophic failure in JLP or Boost! you could lose all of
        your funds.
      </p>
    </div>
  )
}

export default HowItWorks
