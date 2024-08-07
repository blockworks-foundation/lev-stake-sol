import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo, useState } from 'react'
import { SHOW_INACTIVE_POSITIONS_KEY } from 'utils/constants'
import TokenLogo from './shared/TokenLogo'
import Button, { IconButton } from './shared/Button'
import {
  formatTokenSymbol,
  getStakableTokensDataForTokenName,
} from 'utils/tokens'
import mangoStore, { ActiveTab } from '@store/mangoStore'
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
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
} from '@heroicons/react/20/solid'
import EditLeverageModal from './modals/EditLeverageModal'
import Tooltip from './shared/Tooltip'
import { useWallet } from '@solana/wallet-adapter-react'
import UnstakeForm from './UnstakeForm'
import StakeForm from './StakeForm'
import DespositForm from './DepositForm'
import { useTheme } from 'next-themes'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'

const set = mangoStore.getState().set

export type Position = {
  borrowBalance: number
  stakeBalance: number
  pnl: number
  solPnl: number | undefined
  bank: Bank
  acct: MangoAccount | undefined
}

const Positions = ({
  setActiveTab,
}: {
  setActiveTab: (tab: ActiveTab) => void
}) => {
  const selectedToken = mangoStore((s) => s.selectedToken)
  const [showInactivePositions, setShowInactivePositions] =
    useLocalStorageState(SHOW_INACTIVE_POSITIONS_KEY, false)
  const { positions, jlpBorrowBank, lstBorrowBank } = usePositions(
    showInactivePositions,
  )
  const [showAddRemove, setShowAddRemove] = useState('')

  const numberOfPositions = useMemo(() => {
    if (!positions.length) return 0
    return positions.filter((pos) => pos.stakeBalance > 0).length
  }, [positions])

  return !showAddRemove ? (
    <>
      <div className="mb-2 flex items-center justify-between rounded-xl border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-3.5">
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
            const { bank } = position
            const isUsdcBorrow = bank.name === 'JLP' || bank.name === 'USDC'
            return position.bank ? (
              <PositionItem
                key={bank.name}
                position={position}
                setActiveTab={setActiveTab}
                setShowAddRemove={setShowAddRemove}
                borrowBank={isUsdcBorrow ? jlpBorrowBank : lstBorrowBank}
              />
            ) : null
          })
        ) : (
          <div className="flex min-h-[336px] items-center justify-center rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
            <div className="flex flex-col items-center">
              <span className="text-xl">😑</span>
              <span>Nothing to see here...</span>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <div
      className={`rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6 text-th-fgd-1 md:p-8`}
    >
      <div className="mb-6 flex items-center space-x-3">
        <IconButton onClick={() => setShowAddRemove('')} size="small" isPrimary>
          <ArrowLeftIcon className="h-5 w-5" />
        </IconButton>
        <h2>
          {showAddRemove === 'add' ? 'Add' : 'Withdraw'} {selectedToken}
        </h2>
      </div>
      {showAddRemove === 'add' ? (
        selectedToken === 'USDC' ? (
          <DespositForm
            token="USDC"
            clientContext={
              getStakableTokensDataForTokenName('USDC').clientContext
            }
          />
        ) : (
          <StakeForm
            token={selectedToken}
            clientContext={
              getStakableTokensDataForTokenName(selectedToken)?.clientContext
            }
          />
        )
      ) : (
        <UnstakeForm
          token={selectedToken}
          clientContext={
            getStakableTokensDataForTokenName(selectedToken)?.clientContext
          }
        />
      )}
    </div>
  )
}

