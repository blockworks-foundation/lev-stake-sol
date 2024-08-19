import YieldCalculator from '@components/home/YieldCalculator'
import { NextPage } from 'next'
import Link from 'next/link'

const YieldCalc: NextPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl py-12">
      <h2 className="text-shadow mb-2 px-6 text-center text-3xl text-th-button-text md:text-5xl xl:px-0">
        Yield calculator
      </h2>
      <p className="mb-6 text-center text-base text-th-fgd-2">
        Compare native liquid staking yields with Yield Fan to see the extra
        returns you could earn.
      </p>
      <YieldCalculator />
      <div className="mx-auto max-w-3xl pt-6">
        <p className="text-center text-sm text-th-fgd-4">
          This calculator is for educational purposes only. It assumes rates and
          prices remain constant over time. Take the time to understand the{' '}
          <Link className="underline md:hover:no-underline" href="/risks">
            risks
          </Link>{' '}
          before depositing any funds.
        </p>
      </div>
    </div>
  )
}

export default YieldCalc
