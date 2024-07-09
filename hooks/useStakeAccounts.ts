import { MangoAccount } from '@blockworks-foundation/mango-v4'
import mangoStore from '@store/mangoStore'
import { useMemo } from 'react'
import { BOOST_ACCOUNT_PREFIX } from 'utils/constants'

export default function useStakeAccounts(): {
  stakeAccounts: MangoAccount[] | undefined
} {
  const mangoAccounts = mangoStore((s) => s.mangoAccounts)
  const stakeAccounts = useMemo(() => {
    return mangoAccounts.filter((ma) =>
      ma.name.includes(`${BOOST_ACCOUNT_PREFIX}`),
    )
  }, [mangoAccounts])

  return {
    stakeAccounts,
  }
}