const PositionItem = ({
  position,
  setActiveTab,
  setShowAddRemove,
  borrowBank,
}: {
  position: Position
  setActiveTab: (v: ActiveTab) => void
  setShowAddRemove: (v: 'add' | 'remove') => void
  borrowBank: Bank | undefined
}) => {
  const { connected } = useWallet()
  const { theme } = useTheme()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const { stakeBalance, bank, pnl, acct, solPnl } = position
  const [showEditLeverageModal, setShowEditLeverageModal] = useState(false)
  const isJlpGroup = bank.name === 'JLP' || bank.name === 'USDC'

  const handleAddNoPosition = (token: string) => {
    setActiveTab('Earn')
    set((state) => {
      state.selectedToken = token
    })
  }
  const handleAddPosition = (token: string) => {
    setActiveTab('Earn')
    setShowAddRemove('add')
    set((state) => {
      state.selectedToken = token
    })
  }
  const handleRemovePosition = (token: string) => {
    setShowAddRemove('remove')
    set((state) => {
      state.selectedToken = token
    })
  }

  const leverage = useMemo(() => {
    if (!acct || !bank) return 1
    const isJlpGroup = bank.name === 'JLP' || bank.name === 'USDC'
    const group = isJlpGroup ? jlpGroup : lstGroup
    if (!group) return 1
    const accountValue = toUiDecimalsForQuote(acct.getEquity(group).toNumber())

    const assetsValue = toUiDecimalsForQuote(
      acct.getAssetsValue(group).toNumber(),
    )

    if (isNaN(assetsValue / accountValue)) {
      return 0
    } else {
      return Math.abs(1 - assetsValue / accountValue) + 1
    }
  }, [acct, bank, jlpGroup, lstGroup, isJlpGroup])

  const stakePrice = useMemo(() => {
    if (!borrowBank) return 0
    if (borrowBank.mint.toString() === WRAPPED_SOL_MINT.toString()) {
      return bank.uiPrice / borrowBank.uiPrice
    } else return bank.uiPrice
  }, [bank, borrowBank])

  const liquidationPrice = useMemo(() => {
    const borrowMaintLiabWeight = Number(borrowBank?.maintLiabWeight)
    const stakeMaintAssetWeight = Number(bank?.maintAssetWeight)
    const loanOriginationFee = Number(borrowBank?.loanOriginationFeeRate)
    const liqPrice =
      stakePrice *
      ((borrowMaintLiabWeight * (1 + loanOriginationFee)) /
        stakeMaintAssetWeight) *
      (1 - 1 / leverage)
    return liqPrice
  }, [bank, borrowBank, leverage, stakePrice])

  const changeToLiquidation = useMemo(() => {
    const change = ((stakePrice - liquidationPrice) / stakePrice) * 100
    return change
  }, [liquidationPrice, stakePrice])

  const { financialMetrics, stakeBankDepositRate, borrowBankBorrowRate } =
    useBankRates(bank.name, leverage)

  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const uiRate =
    bank.name == 'USDC' ? APY_Daily_Compound * 100 : financialMetrics.APY

  const currentPnl = isJlpGroup ? pnl : solPnl
  const roundingDecimals = borrowBank?.name === 'SOL' ? 4 : 2

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <div className="flex flex-col pb-6 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 flex items-center space-x-3 md:mb-0">
          <TokenLogo bank={bank} size={40} />
          <div>
            <h3>{formatTokenSymbol(bank.name)}</h3>
            <p>{`${borrowBank?.name === 'USDC' ? '$' : ''}${stakePrice.toFixed(
              roundingDecimals,
            )} ${borrowBank?.name !== 'USDC' ? borrowBank?.name : ''}`}</p>
          </div>
        </div>
        {stakeBalance ? (
          <div className="flex space-x-2">
            <Button onClick={() => handleAddPosition(bank.name)}>
              <p className="mb-1 text-base tracking-wider text-th-bkg-1">Add</p>
            </Button>
            <Button onClick={() => handleRemovePosition(bank.name)}>
              <p className="mb-1 text-base tracking-wider text-th-bkg-1">
                Withdraw
              </p>
            </Button>
          </div>
        ) : (
          <Button onClick={() => handleAddNoPosition(bank.name)}>
            <p className="mb-1 text-base tracking-wider text-th-bkg-1">
              {`Add`}
            </p>
          </Button>
        )}
      </div>
      <div
        className={`bg-x-repeat h-2 w-full ${
          theme === 'Light'
            ? `bg-[url('/images/zigzag-repeat.svg')]`
            : `bg-[url('/images/zigzag-repeat-dark.svg')]`
        } bg-contain opacity-20`}
      />
      <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-th-fgd-4">Position Size</p>
          <span className="text-xl font-bold text-th-fgd-1">
            <FormatNumericValue
              value={stakeBalance * stakePrice}
              decimals={roundingDecimals}
            />{' '}
            {borrowBank?.name !== 'USDC' ? borrowBank?.name : 'USDC'}
          </span>
          {bank.name !== 'USDC' ? (
            <p className="text-sm text-th-fgd-4">
              <FormatNumericValue
                // roundUp={true}
                value={stakeBalance}
                decimals={4}
              />{' '}
              {formatTokenSymbol(bank.name)}
            </p>
          ) : null}
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Est. APY</p>
          {bank.name !== 'USDC' ? (
            <div className="w-max">
              <Tooltip
                content={
                  <>
                    <div className="space-y-2 md:px-3">
                      <div className="flex justify-between gap-6">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(bank.name)} Yield APY
                        </p>
                        <span className="font-bold text-th-success">
                          {financialMetrics.collectedReturnsAPY > 0.01
                            ? '+'
                            : ''}
                          <FormatNumericValue
                            value={financialMetrics.collectedReturnsAPY}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(bank.name)} Collateral Fee APY
                        </p>
                        <span
                          className={`font-bold ${
                            financialMetrics?.collateralFeeAPY > 0.01
                              ? 'text-th-error'
                              : 'text-th-bkg-4'
                          }`}
                        >
                          {financialMetrics?.collateralFeeAPY > 0.01 ? '-' : ''}
                          <FormatNumericValue
                            value={financialMetrics?.collateralFeeAPY?.toString()}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      {borrowBank ? (
                        <>
                          <div className="flex justify-between gap-6">
                            <p className="text-th-fgd-4">{`${borrowBank?.name} Borrow APY`}</p>
                            <span
                              className={`font-bold ${
                                borrowBankBorrowRate > 0.01
                                  ? 'text-th-error'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              -
                              <FormatNumericValue
                                value={financialMetrics.borrowsAPY}
                                decimals={2}
                              />
                              %
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                }
              >
                <span className="tooltip-underline text-xl font-bold text-th-fgd-1">
                  <FormatNumericValue value={Number(uiRate)} decimals={2} />%
                </span>
              </Tooltip>
            </div>
          ) : (
            <>
              <span className="text-xl font-bold text-th-fgd-1">
                <FormatNumericValue value={Number(uiRate)} decimals={2} />%
              </span>
            </>
          )}
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Total Earned</p>
          <span
            className={`text-xl font-bold ${
              !stakeBalance
                ? 'text-th-fgd-4'
                : currentPnl && currentPnl >= 0
                ? 'text-th-success'
                : 'text-th-error'
            }`}
          >
            {currentPnl ? (
              <>
                <FormatNumericValue
                  value={currentPnl}
                  decimals={2}
                  isUsd={isJlpGroup}
                />
                {!isJlpGroup && ' SOL'}
              </>
            ) : (
              '–'
            )}
          </span>
        </div>
        {position.bank.name == 'USDC' ? null : (
          <>
            <div>
              <p className="mb-1 text-th-fgd-4">Leverage</p>
              <div className="flex items-center">
                <span className="mr-3 text-xl font-bold text-th-fgd-1">
                  {connected && stakeBalance && leverage
                    ? `${leverage.toFixed(2)}x`
                    : '–'}
                </span>
                {connected && stakeBalance ? (
                  <button
                    onClick={async () => {
                      await set((state) => {
                        state.selectedToken = bank.name
                      })
                      setShowEditLeverageModal(!showEditLeverageModal)
                    }}
                    className="raised-button-neutral group flex h-8 items-center rounded-lg px-3 after:rounded-lg after:border after:border-th-bkg-3 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex w-full items-center group-hover:mt-1 group-active:mt-2">
                      <AdjustmentsHorizontalIcon className="mr-1.5 h-4 w-4" />
                      <span className="font-bold">Edit</span>
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
            <div>
              <p className="mb-1 text-th-fgd-4">Est. Liquidation Price</p>
              <div>
                <span className="mr-2 whitespace-nowrap text-xl font-bold text-th-fgd-1">
                  {`${
                    borrowBank?.name === 'USDC' ? '$' : ''
                  }${liquidationPrice.toFixed(roundingDecimals)} ${
                    borrowBank?.name !== 'USDC' ? borrowBank?.name : ''
                  }`}
                </span>
                <p className="text-sm text-th-fgd-4">{`${
                  changeToLiquidation > 0
                    ? `-${changeToLiquidation.toFixed(2)}`
                    : '0.00'
                }% from current price ${
                  borrowBank?.name === 'USDC' ? '$' : ''
                }${stakePrice.toFixed(roundingDecimals)} ${
                  borrowBank?.name !== 'USDC' ? borrowBank?.name : ''
                }`}</p>
              </div>
            </div>
          </>
        )}
      </div>
      {showEditLeverageModal ? (
        <EditLeverageModal
          token={bank.name}
          isOpen={showEditLeverageModal}
          onClose={() => {
            setShowEditLeverageModal(false)
          }}
        />
      ) : null}
    </div>
  )
}

export default Positions
