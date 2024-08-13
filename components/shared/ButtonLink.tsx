import Link from 'next/link'
import { ReactNode } from 'react'

const ButtonLink = ({
  path,
  children,
  size = 'large',
  className,
  onClick,
}: {
  path: string
  children: ReactNode
  size?: 'small' | 'large'
  className?: string
  onClick?: () => void
}) => {
  return (
    <Link
      className={`raised-button text-shadow group flex w-max items-center justify-center rounded-xl font-extrabold text-th-button-text after:rounded-xl focus:outline-none md:hover:text-th-button-text ${
        size === 'large' ? 'h-14 px-8 text-xl' : 'h-9 px-4 text-base'
      } ${className}`}
      href={path}
      onClick={onClick}
    >
      <span className="group-hover:mt-1 group-active:mt-2">{children}</span>
    </Link>
  )
}

export default ButtonLink
