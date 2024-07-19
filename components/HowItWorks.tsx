const HowItWorks = () => {
  return (
    <div className="mt-6 rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h2 className="mb-1">Before you jump in</h2>
      <p className="mb-6 leading-relaxed">
        This product is high risk. Make sure you understand how it works before
        risking any funds.
      </p>
      <h3 className="mb-1">The basics of JLP</h3>
      <p className="mb-3 leading-relaxed">
        JLP is the liquidity provider token for Jupiter Perps. It represents a
        pool of assets that traders borrow from to open leveraged perp positions
        on the Jupiter platform.
      </p>
      <p className="mb-6 leading-relaxed">
        Liquidity providers can deposit assets like BTC or SOL into the pool and
        receive JLP in return. To incentivize this liquidity, JLP earns 70% of
        all perp trading fees. This is automatically accrued in the price of JLP
        over time and is represented as an APR.
      </p>
      <h3 className="mb-1">The basics of adding leverage to JLP</h3>
      <p className="mb-3 leading-relaxed">
        This product offers a simple way to add leverage to your JLP position.
        It works by borrowing USDC against your deposited JLP and then swapping
        the borrowed USDC to JLP. This leaves you with more JLP than you
        deposited and a borrowed amount of USDC.
      </p>
      <p className="mb-6 leading-relaxed">
        The idea is to increase your return by harvesting more of the native
        yield of JLP. So... borrow USDC to buy JLP to get more exposure to the
        JLP yield. As long as your borrow costs are less than the extra JLP
        yield you make a profit.
      </p>
      <h3 className="mb-1">Is adding leverage to JLP always profitable?</h3>
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
        yield.fans
      </p>
      <h4 className="mb-1">USDC Loan Origination Fee</h4>
      <p className="mb-3 leading-relaxed">
        This is a one-time, 50 basis points (0.5%) fee applied to the balance of
        your USDC borrow and paid to Mango DAO.
      </p>
      <h4 className="mb-1">JLP Collateral Fee</h4>
      <p className="mb-3 leading-relaxed">
        This is charged on your JLP collateral once every two days as insurance
        for JLP suffering a catastrophic failure resulting in bad debt. It will
        reduce the size of your JLP position over time. The fee accrues to Mango
        DAO.
      </p>
      <p className="mb-3 leading-relaxed">
        The collateral fee is a dynamic formula that uses a fixed Annual
        Percentage Rate (APR) of 41%. This rate is then multiplied by the ratio
        of your USDC liabilities (the amount you&apos;ve borrowed) against your
        &quot;weighted&quot; JLP deposits (the value of your position adjusted
        by a factor between 0 and 1). The JLP weight is currently set at 0.9.
      </p>
      <p className="mb-3 leading-relaxed">
        The key aspect of this fee is its dynamism; it scales with your
        position&apos;s proximity to the liquidation price. Positions closer to
        liquidation are subjected to a higher fee, reflecting increased risk,
        while positions further from liquidation incur a lower fee.
        Consequently, the more leverage you take on the more collateral fees
        you&apos;ll pay.
      </p>
      <h4 className="mb-1">Position Entry Costs</h4>
      <p className="mb-3 leading-relaxed">
        When adding leverage to JLP the USDC you borrow gets swapped via Jupiter
        to more JLP. This can incur some slippage resulting in an entry price
        worse than expected.
      </p>
      <p className="mb-6 leading-relaxed">
        So, for leveraging JLP to be profitable the extra yield needs to be
        greater than these costs. It can also take some time for your position
        to be in profit because of the upfront fees paid to borrow USDC.
      </p>
      <h3 className="mb-1">Depositing USDC</h3>
      <p className="mb-6 leading-relaxed">
        Depositing USDC is simply supplying it to the lending pool. Your USDC
        balance will be lent to users leveraging JLP and will continously earn
        the variable interest rate. There are no fees associated with lending
        USDC.
      </p>
      <h3 className="mb-1">Risks</h3>
      <p className="mb-3 leading-relaxed">
        The following risks are non-exhaustive.
      </p>
      <h4 className="mb-1">JLP</h4>
      <p className="mb-3 leading-relaxed">
        JLP&apos;s value relies on complex market dynamics and smart contract
        code. This exposes it to multiple potential failure points that could
        result in total loss of funds.
      </p>
      <p className="mb-3 leading-relaxed">
        If JLP were to have a large depegging event it could leave the product
        with bad debt. Users leveraging JLP would lose due to JLP losing value
        and USDC depositors would lose if the JLP was unable to be liquidated in
        time.
      </p>
      <h4 className="mb-1">Oracles</h4>
      <p className="mb-3 leading-relaxed">
        This product uses 3rd party oracle providers for pricing data. It is
        possible that bad data from these oracle services could result in
        liquidations and/or total loss of funds.
      </p>
      <h4 className="mb-1">Liquidity</h4>
      <p className="mb-3 leading-relaxed">
        Opening and closing positions relies on swapping between JLP and USDC
        without significant price impact. During an extreme market event there
        could be issues liquidating positions effectively. This could affect the
        liquidity available to open/close positions.
      </p>
      <h4 className="mb-1">Code</h4>
      <p className="mb-3 leading-relaxed">
        This product is an integration with the Mango v4 contracts. These are
        audited by{' '}
        <a href="https://osec.io/" rel="noopener noreferrer" target="_blank">
          OtterSec
        </a>{' '}
        on every release. It is still possible for exploitable vulnerabilities
        to exist that could result in total loss of funds.
      </p>
      <h4 className="mb-1">UI</h4>
      <p className="mb-3 leading-relaxed">
        As the UI changes fairly regularly it&apos;s possible for errors to be
        introduced that could temporaily affect your ability to enter or exit
        positions.
      </p>
      <h4 className="mb-1">Solana Network and RPCs</h4>
      <p className="mb-3 leading-relaxed">
        This product relies on the Solana Network and external RPCs to function.
        If these services are down access to your funds will be affected. If
        this coincides with a market event you could lose funds.
      </p>
    </div>
  )
}

export default HowItWorks
