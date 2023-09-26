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
import {
  ACCOUNT_ACTION_MODAL_INNER_HEIGHT,
  // INPUT_TOKEN_DEFAULT,
} from '../utils/constants'
import { notify } from '../utils/notifications'
import { TokenAccount, formatTokenSymbol } from '../utils/tokens'
// import ActionTokenList from './account/ActionTokenList'
import Label from './forms/Label'
import Button, { IconButton } from './shared/Button'
import Loading from './shared/Loading'
import { EnterBottomExitBottom, FadeInFadeOut } from './shared/Transitions'
import MaxAmountButton from '@components/shared/MaxAmountButton'
import Tooltip from '@components/shared/Tooltip'
import SolBalanceWarnings from '@components/shared/SolBalanceWarnings'
import useSolBalance from 'hooks/useSolBalance'
import { floorToDecimal, withValueLimit } from 'utils/numbers'
// import useBanksWithBalances from 'hooks/useBanksWithBalances'
import { isMangoError } from 'types'
// import TokenListButton from './shared/TokenListButton'
import TokenLogo from './shared/TokenLogo'
import SecondaryConnectButton from './shared/SecondaryConnectButton'
import useMangoAccountAccounts from 'hooks/useMangoAccountAccounts'
import InlineNotification from './shared/InlineNotification'
import Link from 'next/link'
import BackButton from './swap/BackButton'
import LeverageSlider from './shared/LeverageSlider'
import useMangoGroup from 'hooks/useMangoGroup'
import FormatNumericValue from './shared/FormatNumericValue'
import { stakeAndCreate } from 'utils/transactions'
import { MangoAccount } from '@blockworks-foundation/mango-v4'
import { AnchorProvider } from '@project-serum/anchor'
import useBankRates from 'hooks/useBankRates'
import { Disclosure } from '@headlessui/react'
import SheenLoader from './shared/SheenLoader'
import useLeverageMax from 'hooks/useLeverageMax'

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

const getNextAccountNumber = (accounts: MangoAccount[]): number => {
  if (accounts.length > 1) {
    return (
      accounts
        .map((a) => a.accountNum)
        .reduce((a, b) => Math.max(a, b), -Infinity) + 1
    )
  } else if (accounts.length === 1) {
    return accounts[0].accountNum + 1
  }
  return 0
}

