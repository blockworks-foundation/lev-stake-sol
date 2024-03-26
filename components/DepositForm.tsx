import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import React, { useCallback, useMemo, useState } from 'react'
import NumberFormat, {
  NumberFormatValues,
  SourceInfo,
} from 'react-number-format'
import mangoStore from '@store/mangoStore'
import { notify } from '../utils/notifications'
import { formatTokenSymbol } from '../utils/tokens'
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
import SheenLoader from './shared/SheenLoader'
import { sleep } from 'utils'
import ButtonGroup from './forms/ButtonGroup'
import Decimal from 'decimal.js'
import useIpAddress from 'hooks/useIpAddress'
import { walletBalanceForToken } from './StakeForm'
import { ClientContextKeys } from 'utils/constants'

const set = mangoStore.getState().set

export const NUMBERFORMAT_CLASSES =
  'inner-shadow-top-sm w-full rounded-xl border border-th-bkg-3 bg-th-input-bkg p-3 pl-12 pr-4 text-left font-bold text-xl text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:border-th-bkg-4 md:hover:focus-visible:border-th-fgd-4'

interface StakeFormProps {
  token: string
  clientContext: ClientContextKeys
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

function DespositForm({ token: selectedToken, clientContext }: StakeFormProps) {
  const { t } = useTranslation(['common', 'account'])
  const [inputAmount, setInputAmount] = useState('')
  const submitting = mangoStore((s) => s.submittingBoost)
  const [refreshingWalletTokens, setRefreshingWalletTokens] = useState(false)
  const { maxSolDeposit } = useSolBalance()
  const { usedTokens, totalTokens } = useMangoAccountAccounts()
  const { jlpGroup } = useMangoGroup()
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const { connected, publicKey } = useWallet()
  const walletTokens = mangoStore((s) => s.wallet.tokens)
  const [sizePercentage, setSizePercentage] = useState('')
  const { ipAllowed } = useIpAddress()

  const depositBank = useMemo(() => {
    return jlpGroup?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, jlpGroup])

  const tokenMax = useMemo(() => {
    return walletBalanceForToken(walletTokens, selectedToken, clientContext)
  }, [walletTokens, selectedToken])

  const setMax = useCallback(() => {
    const max = floorToDecimal(tokenMax.maxAmount, 6)
    setInputAmount(max.toFixed())
  }, [tokenMax])

  const handleRefreshWalletBalances = useCallback(async () => {
    if (!publicKey) return
    const actions = mangoStore.getState().actions
    setRefreshingWalletTokens(true)
    await actions.fetchWalletTokens(publicKey)
    setRefreshingWalletTokens(false)
  }, [publicKey])

  const tokenPositionsFull = useMemo(() => {
    if (!depositBank || !usedTokens.length || !totalTokens.length) return false
    const hasTokenPosition = usedTokens.find(
      (token) => token.tokenIndex === depositBank.tokenIndex,
    )
    return hasTokenPosition ? false : usedTokens.length >= totalTokens.length
  }, [depositBank, usedTokens, totalTokens])

  const handleDeposit = useCallback(async () => {
    if (!ipAllowed) {
      return
    }
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group[clientContext]
    const actions = mangoStore.getState().actions
    const mangoAccounts = mangoStore.getState().mangoAccounts
    const mangoAccount = mangoStore.getState().mangoAccount.current
    const accNumber = getNextAccountNumber(mangoAccounts)

    if (!group || !depositBank || !publicKey) return

    set((state) => {
      state.submittingBoost = true
    })
    try {
      notify({
        title: 'Building transaction. This may take a moment.',
        type: 'info',
      })
      const { signature: tx, slot } = await depositAndCreate(
        client[clientContext],
        group,
        mangoAccount,
        depositBank.mint,
        parseFloat(inputAmount),
        accNumber ?? 0,
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
      setSizePercentage('')
      await sleep(500)
      if (!mangoAccount) {
        await actions.fetchMangoAccounts(publicKey)
      }
      await actions.reloadMangoAccount(clientContext, slot)
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
  }, [depositBank, publicKey, inputAmount, ipAllowed])

  const showInsufficientBalance =
    tokenMax.maxAmount < Number(inputAmount) ||
    (selectedToken === 'USDC' && maxSolDeposit <= 0)

  const handleSizePercentage = useCallback(
    (percentage: string) => {
      if (!depositBank) return
      setSizePercentage(percentage)
      const amount = floorToDecimal(
        new Decimal(percentage).div(100).mul(tokenMax.maxAmount),
        depositBank.mintDecimals,
      )
      setInputAmount(amount.toFixed())
    },
    [tokenMax, depositBank],
  )

  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="">
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
                  onValueChange={(e: NumberFormatValues, info: SourceInfo) => {
                    setInputAmount(
                      !Number.isNaN(Number(e.value)) ? e.value : '',
                    )
                    if (info.source === 'event') {
                      setSizePercentage('')
                    }
                  }}
                  isAllowed={withValueLimit}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <TokenLogo bank={depositBank} size={24} />
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
          {depositBank ? (
            <div className="pt-8"></div>
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
              (!inputAmount || showInsufficientBalance || !ipAllowed)
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

export default DespositForm
