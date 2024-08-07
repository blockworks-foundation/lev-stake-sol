import { forwardRef, FunctionComponent, ReactNode, Ref } from 'react'

interface AllButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  disabled?: boolean
  className?: string
  secondary?: boolean
  children?: ReactNode
}

interface ButtonProps {
  size?: 'large' | 'medium' | 'small'
  type?: 'button' | 'submit'
}

type ButtonCombinedProps = AllButtonProps & ButtonProps

const Button: FunctionComponent<ButtonCombinedProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  secondary,
  size = 'medium',
  type = 'button',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-lg ${
        secondary
          ? 'border border-th-button focus-visible:border-th-fgd-4 md:hover:border-th-button-hover'
          : 'raised-button text-shadow group text-xl text-th-button-text after:rounded-lg'
      } ${
        size === 'medium'
          ? 'h-10 px-4'
          : size === 'large'
          ? 'h-14 px-8'
          : 'h-8 px-3'
      } font-extrabold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type={type}
      {...props}
    >
      <span className="mt-1 group-hover:mt-2 group-active:mt-3">
        {children}
      </span>
    </button>
  )
}

interface IconButtonProps {
  hideBg?: boolean
  size?: 'small' | 'medium' | 'large'
  ref?: Ref<HTMLButtonElement>
  isPrimary?: boolean
}

type IconButtonCombinedProps = AllButtonProps & IconButtonProps

export const IconButton = forwardRef<
  HTMLButtonElement,
  IconButtonCombinedProps
>((props, ref) => {
  const {
    children,
    onClick,
    disabled = false,
    className,
    hideBg,
    size,
    isPrimary,
  } = props
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex shrink-0 ${
        size === 'large'
          ? 'h-12 w-12'
          : size === 'small'
          ? 'h-8 w-8'
          : size === 'medium'
          ? 'h-10 w-10'
          : ''
      } items-center justify-center rounded-full ${
        hideBg
          ? 'md:hover:text-th-active'
          : `group after:rounded-full ${
              isPrimary
                ? 'raised-button text-[#110B11]'
                : 'raised-button-neutral text-th-fgd-1'
            }`
      } focus:outline-none disabled:cursor-not-allowed disabled:bg-th-bkg-4 
      disabled:text-th-fgd-4 md:disabled:hover:text-th-fgd-4 ${className} focus-visible:text-th-active`}
      ref={ref}
    >
      <span className={hideBg ? '' : 'group-hover:mt-1 group-active:mt-2'}>
        {children}
      </span>
    </button>
  )
})

IconButton.displayName = 'IconButton'

interface LinkButtonProps {
  icon?: ReactNode
}

type LinkButtonCombinedProps = AllButtonProps & LinkButtonProps

export const LinkButton: FunctionComponent<LinkButtonCombinedProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  secondary,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center border-0 font-bold ${
        secondary ? 'text-th-active' : 'text-th-fgd-2'
      } rounded-sm focus-visible:text-th-active focus-visible:underline disabled:cursor-not-allowed disabled:opacity-50 ${className} md:hover:text-th-fgd-3`}
      {...props}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
