/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import useAccountHistory from 'hooks/useAccountHistory'
import { ActivityFeed, DepositWithdrawFeedItem, SwapHistoryItem } from 'types'
import SheenLoader from './shared/SheenLoader'

const TransactionHistory = () => {
  const { history, isLoading } = useAccountHistory()
  return (
    <div className="flex min-h-[380px] flex-col space-y-2 rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      {history?.length ? (
        history.map((history: ActivityFeed | any) => {
          const { activity_type, activity_details } = history
          const symbol = activity_details.symbol || ''
          return (
            <HistoryContent
              details={activity_details}
              type={activity_type}
              key={activity_details.signature + activity_type + symbol}
            />
          )
        })
      ) : isLoading ? (
        [...Array(4)].map((x, i) => (
          <SheenLoader className="flex flex-1 rounded-xl" key={i}>
            <div className="h-[76px] w-full bg-th-bkg-2" />
          </SheenLoader>
        ))
      ) : (
        <div className="flex grow flex-col items-center justify-center">
          <span className="text-center">No transaction history found</span>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory

type HistoryContentProps = {
  details: SwapHistoryItem | DepositWithdrawFeedItem
  type: string
}

function isDeposit(
  details: SwapHistoryItem | DepositWithdrawFeedItem,
): details is DepositWithdrawFeedItem {
  if ('quantity' in details) return true
  else return false
}

function isSwap(
  details: SwapHistoryItem | DepositWithdrawFeedItem,
): details is SwapHistoryItem {
  if ('swap_in_amount' in details) return true
  else return false
}

const HistoryContent = ({ details, type }: HistoryContentProps) => {
  switch (type) {
    case 'deposit':
      if (isDeposit(details)) {
        return <DepositHistory details={details} />
      }
      break
    case 'swap':
      if (isSwap(details)) {
        return <SwapHistory details={details} />
      }
      break
    default:
      return null
  }
  return null
}

const DepositHistory = ({ details }: { details: DepositWithdrawFeedItem }) => {
  const { block_datetime, quantity, signature, symbol } = details
  return (
    <a
      className="block rounded-xl border-2 border-th-bkg-3 p-4 md:hover:border-th-bkg-2"
      href={`https://explorer.solana.com/tx/${signature}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm">
              {dayjs(block_datetime).format('ddd D MMM h:mma')}
            </p>
            <h4 className="text-sm leading-tight md:text-base md:leading-none">{`Deposit ${quantity} ${symbol}`}</h4>
          </div>
          <ArrowTopRightOnSquareIcon className="ml-3 h-5 w-5 flex-shrink-0 text-th-fgd-4 md:h-6 md:w-6" />
        </div>
      </div>
    </a>
  )
}

const SwapHistory = ({ details }: { details: SwapHistoryItem }) => {
  const {
    block_datetime,
    signature,
    swap_in_amount,
    swap_in_symbol,
    swap_out_amount,
    swap_out_symbol,
  } = details
  return (
    <a
      className="block rounded-xl border-2 border-th-bkg-3 p-4 md:hover:border-th-bkg-2"
      href={`https://explorer.solana.com/tx/${signature}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm">
              {dayjs(block_datetime).format('ddd D MMM h:mma')}
            </p>
            <h4 className="text-sm leading-tight md:text-base md:leading-none">{`Swap ${swap_in_amount} ${swap_in_symbol} for ${swap_out_amount} ${swap_out_symbol}`}</h4>
          </div>
          <ArrowTopRightOnSquareIcon className="ml-3 h-5 w-5 flex-shrink-0 text-th-fgd-4 md:h-6 md:w-6" />
        </div>
      </div>
    </a>
  )
}
