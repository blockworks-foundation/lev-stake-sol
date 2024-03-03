const HowItWorks = () => {
  return (
    <div className="mt-6 rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h2 className="mb-1">Before you jump in</h2>
      <p className="mb-6 leading-relaxed">
        Make sure you understand how Boost! works before risking any funds.
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
      <h3 className="mb-1">The basics of Boost!</h3>
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
      <h3 className="mb-1">Fees</h3>
      <h3 className="mb-1">Risks</h3>
    </div>
  )
}

export default HowItWorks
