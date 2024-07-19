import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const Risks: NextPage = () => {
  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1 className="mb-4">Risks</h1>
      <p className="mb-3">
        <b>KEY INVESTOR INFORMATION:</b> This document provides you with key
        information about this Leveraged Staking product and the risks involved.
        It is not marketing material. The information is required to help you
        understand the nature and risks of investing in this product.You are
        advised to read it so you can make an informed decision about whether to
        invest.
      </p>
      <p className="mb-3">
        <b>IMPORTANT INFORMATION: CAPITAL AT RISK</b> The value and income of
        investments in the following product can fall as well as rise and are
        not guaranteed. Investors may not get back the amount originally
        invested.
      </p>
      <p className="mb-3">
        <b>IMPORTANT INFORMATION:</b> Investments in the leverage staking
        product are subject to market fluctuations. The value of your
        investment, as well as the income derived from it, can increase or
        decrease. There is no assurance of recovering the initial investment
        amount. It&apos;s crucial to understand that decentralized finance
        (DeFi) lending products, including those offered on permissionless
        blockchains, operate independently of Mango Markets DAO.
      </p>
      <p className="mb-3">
        This leverage product, known as yield.fan, allows users to deposit JLP
        and SOL liquid staking tokens (LSTs), to be used as collateral in the
        borrowing of USDC (if leveraging JLP) or SOL (if leveraging LSTs) at a
        variable interest rate. The USDC or SOL is used to purchase additional
        tokens, creating increased exposure.
      </p>
      <p className="mb-3">
        The product entails various fees, including variable collateral fee
        rates (if leveraging JLP), loan origination fees, and variable loan
        maintenance fees. The value of your position is directly affected by
        changes in the USDC or SOL interest rate and the market value of the
        deposited tokens. Typically, an increase in borrow interest rates, or a
        decrease in value of the deposited tokens, will lead to a decrease in
        the value of your position, potentially resulting in liquidation.
      </p>
      <p className="mb-3">
        This leverage staking product relies on external oracles to provide
        real-time price feeds for deposited tokens, USDC and SOL. These oracles
        are essential for ensuring accurate collateral valuation. However,
        investors should be aware that oracle data is subject to risks of
        manipulation, delay, or inaccuracies. Such issues with oracle feeds can
        lead to improper valuation of deposited assets, potentially triggering
        unintended liquidations or affecting the overall performance of your
        investment.
      </p>
      <p className="mb-3">
        Investors should also be aware of the inherent smart-contract risks
        associated with this product. These risks include, but are not limited
        to, vulnerabilities in the contract code that could potentially be
        exploited, leading to financial loss.
      </p>
      <p className="mb-6 font-bold">
        Please consider these risks carefully before using yield.fan
      </p>
      <h3 className="mb-3">1. Why add leverage to JLP or LSTs?</h3>
      <p className="mb-6">
        Increased Exposure and Returns: Amplifies investment in JLP/LSTs,
        leveraging USDC/SOL to enhance yield potential and market position
        without the need for extra capital.
      </p>
      <h3 className="mb-3">2. Why Not add leverage to JLP or LSTs?</h3>
      <p className="mb-6">
        Risk of Liquidation: High volatility in the JLP/LST and USDC/SOL market
        can rapidly depreciate collateral value, triggering liquidations and
        potential loss of investment.
      </p>
      <h3 className="mb-3">3. Adding leverage</h3>
      <p className="mb-3">
        Adding leverage offers a significant advantage by amplifying
        investors&apos; exposure to JLP/LSTs and their associated yield through
        USDC or SOL borrowing, which facilitates the acquisition of additional
        amounts of JLP or LSTs, enhancing potential gains. This strategic
        leverage allows investors to expand their market position and
        potentially increase returns without the need for additional capital
        investment upfront. The product operates within a framework of carefully
        calibrated risk parameters, managed by the Mango DAO, to balance growth
        opportunities against the inherent risks of the JLP/LST and USDC/SOL
        markets.
      </p>
      <p className="mb-3">
        However, this increased exposure is not without its costs. The primary
        risk associated with leveraging investments in this way is the
        heightened potential for liquidation. In volatile market conditions, the
        value of collateralized assets can rapidly decline, possibly triggering
        liquidations to cover outstanding liabilities. Moreover, the mechanism
        of leveraging and the associated costs and fees of borrowing, introduce
        additional costs that can impact the overall profitability of
        investments.
      </p>
      <p className="mb-3">
        It&apos;s critical to carefully evaluate the balance between the
        benefits of increased exposure to underlying assets and the risks of
        liquidation, losses, and fees. The high-risk nature of leveraged
        cryptocurrency products demands a thorough understanding of market
        dynamics and risk management strategies to navigate potential downturns
        effectively
      </p>
      <h3 className="mb-3">4. JLP token</h3>
      <p className="mb-3">
        JLP (Jupiter Liquidity Provider) tokens are assets that users receive
        when they become liquidity providers on the Jupiter Perpetuals platform.
        Holding JLP allows users to earn a portion of the fees generated by the
        platform, with the token&apos;s value and yield being dynamically
        influenced by trading activities and market conditions. JLP is a native
        Solana Program Library (SPL) token. It represents a significant
        component of the platform&apos;s liquidity provision, directly linking
        holders to the platform&apos;s financial ecosystem and its associated
        risks and rewards.
      </p>
      <p className="mb-3">
        The value of JLP tokens is closely tied to the operational dynamics of
        the Jupiter Perpetuals platform. It reflects a share in the pool
        containing the trading fees generated, trader&apos;s profit and loss and
        70 percent of generated fees. Inspired by GMXv1, JLP&apos;s worth
        increases with the platform&apos;s trading volume and fee generation,
        offering holders a direct stake in the platform&apos;s success. This
        dynamic pricing mechanism ensures that JLP holders benefit from the
        platform&apos;s financial activities.
      </p>
      <p className="mb-3">
        The current composition of the JLP pool reflects a mix of major
        cryptocurrencies, including SOL, ETH, WBTC, USDC, and USDT, each with
        specific target allocations and utilization rates. Target rates in the
        JLP pool ensure that the pool remains diversified and resilient to
        market volatility. While offering a mix of low volatility and high
        yield, JLP represent a high risk investment due to potential smart
        contract vulnerabilities and market-related risks. As an index fund of
        major cryptocurrencies, JLP provides broad exposure, diversifying
        portfolios but also introducing complex market risks.
      </p>
      <h3 className="mb-3">5. Objectives and Policy</h3>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          yield.fan augments the investor&apos;s exposure to the deposited
          tokens by leveraging USDC or SOL borrowing to finance the acquisition
          of additional amounts of the deposited asset, which is designated as
          &quot;Collateral&quot;.
        </li>
        <li className="mb-3">
          The magnitude of USDC or SOL leveraged and the volume of deposited
          assets acquired are predicated on specific risk parameters, notably
          the &quot;Initialisation&quot; asset weight of the deposited tokens.
          The Mango DAO exercises governance over this critical parameter,
          adjusting it in accordance with their risk management strategy.
        </li>
        <li className="mb-3">
          When adding leverage to JLP the collateral of deposited tokens is
          subject to a fixed rate fee, which is imposed in direct proportion to
          the extent of the collateral that is secured by outstanding
          liabilities. In the context of liquidations, a distinct and typically
          lower value, known as the &quot;maintenance asset weight&quot;, comes
          into play, representing the &quot;weighted assets&quot; threshold for
          triggering liquidation.
        </li>
        <li className="mb-3">
          The USDC and SOL borrow rates are dynamically adjusted based on the
          total volume of USDC/SOL borrowed and deposited across the platform,
          adhering to an exponential curve. This mechanism ensures that the
          borrow rate increases with the aggregate borrowing activity,
          influencing the cost of leveraging and the overall economic incentives
          for borrowers and depositors alike. This rate adjustment strategy is
          crucial for managing liquidity and risk on the platform.
        </li>
        <li className="mb-3">
          The effectiveness of leveraging JLP and the associated USDC borrowing
          rates are directly influenced by USDC deposits, a distinct service on
          the platform designed for USDC lending. The interplay between JLP
          leverage and deposited USDC underscores the importance of
          understanding the inherent risks of deposited USDC when utilizing JLP
          for investment strategies. JLP and USDC are isolated from the LST
          pool.
        </li>
        <li className="mb-3">
          A liquidation event is initiated when the combined value of the
          borrowed USDC or SOL, along with the accumulated interest, surpasses
          the &quot;weighted assets&quot; value. This mechanism ensures that
          USDC depositors are prioritized for reimbursement in the event of a
          market downturn.
        </li>
        <li className="mb-3">
          The aforementioned risk parameters, such as the
          &quot;Initialisation&quot; asset weight, play a crucial role in the
          determination of both the borrowing capacity and the purchasing power
          regarding the deposited assets, underlining the significance of the
          Mango DAO&apos;s oversight.
        </li>
        <li className="mb-3">
          Recommendation: Investors should be cognizant of the High Risk nature
          of this product. The cryptocurrency markets are characterized by their
          extreme volatility, which can lead to abrupt and unanticipated
          liquidations, thereby posing a substantial risk to capital.
        </li>
      </ul>
      <p className="mb-6">
        For more information on yield.fan, risks and charges please contact{' '}
        <a
          href="https://discord.gg/pV5mybZYY8"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://discord.gg/pV5mybZYY8
        </a>
      </p>
      <h3 className="mb-3">6. Interdependence with deposited USDC</h3>
      <p className="mb-6">
        The &quot;Leveraged JLP&quot; product intricately relies on the
        deposited USDC, serving as a mechanism for deposits within the
        ecosystem. Specifically, USDC deposits are a critical component in
        enabling the leveraging of JLP. This interdependence underscores a
        strategic approach to liquidity management and leverage within the
        platform, where the availability and conditions of USDC deposits
        directly influence the operational dynamics of leveraged JLP. As such,
        users engaging with JLP are implicitly interacting with the underlying
        mechanisms and risks associated with the deposited USDC.
      </p>
      <h3 className="mb-3">7. Charges</h3>
      <p className="mb-3">
        The charges are used to pay the costs of running the product, including
        the costs of marketing, development and distributing it. These charges
        reduce the potential growth of your leverage position, and increase the
        likelihood of liquidation. At any point in time, Mango DAO can choose to
        increase, decrease or remove fees:
      </p>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Loan Origination Fee: This is a one-time fee applied to the USDC or
          SOL borrowed, which increases the borrower&apos;s liabilities. It
          typically ranges from 1 to 100 basis points.
        </li>
        <li className="mb-3">
          Loan Fee Rate, This represents a percentage fee applied to the USDC or
          SOL borrowed, also contributing to an increase in liabilities. The fee
          rate falls within a 0-10 percent Annual Percentage Rate (APR).
        </li>
        <li className="mb-3">
          Collateral Fee Rate, This is a percentage fee for adding leverage to
          JLP and other LSTs, assessed on the collateral deposited by the
          borrower. It fluctuates based on the ratio of weighted liabilities to
          weighted collateral, affecting the overall cost of borrowing.
        </li>
        <li className="mb-3">
          Swap Fees, When positions are initiated by swapping USDC or SOL for a
          derived token through the most efficient route, swap fees may be
          incurred as part of the slippage. This fee affects the cost and
          efficiency of the transaction.
        </li>
      </ul>
      <h3 className="mb-3">8. JLP and LST Specific Risks</h3>
      <h4 className="mb-2">8.1 Disclaimer on Jupiter Token Management</h4>
      <p className="mb-3">
        It is important for users to understand that the platform does not have
        any control over the management, performance, or operational strategies
        of JLP or any of the LSTs. Users should conduct their own due diligence
        and assess the risks involved when engaging with these tokens. We accept
        no responsibility for any financial outcomes related to the fluctuation
        in value, liquidity, or regulatory changes affecting these tokens.
      </p>
      <h4 className="mb-2">
        8.2 Risks Associated with Accepting JLP/LST Deposits
      </h4>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Value Fluctuation Risk: The value of JLP/LSTs can be highly volatile,
          affecting the collateral value of loans.
        </li>
        <li className="mb-3">
          Smart Contract Risk: Potential vulnerabilities in the JLP/LST smart
          contract could lead to loss of funds.
        </li>
        <li className="mb-3">
          Market Risk: Changes in the overall crypto market could
          disproportionately affect the JLP/LSTs liquidity pools, impacting the
          tokens stability and value.
        </li>
        <li className="mb-3">
          Regulatory Risk: Changes in regulatory landscapes may affect the
          operation of liquidity pools and the usability of JLP/LSTs as
          collateral.
        </li>
      </ul>
      <h3 className="mb-3">9. General Risks</h3>
      <p className="mb-3">
        The below describes the potential risks faced by users categorized into
        general risks, platform-specific risks, and market operation risks
      </p>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Legal and Taxation Risks: Users are responsible for understanding and
          complying with the legal and tax implications of their actions within
          Mango Markets.
        </li>
        <li className="mb-3">
          Market Risks: Market prices are subject to rapid and unpredictable
          changes. Historical trends do not guarantee future performance.
        </li>
        <li className="mb-3">
          Unknown Risks: Additional, unspecified risks may exist, affecting
          users&apos; experiences and outcomes
        </li>
      </ul>
      <h4 className="mb-2">9.1 Platform-Specific Risks</h4>
      <p className="mb-3">
        Solana Network Risks: Solana&apos;s architecture, designed for high
        throughput and low transaction costs, faces challenges that can impact
        users on the platform. Key areas of concern include:
      </p>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Wallet Loss: The decentralized nature of blockchain technology means
          that wallet security is paramount. Users losing access to their
          private keys will find themselves permanently unable to access their
          funds, with no centralized authority to facilitate recovery.
        </li>
        <li className="mb-3">
          Infrastructure Risks: The Solana network is not immune to downtimes or
          degraded service quality. These can arise from various factors,
          including network congestion, protocol upgrades, or malicious attacks.
          During such downtimes, users may experience delayed transactions,
          inability to access their funds, or temporary loss of platform
          functionality. Extended outages could lead to significant disruption,
          affecting trading strategies and access to assets.
        </li>
      </ul>
      <h4 className="mb-2">9.2 Oracle Provider Risks</h4>
      <p className="mb-3">
        The use of oracle providers like Switchboard and Pyth introduce several
        risks, necessitating a thorough understanding for informed
        decision-making. Key points include:
      </p>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Accuracy and Reliability: Oracle providers are responsible for
          delivering accurate and timely data feeds. Any discrepancies or delays
          in data can affect trades, liquidations, and the stability of the
          market.
        </li>
        <li className="mb-3">
          Customization and Community Governance: Switchboard is a
          permissionless, customizable, multi-chain oracle network that relies
          on community governance to curate and manage data feeds. While this
          democratizes data provision, it also introduces variability in the
          quality and reliability of the data, depending on community engagement
          and oversight.
        </li>
        <li className="mb-3">
          Technical Risks: The complexity of managing oracle queues, running
          local oracles for testing, and integrating with smart contracts
          introduces technical risks, including potential vulnerabilities or
          misconfigurations that could be exploited.
        </li>
      </ul>
      <h4 className="mb-2">9.3 Disclaimer on Oracle Management</h4>
      <p className="mb-6">
        It is crucial for platform users to acknowledge that yield.fan does not
        control or manage the oracle services provided by Switchboard, Pyth, or
        any other third-party oracle providers. As such, we are not liable for
        any discrepancies, inaccuracies, or failures of the oracle services. In
        the event of data inaccuracies provided by these oracles, our platform
        will proceed with liquidations or other contract executions based on the
        received data, underscoring the importance of users&apos; awareness of
        these oracle provider risks.
      </p>
      <h3 className="mb-3">10. Specific Risks</h3>
      <p className="mb-3">
        The &quot;yield.fan&quot; products within the Mango Markets ecosystem,
        designed to enhance user engagement through leveraged positions and
        liquidity provision, carry their own set of specific risks. These risks
        stem from operational complexities, market volatilities, and
        dependencies on external services. Understanding these risks is crucial
        for participants to navigate the platform effectively and mitigate
        potential losses.
      </p>
      <ul className="ml-6 list-outside list-disc">
        <li className="mb-3">
          Operational Risks: Bugs or vulnerabilities in the deployed Mango
          program or governance mechanisms could lead to incorrect behavior or
          loss of funds.
        </li>
        <li className="mb-3">
          Liquidation and Socialized Loss Risks: Market conditions can trigger
          liquidations, potentially leading to cascading market impacts and
          socialized losses under certain conditions.
        </li>
        <li className="mb-3">
          Service and UI Risks: Reliance on external services and user
          interfaces may introduce additional vulnerabilities, including data
          accuracy and access issues.
        </li>
      </ul>
    </div>
  )
}

export default Risks
