import Link from 'next/link'
import { ReactNode } from 'react'

const ButtonLink = ({
  path,
  children,
  size = 'large',
  className,
}: {
  path: string
  children: ReactNode
  size?: 'small' | 'large'
  className?: string
}) => {
  return (
    <Link
      className={`raised-button text-shadow group flex w-max items-center justify-center rounded-lg font-extrabold text-th-button-text after:rounded-lg focus:outline-none md:hover:text-th-button-text ${
        size === 'large' ? 'h-14 px-8 text-xl' : 'h-9 px-4 text-base'
      } ${className}`}
      href={path}
    >
      <span className="group-hover:mt-1 group-active:mt-2">{children}</span>
    </Link>
  )
}

export default ButtonLink
