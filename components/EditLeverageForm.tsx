import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import React, { useCallback, useMemo, useState } from 'react'
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
import useMangoGroup from 'hooks/useMangoGroup'
import { depositAndCreate, getNextAccountNumber } from 'utils/transactions'
// import { MangoAccount } from '@blockworks-foundation/mango-v4'
import { AnchorProvider } from '@project-serum/anchor'
import SheenLoader from './shared/SheenLoader'
import { sleep } from 'utils'
import ButtonGroup from './forms/ButtonGroup'
import Decimal from 'decimal.js'
import useIpAddress from 'hooks/useIpAddress'
import LeverageSlider from './shared/LeverageSlider'
import useMangoAccount from 'hooks/useMangoAccount'
import {
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import {
  formatNumericValue,
} from 'utils/numbers'
import FormatNumericValue from './shared/FormatNumericValue'
import { stakeAndCreate } from 'utils/transactions'
// import { MangoAccount } from '@blockworks-foundation/mango-v4'
import useBankRates from 'hooks/useBankRates'
import { Disclosure } from '@headlessui/react'
import useLeverageMax from 'hooks/useLeverageMax'
import { toNativeI80F48, toUiDecimals, toUiDecimalsForQuote } from '@blockworks-foundation/mango-v4'
import { token } from '@project-serum/anchor/dist/cjs/utils'
import { simpleSwap } from 'utils/transactions'

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

function EditLeverageForm({ token: selectedToken }: StakeFormProps) {
  const { t } = useTranslation(['common', 'account'])
  const submitting = mangoStore((s) => s.submittingBoost)
  const { ipAllowed } = useIpAddress()
  const storedLeverage = mangoStore((s) => s.leverage)
  const { usedTokens, totalTokens } = useMangoAccountAccounts()
  const { group } = useMangoGroup()
  const { mangoAccount } = useMangoAccount()
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const leverageMax = useLeverageMax(selectedToken) * 0.9 // Multiplied by 0.975 becuase you cant actually get to the end of the inifinite geometric series?
  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])
  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('USDC')?.[0]
  }, [group])

  const stakeBankAmount =
    mangoAccount && stakeBank && mangoAccount?.getTokenBalance(stakeBank)

  const borrowAmount =
    mangoAccount && borrowBank && mangoAccount?.getTokenBalance(borrowBank);

  const current_leverage = useMemo(() => {
    try {
      if (stakeBankAmount && borrowAmount) {
        const currentDepositValue = (Number(stakeBankAmount) * stakeBank.uiPrice)
        const lev = currentDepositValue / (currentDepositValue + Number(borrowAmount));
        return Math.sign(lev) !== -1 ? lev : 1
      }
      return 1
    } catch (e) {
      console.log(e)
      return 1
    }
  }, [stakeBankAmount, borrowAmount, stakeBank])

  const [leverage, setLeverage] = useState(current_leverage)

  const { financialMetrics, borrowBankBorrowRate } = useBankRates(
    selectedToken,
    leverage,
  )

  const liquidationPrice = useMemo(() => {
    const price = Number(stakeBank?.uiPrice)
    const borrowMaintLiabWeight = Number(borrowBank?.maintLiabWeight)
    const stakeMaintAssetWeight = Number(stakeBank?.maintAssetWeight)
    const loanOriginationFee = Number(borrowBank?.loanOriginationFeeRate)
    const liqPrice =
      price *
      ((borrowMaintLiabWeight * (1 + loanOriginationFee)) /
        stakeMaintAssetWeight) *
      (1 - 1 / leverage)
    return liqPrice.toFixed(3)
  }, [stakeBank, borrowBank, leverage])

  const tokenPositionsFull = useMemo(() => {
    if (!stakeBank || !usedTokens.length || !totalTokens.length) return false
    const hasTokenPosition = usedTokens.find(
      (token) => token.tokenIndex === stakeBank.tokenIndex,
    )
    return hasTokenPosition ? false : usedTokens.length >= totalTokens.length
  }, [stakeBank, usedTokens, totalTokens])
  const { connected, publicKey } = useWallet()

  const tokenMax = useMemo(() => {
    if (!stakeBank || !mangoAccount) return { maxAmount: 0.0, maxDecimals: 6 }
    return {
      maxAmount: mangoAccount?.getTokenBalanceUi(stakeBank) / current_leverage,
      maxDecimals: stakeBank.mintDecimals,
    }
  }, [stakeBank, mangoAccount, current_leverage])

  const amountToBorrow = useMemo(() => {
    const borrowPrice = borrowBank?.uiPrice
    const stakePrice = stakeBank?.uiPrice
    if (!borrowPrice || !stakePrice || !Number(tokenMax.maxAmount)) return 0
    const borrowAmount =
      stakeBank?.uiPrice * Number(tokenMax.maxAmount) * (leverage - 1)
    return borrowAmount
  }, [leverage, borrowBank, stakeBank, tokenMax])

  const availableVaultBalance = useMemo(() => {
    if (!borrowBank || !group) return 0
    const maxUtilization = 1 - borrowBank.minVaultToDepositsRatio
    const vaultBorrows = borrowBank.uiBorrows()
    const vaultDeposits = borrowBank.uiDeposits()
    const loanOriginationFeeFactor =
      1 - borrowBank.loanOriginationFeeRate.toNumber() - 1e-6
    const available =
      (maxUtilization * vaultDeposits - vaultBorrows) * loanOriginationFeeFactor
    return available
  }, [borrowBank, group])

  const changeInJLP = useMemo(() => {
    if (stakeBankAmount) {
      return Number(((leverage * tokenMax?.maxAmount) - toUiDecimals(stakeBankAmount, stakeBank?.mintDecimals)).toFixed(2));
    }
    else {
      return 0
    }
  }, [leverage, tokenMax, stakeBankAmount, stakeBank]);

  const loanOriginationFeeRate = useMemo(() => {
    if (!borrowBank || !stakeBank) return
    return toUiDecimals(borrowBank?.loanOriginationFeeRate, borrowBank?.mintDecimals) * 10000000 //adjustment for slippage so doesn't overshoot
  }, [borrowBank]);

  const changeInUSDC = useMemo(() => {
    if (borrowAmount) {
      const fee = toUiDecimals(borrowBank?.loanOriginationFeeRate, borrowBank?.mintDecimals) * 5000000 //adjustment for slippage so doesn't overshoot
      console.log(fee)
      return Number((- amountToBorrow - toUiDecimals(borrowAmount, borrowBank?.mintDecimals)).toFixed(2)) * (1 - fee);
    }
    else {
      return 0
    }
  }, [amountToBorrow, borrowAmount, borrowBank]);

  const handleChangeLeverage = useCallback(async () => {
    if (!ipAllowed) {
      console.log('IP NOT PERMITTED')
      return
    }

    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    const actions = mangoStore.getState().actions
    const mangoAccount = mangoStore.getState().mangoAccount.current
    const mangoAccounts = mangoStore.getState().mangoAccounts

    if (!group || !stakeBank || !publicKey || !mangoAccount) return
    console.log(mangoAccounts)
    set((state) => {
      state.submittingBoost = true
    })
    try {

      notify({
        title: 'Building transaction. This may take a moment.',
        type: 'info',
      })

      let slot_retrieved
      if (changeInJLP > 0) {
        console.log('Swapping From USDC to JLP')
        const { signature: tx, slot } = await simpleSwap(
          client,
          group,
          mangoAccount,
          borrowBank?.mint,
          stakeBank?.mint,
          - changeInUSDC,
        )
        slot_retrieved = slot
        notify({
          title: 'Transaction confirmed',
          type: 'success',
          txid: tx,
        })
      }
      else {
        console.log('Swapping From JLP to USDC')
        const { signature: tx, slot } = await simpleSwap(
          client,
          group,
          mangoAccount,
          stakeBank?.mint,
          borrowBank?.mint,
          - changeInJLP,
        )
        slot_retrieved = slot
        notify({
          title: 'Transaction confirmed',
          type: 'success',
          txid: tx,
        })
      }

      set((state) => {
        state.submittingBoost = false
      })

      await sleep(500)
      if (!mangoAccount) {
        await actions.fetchMangoAccounts(
          (client.program.provider as AnchorProvider).wallet.publicKey,
        )
      }

      await actions.reloadMangoAccount(slot_retrieved)
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
  }, [ipAllowed, stakeBank, publicKey, amountToBorrow, borrowBank?.mint])

  const tokenDepositLimitLeft = stakeBank?.getRemainingDepositLimit()
  const tokenDepositLimitLeftUi =
    stakeBank && tokenDepositLimitLeft
      ? toUiDecimals(tokenDepositLimitLeft, stakeBank?.mintDecimals)
      : 0

  const depositLimitExceeded =
    tokenDepositLimitLeftUi !== null
      ? Number(tokenMax.maxAmount) > tokenDepositLimitLeftUi
      : false

  const changeLeverage = (v: number) => {
    setLeverage(v * 1)
    if (Math.round(v) != storedLeverage) {
      set((state) => {
        state.leverage = Math.round(v)
      })
    }
  }

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
          {availableVaultBalance < amountToBorrow && borrowBank && (
            <div className="mb-4">
              <InlineNotification
                type="warning"
                desc={
                  <div>
                    The available {borrowBank?.name} vault balance is low and
                    impacting the maximum amount you can borrow
                  </div>
                }
              />
            </div>
          )}
          <div className="grid grid-cols-2">
            {depositLimitExceeded ? (
              <div className="col-span-2 mt-2">
                <InlineNotification
                  type="error"
                  desc={`Amount exceeds ${stakeBank?.name} deposit limit. ${formatNumericValue(
                    tokenDepositLimitLeftUi,
                  )} remaining.`}
                />
              </div>
            ) : null}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <Label text="Leverage" />
              <p className="mb-2 font-bold text-th-fgd-1">{leverage.toFixed(2)}x</p>
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
                      className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${open ? 'rounded-b-none border-b-0' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Est. Net APY</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold ${financialMetrics.APY > 0.001
                              ? 'text-th-success'
                              : 'text-th-error'
                              }`}
                          >
                            {financialMetrics.APY >= 0
                              ? '+'
                              : financialMetrics.APY === 0
                                ? ''
                                : ''}
                            <FormatNumericValue
                              value={financialMetrics.APY}
                              decimals={2}
                            />
                            %
                          </span>
                          <ChevronDownIcon
                            className={`${open ? 'rotate-180' : 'rotate-360'
                              } h-6 w-6 shrink-0 text-th-fgd-1`}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 py-3">
                      <h4 className="mb-4 border-b border-th-bkg-3 pb-2 text-sm">
                        Position
                      </h4>
                      <div className="mb-6 space-y-2 md:px-3">
                        <div className="flex justify-between">
                          <p className="text-th-fgd-4">Size</p>
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-bold ${amountToBorrow > 0.001
                                ? 'text-th-fgd-1'
                                : 'text-th-bkg-4'
                                }`}
                            >
                              <FormatNumericValue
                                value={leverage * Number(tokenMax.maxAmount)}
                                decimals={3}
                              />
                              (
                                {changeInJLP > 0 ? '+' : '-'}
                              <FormatNumericValue
                                value={changeInJLP > 0 ?  changeInJLP : - changeInJLP}
                                decimals={3}
                              />)
                              <span className="font-body text-th-fgd-4">
                                {' '}
                                {stakeBank.name}{' '}
                              </span>
                            </span>
                            <p className="font-body text-xs font-normal text-th-fgd-4">
                              <FormatNumericValue
                                value={
                                  leverage *
                                  Number(tokenMax.maxAmount) *
                                  stakeBank?.uiPrice
                                }
                                decimals={3}
                              />{' '}
                              {borrowBank.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-th-fgd-4">{`${borrowBank.name} Borrowed`}</p>
                          <span
                            className={`font-bold ${amountToBorrow > 0.001
                              ? 'text-th-fgd-1'
                              : 'text-th-bkg-4'
                              }`}
                          >
                            <FormatNumericValue
                              value={amountToBorrow}
                              decimals={3}
                            />
                            (
                              {changeInUSDC > 0? '-' : '+'}
                            <FormatNumericValue
                              value={changeInUSDC > 0 ?  changeInUSDC : - changeInUSDC}
                              decimals={3}
                            />)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-th-fgd-4">{`Est. Liquidation Price`}</p>
                          <span
                            className={`font-bold ${amountToBorrow > 0.001
                              ? 'text-th-fgd-1'
                              : 'text-th-bkg-4'
                              }`}
                          >
                            $
                            <FormatNumericValue
                              value={liquidationPrice}
                              decimals={3}
                            />
                          </span>
                        </div>
                      </div>
                      <h4 className="mb-4 border-b border-th-bkg-3 pb-2 text-sm">
                        Rates and Fees
                      </h4>
                      <div className="space-y-2 md:px-3">
                        <div className="flex justify-between">
                          <p className="text-th-fgd-4">
                            {formatTokenSymbol(selectedToken)} Yield APY
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
                        <div className="flex justify-between">
                          <p className="text-th-fgd-4">
                            {formatTokenSymbol(selectedToken)} Collateral Fee
                            APY
                          </p>
                          <span
                            className={`font-bold ${financialMetrics?.collateralFeeAPY > 0.01
                              ? 'text-th-error'
                              : 'text-th-bkg-4'
                              }`}
                          >
                            {financialMetrics?.collateralFeeAPY > 0.01
                              ? '-'
                              : ''}
                            <FormatNumericValue
                              value={financialMetrics?.collateralFeeAPY?.toString()}
                              decimals={2}
                            />
                            %
                          </span>
                        </div>
                        {borrowBank ? (
                          <>
                            <div className="flex justify-between">
                              <p className="text-th-fgd-4">{`${borrowBank?.name} Borrow APY`}</p>
                              <span
                                className={`font-bold ${borrowBankBorrowRate > 0.01
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
                            <div className="flex justify-between">
                              <p className="text-th-fgd-4">
                                Loan Origination Fee
                              </p>
                              <span>
                                {amountToBorrow ? (
                                  <span className="font-bold text-th-fgd-1">
                                    <FormatNumericValue
                                      value={
                                        changeInUSDC < 0 ?
                                          borrowBank?.loanOriginationFeeRate.toNumber() *
                                          - changeInUSDC
                                          :
                                          0
                                      }
                                      decimals={2}
                                    />
                                  </span>
                                ) : (
                                  <span className="font-bold text-th-bkg-4">
                                    0
                                  </span>
                                )}
                                <span className="font-bold text-th-fgd-4">
                                  {' '}
                                  {borrowBank.name}{' '}
                                </span>
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
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
            onClick={handleChangeLeverage}
            className="w-full"
            disabled={
              connected &&
              (!tokenMax.maxAmount || (borrowBank && availableVaultBalance < amountToBorrow) ||
                depositLimitExceeded ||
                !ipAllowed)
            }
            size="large"
          >
            {submitting ? (
              <Loading className="mr-2 h-5 w-5" />
            ) : ipAllowed ? (
              `Adjust Leverage`
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

export default EditLeverageForm
