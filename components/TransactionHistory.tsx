/* eslint-disable @typescript-eslint/no-explicit-any */
import useAccountHistory from 'hooks/useAccountHistory'
import { ActivityFeed } from 'types'

const TransactionHistory = () => {
  const { history } = useAccountHistory()

  return (
    <div className="flex justify-center rounded-2xl border border-th-fgd-1 p-6">
      {history ? (
        history.map((history: ActivityFeed | any) => {
          return (
            <div key={history.block_datetime}>
              <div>{history.activity_type}</div>
              <div>{history.activity_details.symbol}</div>
              <div>{history.activity_details.quantity}</div>
              <div>{history.activity_details.signature}</div>
            </div>
          )
        })
      ) : (
        <span>No transaction history found</span>
      )}
    </div>
  )
}

export default TransactionHistory
