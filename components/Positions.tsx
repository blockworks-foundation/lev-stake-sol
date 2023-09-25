import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import { SHOW_INACTIVE_POSITIONS_KEY, STAKEABLE_TOKENS } from 'utils/constants'
import TokenLogo from './shared/TokenLogo'
import Button from './shared/Button'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import Switch from './forms/Switch'
import useLocalStorageState from 'hooks/useLocalStorageState'
import useStakeRates from 'hooks/useStakeRates'
import SheenLoader from './shared/SheenLoader'
import useStakeAccounts from 'hooks/useStakeAccounts'
import FormatNumericValue from './shared/FormatNumericValue'

const set = mangoStore.getState().set

const BORROW_TOKEN = 'SOL'

const getLeverage = (stakeBalance: number, borrowBalance: number) => {
  if (stakeBalance === 0) return 0
  return borrowBalance / stakeBalance
}

const Positions = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void
}) => {
  const { group } = useMangoGroup()
  const { data: stakeRates, isLoading: loadingRates } = useStakeRates()
  const [showInactivePositions, setShowInactivePositions] =
    useLocalStorageState(SHOW_INACTIVE_POSITIONS_KEY, true)
  const { stakeAccounts } = useStakeAccounts()

  const borrowBank = useMemo(() => {
    return group?.banksMapByMint.get(BORROW_TOKEN)?.[0]
  }, [group])

  const banks = useMemo(() => {
    if (!group) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const bank = group.banksMapByName.get(token)?.[0]
      positionBanks.push(bank)
    }
    return positionBanks
  }, [group])

  const positions = useMemo(() => {
    const positions = []

    for (const bank of banks) {
      if (!bank) continue
      const acct = stakeAccounts?.find((acc) => acc.getTokenBalanceUi(bank) > 0)
      const stakeBalance = acct ? acct.getTokenBalanceUi(bank) : 0
      const borrowBalance =
        acct && borrowBank ? acct.getTokenBalanceUi(borrowBank) : 0
      positions.push({ borrowBalance, stakeBalance, bank })
    }
    const sortedPositions = positions.sort(
      (a, b) => b.stakeBalance - a.stakeBalance,
    )
    return showInactivePositions
      ? sortedPositions
      : sortedPositions.filter((pos) => pos.stakeBalance > 0)
  }, [banks, showInactivePositions, stakeAccounts])

  const numberOfPositions = useMemo(() => {
    if (!positions.length) return 0
    return positions.filter((pos) => pos.stakeBalance > 0).length
  }, [positions])

  const handleAddOrManagePosition = (token: string) => {
    setActiveTab('Stake')
    set((state) => {
      state.selectedToken = token
    })
  }

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
          positions.map((position, i) => {
            const {stakeBalance, borrowBalance, bank } = position
            return bank ? (
              <div
                className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6"
                key={i + stakeBalance}
              >
                <div className="mb-4 flex flex-col border-b border-th-bkg-3 pb-4 md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 flex items-center space-x-3 md:mb-0">
                    <div
                      className={`inner-shadow-bottom-sm flex h-14 w-14 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
                    >
                      <TokenLogo bank={bank} size={32} />
                    </div>
                    <div>
                      <h3>{formatTokenSymbol(bank.name)}</h3>
                      <span
                        className={`text-sm ${
                          stakeBalance ? 'text-th-fgd-1' : 'text-th-fgd-4'
                        }`}
                      >
                        {stakeBalance ? 'Opened 2 weeks ago' : 'No Position'}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => handleAddOrManagePosition(bank.name)}>
                    <span className="mt-1 text-base tracking-wider">
                      {stakeBalance ? 'Manage' : 'Add Position'}
                    </span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                      {loadingRates ? (
                        <SheenLoader className="mt-1">
                          <div className="h-6 w-16 bg-th-bkg-2" />
                        </SheenLoader>
                      ) : stakeRates?.[bank.name.toLowerCase()] ? (
                        `${(
                          stakeRates?.[bank.name.toLowerCase()] * 100
                        ).toFixed(2)}%`
                      ) : null}
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-th-fgd-4">Leverage</p>
                    <span className="text-xl font-bold text-th-fgd-1">
                      {getLeverage(stakeBalance, borrowBalance)}x
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-th-fgd-4">Earned</p>
                    <span className="text-xl font-bold text-th-fgd-1">
                      {balance ? `X.XX ${formatTokenSymbol(bank.name)}` : `0 ${formatTokenSymbol(bank.name)}`}
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-th-fgd-4">Liquidation Price</p>
                    <span className="whitespace-nowrap text-xl font-bold text-th-fgd-1">
                      {stakeBalance ? 'X.XX' : '0'}{' '}
                      {`${formatTokenSymbol(bank.name)}/${BORROW_TOKEN}`}
                    </span>
                  </div>
                </div>
              </div>
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

export default Positions
