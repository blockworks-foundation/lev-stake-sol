import {
  ArrowPathIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import mangoStore from '@store/mangoStore'
import { notify } from '../utils/notifications'
import { TokenAccount, formatTokenSymbol } from '../utils/tokens'
import Label from './forms/Label'
import Button, { IconButton } from './shared/Button'
import Loading from './shared/Loading'
import MaxAmountButton from '@components/shared/MaxAmountButton'
import Tooltip from '@components/shared/Tooltip'
import SolBalanceWarnings from '@components/shared/SolBalanceWarnings'
import useSolBalance from 'hooks/useSolBalance'
import { floorToDecimal, withValueLimit } from 'utils/numbers'
import { isMangoError } from 'types'
import TokenLogo from './shared/TokenLogo'
import SecondaryConnectButton from './shared/SecondaryConnectButton'
import useMangoAccountAccounts from 'hooks/useMangoAccountAccounts'
import InlineNotification from './shared/InlineNotification'
import Link from 'next/link'
import LeverageSlider from './shared/LeverageSlider'
import useMangoGroup from 'hooks/useMangoGroup'
import FormatNumericValue from './shared/FormatNumericValue'
import { stakeAndCreate } from 'utils/transactions'
// import { MangoAccount } from '@blockworks-foundation/mango-v4'
import { AnchorProvider } from '@project-serum/anchor'
import useBankRates from 'hooks/useBankRates'
import { Disclosure } from '@headlessui/react'
import SheenLoader from './shared/SheenLoader'
import useLeverageMax from 'hooks/useLeverageMax'
import { sleep } from 'utils'
import ButtonGroup from './forms/ButtonGroup'
import Decimal from 'decimal.js'
import { toUiDecimals } from '@blockworks-foundation/mango-v4'
import useIpAddress from 'hooks/useIpAddress'

const set = mangoStore.getState().set

export const NUMBERFORMAT_CLASSES =
  'inner-shadow-top-sm w-full rounded-xl border border-th-bkg-3 bg-th-input-bkg p-3 pl-12 pr-4 text-left font-bold text-xl text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:border-th-bkg-4 md:hover:focus-visible:border-th-fgd-4'

interface StakeFormProps {
  token: string
}

export const walletBalanceForToken = (
  walletTokens: TokenAccount[],
  token: string,
): { maxAmount: number; maxDecimals: number } => {
  const group = mangoStore.getState().group
  const bank = group?.banksMapByName.get(token)?.[0]

  let walletToken
  if (bank) {
    const tokenMint = bank?.mint
    walletToken = tokenMint
      ? walletTokens.find((t) => t.mint.toString() === tokenMint.toString())
      : null
  }

  return {
    maxAmount: walletToken ? walletToken.uiAmount : 0,
    maxDecimals: bank?.mintDecimals || 6,
  }
}

// const getNextAccountNumber = (accounts: MangoAccount[]): number => {
//   if (accounts.length > 1) {
//     return (
//       accounts
//         .map((a) => a.accountNum)
//         .reduce((a, b) => Math.max(a, b), -Infinity) + 1
//     )
//   } else if (accounts.length === 1) {
//     return accounts[0].accountNum + 1
//   }
//   return 0
// }

function StakeForm({ token: selectedToken }: StakeFormProps) {
  const { t } = useTranslation(['common', 'account'])
  const [inputAmount, setInputAmount] = useState('')
  const [sizePercentage, setSizePercentage] = useState('')
  const submitting = mangoStore((s) => s.submittingBoost)
  const [leverage, setLeverage] = useState(1)
  const [refreshingWalletTokens, setRefreshingWalletTokens] = useState(false)
  const { maxSolDeposit } = useSolBalance()
  const { ipAllowed } = useIpAddress()

  const storedLeverage = mangoStore((s) => s.leverage);
  const { usedTokens, totalTokens } = useMangoAccountAccounts()
  const { group } = useMangoGroup()
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const {
    borrowBankBorrowRate,
    leveragedAPY,
    estimatedNetAPY,
    collateralFeeAPY,
  } = useBankRates(selectedToken, leverage)
  const leverageMax = useLeverageMax(selectedToken) * 0.9 // Multiplied by 0.975 becuase you cant actually get to the end of the inifinite geometric series?

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('USDC')?.[0]
  }, [group])

  const liquidationPrice = useMemo(() => {
    const borrowMaintLiabWeight = borrowBank?.maintLiabWeight
    const stakeMaintAssetWeight = stakeBank?.maintAssetWeight
    const price =
      Number(stakeBank?.uiPrice) *
      (Number(borrowMaintLiabWeight) / Number(stakeMaintAssetWeight)) *
      (1 - 1 / leverage)

    return price
  }, [stakeBank, borrowBank, leverage])

  const tokenPositionsFull = useMemo(() => {
    if (!stakeBank || !usedTokens.length || !totalTokens.length) return false
    const hasTokenPosition = usedTokens.find(
      (token) => token.tokenIndex === stakeBank.tokenIndex,
    )
    return hasTokenPosition ? false : usedTokens.length >= totalTokens.length
  }, [stakeBank, usedTokens, totalTokens])

  const { connected, publicKey } = useWallet()
  const walletTokens = mangoStore((s) => s.wallet.tokens)

  const tokenMax = useMemo(() => {
    return walletBalanceForToken(walletTokens, selectedToken)
  }, [walletTokens, selectedToken])

  const setMax = useCallback(() => {
    const max = floorToDecimal(tokenMax.maxAmount, 6)
    setInputAmount(max.toFixed())
  }, [tokenMax])

  const handleSizePercentage = useCallback(
    (percentage: string) => {
      if (!stakeBank) return
      setSizePercentage(percentage)
      const amount = floorToDecimal(
        new Decimal(percentage).div(100).mul(tokenMax.maxAmount),
        stakeBank.mintDecimals,
      )
      setInputAmount(amount.toFixed())
    },
    [tokenMax, stakeBank],
  )

  const amountToBorrow = useMemo(() => {
    const borrowPrice = borrowBank?.uiPrice
    const stakePrice = stakeBank?.uiPrice
    if (!borrowPrice || !stakePrice || !Number(inputAmount)) return 0
    const borrowAmount =
      stakeBank?.uiPrice * Number(inputAmount) * (leverage - 1)
    return borrowAmount
  }, [leverage, borrowBank, stakeBank, inputAmount])

  const [availableVaultBalance] = useMemo(() => {
    if (!borrowBank || !group) return [0, 0]
    const vaultBalance = group.getTokenVaultBalanceByMintUi(borrowBank.mint)
    const vaultDeposits = borrowBank.uiDeposits()
    const available =
      vaultBalance - vaultDeposits * borrowBank.minVaultToDepositsRatio
    return [available, vaultBalance]
  }, [borrowBank, group])

  const handleRefreshWalletBalances = useCallback(async () => {
    if (!publicKey) return
    const actions = mangoStore.getState().actions
    setRefreshingWalletTokens(true)
    await actions.fetchWalletTokens(publicKey)
    setRefreshingWalletTokens(false)
  }, [publicKey])

  const handleDeposit = useCallback(async () => {
    if (!ipAllowed) {
      return
    }
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    const actions = mangoStore.getState().actions
    const mangoAccount = mangoStore.getState().mangoAccount.current
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const nextAccNumber =
      mangoAccounts.reduce((prev, current) => {
        return prev.accountNum > current.accountNum ? prev : current
      }, mangoAccounts[0])?.accountNum + 1

    if (!group || !stakeBank || !publicKey) return
    console.log(mangoAccounts)
    set((state) => {
      state.submittingBoost = true
    })
    try {
      // const newAccountfNum = getNextAccountNumber(mangoAccounts)
      notify({
        title: 'Building transaction. This may take a moment.',
        type: 'info',
      })
      const { signature: tx, slot } = await stakeAndCreate(
        client,
        group,
        mangoAccount,
        amountToBorrow,
        stakeBank.mint,
        parseFloat(inputAmount),
        mangoAccounts ? nextAccNumber : 0,
      )
      notify({
        title: 'Transaction confirmed',
        type: 'success',
        txid: tx,
      })
      set((state) => {
        state.submittingBoost = false
      })
      setInputAmount('')
      await sleep(500)
      if (!mangoAccount) {
        await actions.fetchMangoAccounts(
          (client.program.provider as AnchorProvider).wallet.publicKey,
        )
      }
      await actions.reloadMangoAccount(slot)
      await actions.fetchWalletTokens(publicKey)
    } catch (e) {
      console.error('Error depositing:', e)
      set((state) => {
        state.submittingBoost = false
      })
      if (!isMangoError(e)) return
      notify({
        title: 'Transaction failed',
        description: e.message,
        txid: e?.txid,
        type: 'error',
      })
    }
  }, [ipAllowed, stakeBank, publicKey, amountToBorrow, inputAmount])

  const showInsufficientBalance =
    tokenMax.maxAmount < Number(inputAmount) ||
    (selectedToken === 'USDC' && maxSolDeposit <= 0)

  const tokenDepositLimitLeft = stakeBank?.getRemainingDepositLimit()
  const tokenDepositLimitLeftUi =
    stakeBank && tokenDepositLimitLeft
      ? toUiDecimals(tokenDepositLimitLeft, stakeBank?.mintDecimals)
      : null

  const depositLimitExceeded =
    tokenDepositLimitLeftUi !== null
      ? Number(inputAmount) > tokenDepositLimitLeftUi
      : false

  const changeLeverage = (v: number) => {
    setLeverage(v * 1)

    if (Math.round(v) != storedLeverage) {
      set((state) => {
        state.leverage = Math.round(v)
      });
    }
  };

  useEffect(() => {
    const group = mangoStore.getState().group
    set((state) => {
      state.swap.outputBank = group?.banksMapByName.get(selectedToken)?.[0]
    })
  }, [selectedToken])

  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="pb-8">
          <SolBalanceWarnings
            amount={inputAmount}
            className="mb-4"
            setAmount={setInputAmount}
            selectedToken={selectedToken}
          />
          {availableVaultBalance < amountToBorrow && borrowBank && (
            <div className="mb-4">
              <InlineNotification
                type="warning"
                desc={
                  <div>
                    The available {borrowBank?.name} vault balance is low and
                    impacting the maximum amount you can <span>borrow</span>
                  </div>
                }
              />
            </div>
          )}
          {depositLimitExceeded && (
            <div className="mb-4">
              <InlineNotification
                type="warning"
                desc={
                  <div>
                    Deposit limit exceeded limit left {tokenDepositLimitLeftUi}{' '}
                    {stakeBank?.name}
                  </div>
                }
              />
            </div>
          )}
          <div className="grid grid-cols-2">
            <div className="col-span-2 flex justify-between">
              <Label text="Amount" />
              <div className="mb-2 flex items-center space-x-2">
                <MaxAmountButton
                  decimals={tokenMax.maxDecimals}
                  label={t('wallet-balance')}
                  onClick={setMax}
                  value={tokenMax.maxAmount}
                />
                <Tooltip content="Refresh Balance">
                  <IconButton
                    className={refreshingWalletTokens ? 'animate-spin' : ''}
                    onClick={handleRefreshWalletBalances}
                    hideBg
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="col-span-2">
              <div className="relative">
                <NumberFormat
                  name="amountIn"
                  id="amountIn"
                  inputMode="decimal"
                  thousandSeparator=","
                  allowNegative={false}
                  isNumericString={true}
                  decimalScale={6}
                  className={NUMBERFORMAT_CLASSES}
                  placeholder="0.00"
                  value={inputAmount}
                  onValueChange={(e: NumberFormatValues) => {
                    setInputAmount(
                      !Number.isNaN(Number(e.value)) ? e.value : '',
                    )
                  }}
                  isAllowed={withValueLimit}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <TokenLogo bank={stakeBank} size={24} />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="font-bold text-th-fgd-1">
                    {formatTokenSymbol(selectedToken)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2 mt-2">
              <ButtonGroup
                activeValue={sizePercentage}
                onChange={(p) => handleSizePercentage(p)}
                values={['10', '25', '50', '75', '100']}
                unit="%"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <Label text="Leverage" />
              <p className="mb-2 font-bold text-th-fgd-1">{leverage}x</p>
            </div>
            <LeverageSlider
              leverageMax={leverageMax}
              onChange={changeLeverage}
              step={0.01}
            />
          </div>
          {stakeBank && borrowBank ? (
            <div className="pt-8">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${
                        open ? 'rounded-b-none border-b-0' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Est. Net APY</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-th-success">
                            {estimatedNetAPY >= 0
                              ? '+'
                              : estimatedNetAPY === 0
                              ? ''
                              : '-'}
                            <FormatNumericValue
                              value={estimatedNetAPY}
                              decimals={2}
                            />
                            %
                          </span>
                          <ChevronDownIcon
                            className={`${
                              open ? 'rotate-180' : 'rotate-360'
                            } h-6 w-6 shrink-0 text-th-fgd-1`}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                      <div className="flex justify-between">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(selectedToken)} Leveraged APY
                        </p>
                        <span className="font-bold text-th-success">
                          {leveragedAPY > 0.01 ? '+' : ''}
                          <FormatNumericValue
                            value={leveragedAPY}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(selectedToken)} Collateral Fee APY
                        </p>
                        <span
                          className={`font-bold ${
                            collateralFeeAPY > 0.01
                              ? 'text-th-error'
                              : 'text-th-bkg-4'
                          }`}
                        >
                          {collateralFeeAPY > 0.01 ? '-' : ''}
                          <FormatNumericValue
                            value={collateralFeeAPY?.toString()}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      {borrowBank ? (
                        <>
                          <div className="flex justify-between">
                            <p className="text-th-fgd-4">{`${borrowBank?.name} Borrow Rate`}</p>
                            <span
                              className={`font-bold ${
                                borrowBankBorrowRate > 0.01
                                  ? 'text-th-error'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              -
                              <FormatNumericValue
                                value={borrowBankBorrowRate}
                                decimals={2}
                              />
                              %
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-th-fgd-4">{`${borrowBank.name} Borrowed`}</p>
                            <span
                              className={`font-bold ${
                                amountToBorrow > 0.001
                                  ? 'text-th-fgd-1'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              <FormatNumericValue
                                value={amountToBorrow}
                                decimals={3}
                              />
                              <span className="font-body text-th-fgd-4">
                                {' '}
                                {borrowBank.name}
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-th-fgd-4">{`${stakeBank.name} Position`}</p>
                            <span
                              className={`font-bold ${
                                amountToBorrow > 0.001
                                  ? 'text-th-fgd-1'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              <FormatNumericValue
                                value={leverage * Number(inputAmount)}
                                decimals={3}
                              />
                              <span className="font-body text-th-fgd-4">
                                {' '}
                                {stakeBank.name}{' '}
                              </span>
                              <span className="font-body text-th-fgd-4">
                                {' '}
                                (
                                <FormatNumericValue
                                  value={
                                    leverage *
                                    Number(inputAmount) *
                                    stakeBank?.uiPrice
                                  }
                                  decimals={3}
                                />{' '}
                                {borrowBank.name})
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-th-fgd-4">{`Liquidation Price`}</p>
                            <span
                              className={`font-bold ${
                                amountToBorrow > 0.001
                                  ? 'text-th-fgd-1'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              <FormatNumericValue
                                value={liquidationPrice}
                                decimals={5}
                              />
                              <span className="font-body text-th-fgd-4">
                                {' '}
                                {borrowBank.name}
                              </span>
                            </span>
                          </div>
                        </>
                      ) : null}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ) : !groupLoaded ? (
            <div className="pt-8">
              <SheenLoader className="flex flex-1 rounded-xl">
                <div className="h-[56px] w-full bg-th-bkg-2" />
              </SheenLoader>
            </div>
          ) : null}
        </div>
        {connected ? (
          <Button
            onClick={handleDeposit}
            className="w-full"
            disabled={
              connected &&
              (!inputAmount ||
                Number(inputAmount) == 0 ||
                showInsufficientBalance ||
                (borrowBank && availableVaultBalance < amountToBorrow) ||
                depositLimitExceeded ||
                !ipAllowed)
            }
            size="large"
          >
            {submitting ? (
              <Loading className="mr-2 h-5 w-5" />
            ) : showInsufficientBalance ? (
              <div className="flex items-center">
                <ExclamationCircleIcon className="icon-shadow mr-2 h-5 w-5 shrink-0" />
                {t('swap:insufficient-balance', {
                  symbol: selectedToken,
                })}
              </div>
            ) : ipAllowed ? (
              `Boost! ${inputAmount} ${formatTokenSymbol(selectedToken)}`
            ) : (
              'Country not allowed'
            )}
          </Button>
        ) : (
          <SecondaryConnectButton className="w-full" isLarge />
        )}
        {tokenPositionsFull ? (
          <InlineNotification
            type="error"
            desc={
              <>
                {t('error-token-positions-full')}{' '}
                <Link href="/settings" shallow>
                  {t('manage')}
                </Link>
              </>
            }
          />
        ) : null}
      </div>
    </>
  )
}

export default StakeForm
