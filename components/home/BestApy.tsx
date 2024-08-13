import useStakeableTokens, { StakeableToken } from 'hooks/useStakeableTokens'
import { useMemo } from 'react'

const BestApy = ({ className }: { className?: string }) => {
  const { stakeableTokens } = useStakeableTokens()

  const best = useMemo(() => {
    const sorted = stakeableTokens.sort(
      (a: StakeableToken, b: StakeableToken) => {
        const aApy = a.estNetApy
        const bApy = b.estNetApy
        return bApy - aApy
      },
    )
    if (sorted?.length) {
      return sorted[0]?.estNetApy || 0
    } else return 0
  }, [stakeableTokens])

  return (
    <span className={className}>{best ? `${best.toFixed(1)}%` : '...'}</span>
  )
}

export default BestApy
