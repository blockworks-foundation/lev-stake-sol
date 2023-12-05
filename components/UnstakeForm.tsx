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
// import ActionTokenList from './account/ActionTokenList'
import Label from './forms/Label'
import Button, { IconButton } from './shared/Button'
import Loading from './shared/Loading'
import MaxAmountButton from '@components/shared/MaxAmountButton'
import Tooltip from '@components/shared/Tooltip'
import SolBalanceWarnings from '@components/shared/SolBalanceWarnings'
import useSolBalance from 'hooks/useSolBalance'
import { floorToDecimal, withValueLimit } from 'utils/numbers'
import BankAmountWithValue from './shared/BankAmountWithValue'
// import useBanksWithBalances from 'hooks/useBanksWithBalances'
import { isMangoError } from 'types'
// import TokenListButton from './shared/TokenListButton'
import TokenLogo from './shared/TokenLogo'
import SecondaryConnectButton from './shared/SecondaryConnectButton'
import useMangoAccountAccounts from 'hooks/useMangoAccountAccounts'
import InlineNotification from './shared/InlineNotification'
import Link from 'next/link'
import useMangoGroup from 'hooks/useMangoGroup'
import FormatNumericValue from './shared/FormatNumericValue'
import useMangoAccount from 'hooks/useMangoAccount'
import { unstakeAndSwap, withdrawAndClose } from 'utils/transactions'
import { NUMBERFORMAT_CLASSES } from './StakeForm'
import ButtonGroup from './forms/ButtonGroup'
import Decimal from 'decimal.js'
import { Disclosure } from '@headlessui/react'
import { sleep } from 'utils'
import { usePlausible } from 'next-plausible'
import { TelemetryEvents } from 'utils/telemetry'

const set = mangoStore.getState().set

