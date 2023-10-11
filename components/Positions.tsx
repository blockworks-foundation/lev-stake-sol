import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import { BORROW_TOKEN, SHOW_INACTIVE_POSITIONS_KEY } from 'utils/constants'
import TokenLogo from './shared/TokenLogo'
import Button from './shared/Button'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import Switch from './forms/Switch'
import useLocalStorageState from 'hooks/useLocalStorageState'
import FormatNumericValue from './shared/FormatNumericValue'
import {
  Bank,
  MangoAccount,
  toUiDecimalsForQuote,
} from '@blockworks-foundation/mango-v4'
import useBankRates from 'hooks/useBankRates'
import usePositions from 'hooks/usePositions'

const set = mangoStore.getState().set

type Position = {
  borrowBalance: number
  stakeBalance: number
  bank: Bank
  acct: MangoAccount | undefined
}

const getLiquidationRatio = (
  borrowBalance: number,
  stakeBalance: number,
  stakeBank: Bank,
  borrowBank: Bank,
) => {
  return (
    (Math.abs(borrowBalance) * borrowBank.maintLiabWeight.toNumber()) /
    (stakeBalance * stakeBank.maintAssetWeight.toNumber())
  ).toFixed(3)
}

const Positions = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void
}) => {
  const [showInactivePositions, setShowInactivePositions] =
    useLocalStorageState(SHOW_INACTIVE_POSITIONS_KEY, true)
  const { borrowBank, positions } = usePositions(showInactivePositions)

  const numberOfPositions = useMemo(() => {
    if (!positions.length) return 0
    return positions.filter((pos) => pos.stakeBalance > 0).length
  }, [positions])

  return (
    <>
      <div className="mb-2 flex items-center justify-between rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-3.5">
        <p className="font-medium">{`You have ${numberOfPositions} active position${
          numberOfPositions !== 1 ? 's' : ''
        }`}</p>
        <Switch
          checked={showInactivePositions}
          onChange={(checked) => setShowInactivePositions(checked)}
        >
          Show Inactive
        </Switch>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {positions.length ? (
          positions.map((position) => {
            return position.bank ? (
              <PositionItem
                key={position.bank.name}
                position={position}
                setActiveTab={setActiveTab}
                borrowBank={borrowBank}
              />
            ) : null
          })
        ) : (
          <div className="flex justify-center rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
            <span>Nothing to see here...</span>
          </div>
        )}
      </div>
    </>
  )
}

const PositionItem = ({
  position,
  setActiveTab,
  borrowBank,
}: {
  position: Position
  setActiveTab: (v: string) => void
  borrowBank: Bank | undefined
}) => {
  const { group } = useMangoGroup()
  const { stakeBalance, borrowBalance, bank, acct } = position

  const handleAddOrManagePosition = (token: string) => {
    setActiveTab('Boost!')
    set((state) => {
      state.selectedToken = token
    })
  }

  const leverage = useMemo(() => {
    if (!group || !acct) return 1
    const accountValue = toUiDecimalsForQuote(acct.getEquity(group).toNumber())

    const assetsValue = toUiDecimalsForQuote(
      acct.getAssetsValue(group).toNumber(),
    )

    if (isNaN(assetsValue / accountValue)) {
      return 0
    } else {
      return Math.abs(1 - assetsValue / accountValue) + 1
    }
  }, [group, acct])

  const [liqRatio, liqPriceChangePercentage] = useMemo(() => {
    if (!borrowBalance || !borrowBank) return ['0.00', '']
    const liqRatio = getLiquidationRatio(
      borrowBalance,
      stakeBalance,
      bank,
      borrowBank,
    )
    const currentPriceRatio = bank.uiPrice / borrowBank.uiPrice
    const liqPriceChangePercentage =
      ((parseFloat(liqRatio) - currentPriceRatio) / currentPriceRatio) * 100
    return [liqRatio, liqPriceChangePercentage.toFixed(2)]
  }, [bank, borrowBalance, borrowBank, stakeBalance])

  const { estimatedNetAPY } = useBankRates(bank.name, leverage)

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <div className="mb-4 flex flex-col border-b border-th-bkg-3 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 flex items-center space-x-3 md:mb-0">
          <div
            className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <TokenLogo bank={bank} size={28} />
          </div>
          <div>
            <h3>{formatTokenSymbol(bank.name)}</h3>
            {/* <span
              className={`text-sm ${
                stakeBalance ? 'text-th-fgd-1' : 'text-th-fgd-4'
              }`}
            >
              {stakeBalance ? 'Opened 2 weeks ago' : 'No Position'}
            </span> */}
          </div>
        </div>
        <Button onClick={() => handleAddOrManagePosition(bank.name)}>
          <p className="mb-1 text-base tracking-wider text-th-bkg-1">
            {stakeBalance ? 'Manage' : 'Add Position'}
          </p>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-th-fgd-4">Position Size</p>
          <span className="text-xl font-bold text-th-fgd-1">
            <FormatNumericValue value={stakeBalance} decimals={6} />{' '}
            {formatTokenSymbol(bank.name)}
          </span>
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Est. APY</p>
          <span className="text-xl font-bold text-th-fgd-1">
            <FormatNumericValue value={estimatedNetAPY} decimals={2} />%
          </span>
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Leverage</p>
          <span className="text-xl font-bold text-th-fgd-1">
            {leverage ? leverage.toFixed(2) : 0.0}x
          </span>
        </div>
        {/* <div>
          <p className="mb-1 text-th-fgd-4">Earned</p>
          <span className="text-xl font-bold text-th-fgd-1">
            {stakeBalance
              ? `X.XX ${formatTokenSymbol(bank.name)}`
              : `0 ${formatTokenSymbol(bank.name)}`}
          </span>
        </div> */}
        <div>
          <p className="mb-1 text-th-fgd-4">Est. Liquidation Ratio</p>
          <div className="flex flex-wrap items-end">
            <span className="mr-2 whitespace-nowrap text-xl font-bold text-th-fgd-1">
              {liqRatio} {`${formatTokenSymbol(bank.name)}/${BORROW_TOKEN}`}
            </span>
            {liqPriceChangePercentage ? (
              <p className="mb-0.5 text-th-error">
                {liqPriceChangePercentage}%
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Positions
