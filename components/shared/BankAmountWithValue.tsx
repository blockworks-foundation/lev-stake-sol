import { Bank } from '@blockworks-foundation/mango-v4'
import Decimal from 'decimal.js'
import FormatNumericValue from './FormatNumericValue'

const BankAmountWithValue = ({
  amount = 0,
  bank,
  fixDecimals = true,
  stacked,
  value,
}: {
  amount: Decimal | number | string
  bank: Bank
  fixDecimals?: boolean
  stacked?: boolean
  value?: number
}) => {
  return (
    <p className={`font-bold text-th-fgd-1 ${stacked ? 'text-right' : ''}`}>
      <>
        <FormatNumericValue
          value={amount}
          decimals={amount && fixDecimals ? bank.mintDecimals : undefined}
        />{' '}
        <span className={`text-th-fgd-3 ${stacked ? 'block' : ''}`}>
          <FormatNumericValue
            value={value ? value : Number(amount) * bank.uiPrice}
            decimals={fixDecimals ? 2 : undefined}
            isUsd={true}
          />
        </span>
      </>
    </p>
  )
}

export default BankAmountWithValue