interface UnstakeFormProps {
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

function UnstakeForm({ token: selectedToken }: UnstakeFormProps) {
  const { t } = useTranslation(['common', 'account'])
  const [inputAmount, setInputAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // const [selectedToken, setSelectedToken] = useState(
  //   token || INPUT_TOKEN_DEFAULT,
  // )
  const [refreshingWalletTokens, setRefreshingWalletTokens] = useState(false)
  const [sizePercentage, setSizePercentage] = useState('')
  const { maxSolDeposit } = useSolBalance()
  // const banks = useBanksWithBalances('walletBalance')
  const { usedTokens, totalTokens } = useMangoAccountAccounts()
  const { group } = useMangoGroup()
  const { mangoAccount } = useMangoAccount()
  const telemetry = usePlausible<TelemetryEvents>()

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const solBank = useMemo(() => {
    return group?.banksMapByName.get('SOL')?.[0]
  }, [group])

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
      maxAmount: mangoAccount.getTokenBalanceUi(stakeBank),
      maxDecimals: stakeBank.mintDecimals,
    }
  }, [stakeBank, mangoAccount])

  const setMax = useCallback(() => {
    const max = floorToDecimal(tokenMax.maxAmount, tokenMax.maxDecimals)
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

  // const handleSelectToken = (token: string) => {
  //   setSelectedToken(token)
  //   setShowTokenList(false)
  // }

  const handleRefreshWalletBalances = useCallback(async () => {
    if (!publicKey) return
    const actions = mangoStore.getState().actions
    setRefreshingWalletTokens(true)
    await actions.fetchMangoAccounts(publicKey)
    setRefreshingWalletTokens(false)
  }, [publicKey])

  const solBorrowed = useMemo(() => {
    if (!solBank || !mangoAccount) return 0.0
    return mangoAccount.getTokenBalanceUi(solBank)
  }, [solBank, mangoAccount])

  const handleWithdraw = useCallback(async () => {
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    const actions = mangoStore.getState().actions
    let mangoAccount = mangoStore.getState().mangoAccount.current

    if (!group || !stakeBank || !solBank || !publicKey || !mangoAccount) return

    setSubmitting(true)
    try {
      if (mangoAccount.getTokenBalanceUi(solBank) < 0) {
        notify({
          title: 'Sending transaction 1 of 2',
          type: 'info',
        })
        console.log('unstake and swap', mangoAccount.getTokenBalanceUi(solBank))

        const { signature: tx } = await unstakeAndSwap(
          client,
          group,
          mangoAccount,
          stakeBank.mint,
        )
        notify({
          title: 'Swap Transaction confirmed.',
          type: 'success',
          txid: tx,
        })
        await sleep(300)
        await actions.fetchMangoAccounts(mangoAccount.owner)
        await actions.fetchWalletTokens(publicKey)
        mangoAccount = mangoStore.getState().mangoAccount.current
        notify({
          title: 'Sending transaction 2 of 2',
          type: 'info',
        })
      }
      if (!mangoAccount) return
      const { signature: tx2 } = await withdrawAndClose(
        client,
        group,
        mangoAccount,
        stakeBank.mint,
        Number(inputAmount),
      )
      notify({
        title: 'Withdraw transaction confirmed.',
        type: 'success',
        txid: tx2,
      })
      setSubmitting(false)
      setInputAmount('')
      await sleep(500)
      await actions.fetchMangoAccounts(mangoAccount.owner)
      await actions.fetchWalletTokens(publicKey)
      telemetry('positionReduce', {
        props: {
          token: selectedToken,
        },
      })
    } catch (e) {
      console.error('Error depositing:', e)
      setSubmitting(false)
      if (!isMangoError(e)) return
      notify({
        title: 'Transaction failed',
        description: e.message,
        txid: e?.txid,
        type: 'error',
      })
    }
  }, [stakeBank, publicKey, inputAmount])

  const showInsufficientBalance =
    tokenMax.maxAmount < Number(inputAmount) ||
    (selectedToken === 'SOL' && maxSolDeposit <= 0)

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
          <div className="grid grid-cols-2">
            <div className="col-span-2 flex justify-between">
              <Label text="Amount" />
              <div className="mb-2 flex items-center space-x-2">
                <MaxAmountButton
                  decimals={tokenMax.maxDecimals}
                  label={t('balance')}
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
                  decimalScale={stakeBank?.mintDecimals || 6}
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
          {stakeBank && solBank ? (
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
                        <p className="font-medium">Staked Amount</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-th-fgd-1">
                            <FormatNumericValue
                              value={tokenMax.maxAmount}
                              decimals={stakeBank.mintDecimals}
                            />
                          </span>
                          <ChevronDownIcon
                            className={`${
                              open ? 'rotate-180' : ''
                            } h-6 w-6 shrink-0 text-th-fgd-1`}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                      <div className="flex justify-between">
                        <p className="text-th-fgd-4">Staked Amount</p>
                        <span className="font-bold text-th-fgd-1">
                          <BankAmountWithValue
                            amount={tokenMax.maxAmount}
                            bank={stakeBank}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-th-fgd-4">SOL borrowed</p>
                        {solBank ? (
                          <span
                            className={`font-bold ${
                              solBorrowed > 0.001
                                ? 'text-th-fgd-1'
                                : 'text-th-bkg-4'
                            }`}
                          >
                            <FormatNumericValue
                              value={solBorrowed}
                              decimals={3}
                            />
                          </span>
                        ) : null}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ) : null}
        </div>
        {connected ? (
          <Button
            onClick={handleWithdraw}
            className="w-full"
            disabled={connected && (!inputAmount || showInsufficientBalance)}
            size="large"
          >
            {submitting ? (
              <Loading className="mr-2 h-5 w-5" />
            ) : showInsufficientBalance ? (
              <div className="flex items-center">
                <ExclamationCircleIcon className="icon-shadow mr-2 h-5 w-5 shrink-0" />
                {t('swap:insufficient-balance', {
                  symbol: formatTokenSymbol(selectedToken),
                })}
              </div>
            ) : (
              `Unboost ${inputAmount} ${formatTokenSymbol(selectedToken)}`
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

export default UnstakeForm
