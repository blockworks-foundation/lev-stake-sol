import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
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
import { TokenAccount } from '../utils/tokens'
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
import BankAmountWithValue from './shared/BankAmountWithValue'
// import useBanksWithBalances from 'hooks/useBanksWithBalances'
import { isMangoError } from 'types'
import TokenListButton from './shared/TokenListButton'
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

const set = mangoStore.getState().set

interface DepositFormProps {
  onSuccess: () => void
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

function DepositForm({ onSuccess, token: selectedToken }: DepositFormProps) {
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
  const walletTokens = mangoStore((s) => s.wallet.tokens)

  const tokenMax = useMemo(() => {
    return walletBalanceForToken(walletTokens, selectedToken)
  }, [walletTokens, selectedToken])

  const setMax = useCallback(() => {
    const max = floorToDecimal(tokenMax.maxAmount, 6)
    setInputAmount(max.toFixed())
  }, [tokenMax])

  // const handleSelectToken = (token: string) => {
  //   setSelectedToken(token)
  //   setShowTokenList(false)
  // }

  const solAmountToBorrow = useMemo(() => {
    const solPrice = solBank?.uiPrice
    const stakePrice = stakeBank?.uiPrice
    if (!solPrice || !stakePrice || !Number(inputAmount)) return 0
    const priceDifference = (stakePrice - solPrice) / solPrice
    const borrowAmount =
      (1 + priceDifference) * Number(inputAmount) * (leverage - 1)

    return borrowAmount
  }, [leverage, solBank, stakeBank, inputAmount])

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
      console.log('starting deposit')
      console.log('solAmountToBorrow', solAmountToBorrow)

      const newAccountNum = getNextAccountNumber(mangoAccounts)
      const { signature: tx, slot } = await stakeAndCreate(
        client,
        group,
        mangoAccount,
        solAmountToBorrow,
        stakeBank.mint,
        parseFloat(inputAmount),
        newAccountNum,
      )
      notify({
        title: 'Transaction confirmed',
        type: 'success',
        txid: tx,
      })

      await actions.reloadMangoAccount(slot)
      actions.fetchWalletTokens(publicKey)
      setSubmitting(false)
      onSuccess()
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
  }, [stakeBank, publicKey, inputAmount, solAmountToBorrow, onSuccess])

  const showInsufficientBalance =
    tokenMax.maxAmount < Number(inputAmount) ||
    (selectedToken === 'SOL' && maxSolDeposit <= 0)

  const changeLeverage = useCallback((v: string) => {
    setLeverage(Number(v) * 1)
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
        <div className="m-6 flex flex-col justify-between">
          <div>
            <SolBalanceWarnings
              amount={inputAmount}
              className="mb-4"
              setAmount={setInputAmount}
              selectedToken={selectedToken}
            />
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-between">
                <Label text={`Stake Token`} />
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
                      <ArrowPathIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="col-span-1">
                <TokenListButton
                  token={selectedToken}
                  logo={<TokenLogo bank={stakeBank} />}
                  setShowList={setShowTokenList}
                />
              </div>
              <div className="col-span-1">
                <NumberFormat
                  name="amountIn"
                  id="amountIn"
                  inputMode="decimal"
                  thousandSeparator=","
                  allowNegative={false}
                  isNumericString={true}
                  decimalScale={6}
                  className={
                    'w-full rounded-lg rounded-l-none border border-th-input-border bg-th-input-bkg p-3 text-right font-mono text-xl text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:border-th-input-border-hover md:hover:focus-visible:border-th-fgd-4'
                  }
                  placeholder="0.00"
                  value={inputAmount}
                  onValueChange={(e: NumberFormatValues) => {
                    setInputAmount(
                      !Number.isNaN(Number(e.value)) ? e.value : '',
                    )
                  }}
                  isAllowed={withValueLimit}
                />
              </div>
            </div>
            <div className="mt-3">
              <div>Leverage: {leverage}x</div>
              <LeverageSlider
                amount={leverage}
                leverageMax={3}
                onChange={changeLeverage}
                step={0.1}
              />
            </div>
            {stakeBank && solBank ? (
              <>
                <div className="mt-2 space-y-1.5 px-2 py-4 text-sm">
                  <div className="flex justify-between">
                    <p>{t('deposit-amount')}</p>
                    <BankAmountWithValue
                      amount={inputAmount}
                      bank={stakeBank}
                    />
                  </div>
                  <div className="flex justify-between">
                    <p>SOL borrowed</p>
                    {solBank ? (
                      <FormatNumericValue
                        value={solAmountToBorrow}
                        decimals={3}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-th-bkg-3 px-2 py-4 text-sm ">
                  <div className="flex justify-between">
                    <p>{selectedToken} Leveraged APR</p>
                    <span>
                      <FormatNumericValue
                        value={7.28 * leverage}
                        decimals={2}
                      />
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p>{selectedToken} Deposit Rate</p>
                    <span>
                      <FormatNumericValue
                        value={stakeBank.getDepositRateUi()}
                        decimals={2}
                      />
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p>SOL Borrow Rate</p>
                    <span>
                      <FormatNumericValue
                        value={solBank.getDepositRateUi()}
                        decimals={2}
                      />
                      %
                    </span>
                  </div>
                </div>
              </>
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
                <div className="flex items-center">
                  Leverage Stake {inputAmount} {selectedToken}
                </div>
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
                  <Link href="/settings" onClick={() => onSuccess()} shallow>
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

export default DepositForm