function StakeForm({ token: selectedToken }: StakeFormProps) {
  const { t } = useTranslation(['common', 'account'])
  const [inputAmount, setInputAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // const [selectedToken, setSelectedToken] = useState(
  //   token || INPUT_TOKEN_DEFAULT,
  // )
  const [leverage, setLeverage] = useState(1)
  const [showTokenList, setShowTokenList] = useState(false)
  const [refreshingWalletTokens, setRefreshingWalletTokens] = useState(false)
  const { maxSolDeposit } = useSolBalance()
  // const banks = useBanksWithBalances('walletBalance')
  const { usedTokens, totalTokens } = useMangoAccountAccounts()
  const { group } = useMangoGroup()
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const {
    stakeBankDepositRate,
    borrowBankBorrowRate,
    leveragedAPY,
    estimatedNetAPY,
  } = useBankRates(selectedToken, leverage)
  const leverageMax = useLeverageMax(selectedToken)

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
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
  const walletTokens = mangoStore((s) => s.wallet.tokens)

  const tokenMax = useMemo(() => {
    return walletBalanceForToken(walletTokens, selectedToken)
  }, [walletTokens, selectedToken])

  const setMax = useCallback(() => {
    const max = floorToDecimal(tokenMax.maxAmount, 6)
    setInputAmount(max.toFixed())
  }, [tokenMax])

  const amountToBorrow = useMemo(() => {
    const solPrice = borrowBank?.uiPrice
    const stakePrice = stakeBank?.uiPrice
    if (!solPrice || !stakePrice || !Number(inputAmount)) return 0
    const priceDifference = (stakePrice - solPrice) / solPrice
    const borrowAmount =
      (1 + priceDifference) * Number(inputAmount) * Math.min(leverage - 1, 1)

    return borrowAmount
  }, [leverage, borrowBank, stakeBank, inputAmount])

  const handleRefreshWalletBalances = useCallback(async () => {
    if (!publicKey) return
    const actions = mangoStore.getState().actions
    setRefreshingWalletTokens(true)
    await actions.fetchWalletTokens(publicKey)
    setRefreshingWalletTokens(false)
  }, [publicKey])

  const handleDeposit = useCallback(async () => {
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    const actions = mangoStore.getState().actions
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const mangoAccount = mangoStore.getState().mangoAccount.current

    if (!group || !stakeBank || !publicKey) return

    setSubmitting(true)
    try {
      const newAccountNum = getNextAccountNumber(mangoAccounts)
      const { signature: tx, slot } = await stakeAndCreate(
        client,
        group,
        mangoAccount,
        amountToBorrow,
        stakeBank.mint,
        parseFloat(inputAmount),
        newAccountNum + 300,
      )
      notify({
        title: 'Transaction confirmed',
        type: 'success',
        txid: tx,
      })
      if (!mangoAccount) {
        await actions.fetchMangoAccounts(
          (client.program.provider as AnchorProvider).wallet.publicKey,
        )
      }
      await actions.reloadMangoAccount(slot)
      await actions.fetchWalletTokens(publicKey)
      setSubmitting(false)
      setInputAmount('')
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
  }, [stakeBank, publicKey, inputAmount, amountToBorrow])

  const showInsufficientBalance =
    tokenMax.maxAmount < Number(inputAmount) ||
    (selectedToken === 'SOL' && maxSolDeposit <= 0)

  const changeLeverage = useCallback((v: number) => {
    setLeverage(v * 1)
  }, [])

  useEffect(() => {
    const group = mangoStore.getState().group
    set((state) => {
      state.swap.outputBank = group?.banksMapByName.get(selectedToken)?.[0]
    })
  }, [selectedToken])

  return (
    <>
      <EnterBottomExitBottom
        className={`absolute bottom-0 left-0 z-20 h-[${ACCOUNT_ACTION_MODAL_INNER_HEIGHT}] w-full overflow-auto rounded-lg bg-th-bkg-1 p-6`}
        show={showTokenList}
      >
        <BackButton onClick={() => setShowTokenList(false)} />
        <h2 className="mb-4 text-center text-lg">Select token to stake</h2>
        <div className="flex items-center px-4 pb-2">
          <div className="w-1/2 text-left">
            <p className="text-xs">{t('token')}</p>
          </div>
          <div className="w-1/2 text-right">
            <p className="whitespace-nowrap text-xs">{t('wallet-balance')}</p>
          </div>
        </div>
        {/* <ActionTokenList
          banks={banks}
          onSelect={handleSelectToken}
          showDepositRates
          valueKey="walletBalance"
        /> */}
      </EnterBottomExitBottom>
      <FadeInFadeOut show={!showTokenList}>
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
                    label={t('wallet-balance')}
                    onClick={setMax}
                    value={tokenMax.maxAmount}
                  />
                  <Tooltip content={t('account:refresh-balance')}>
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
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <Label text="Leverage" />
                <p className="mb-2 font-bold text-th-fgd-1">{leverage}x</p>
              </div>
              <LeverageSlider
                leverageMax={leverageMax}
                onChange={changeLeverage}
                step={0.1}
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
                              } h-6 w-6 flex-shrink-0 text-th-fgd-1`}
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
                            {formatTokenSymbol(selectedToken)} Deposit Rate
                          </p>
                          <span
                            className={`font-bold ${
                              stakeBankDepositRate > 0.01
                                ? 'text-th-success'
                                : 'text-th-bkg-4'
                            }`}
                          >
                            {stakeBankDepositRate > 0.01 ? '+' : ''}
                            <FormatNumericValue
                              value={stakeBankDepositRate}
                              decimals={2}
                            />
                            %
                          </span>
                        </div>
                        {borrowBank ? (
                          <>
                            <div className="flex justify-between">
                              <p className="text-th-fgd-4">{`${borrowBank.name} Borrow Rate`}</p>
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
              className="flex w-full items-center justify-center"
              disabled={connected && (!inputAmount || showInsufficientBalance)}
              size="large"
            >
              {submitting ? (
                <Loading className="mr-2 h-5 w-5" />
              ) : showInsufficientBalance ? (
                <div className="flex items-center">
                  <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {t('swap:insufficient-balance', {
                    symbol: selectedToken,
                  })}
                </div>
              ) : (
                `Boost! ${inputAmount} ${formatTokenSymbol(selectedToken)}`
              )}
            </Button>
          ) : (
            <SecondaryConnectButton
              className="flex w-full items-center justify-center"
              isLarge
            />
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
      </FadeInFadeOut>
    </>
  )
}

export default StakeForm
