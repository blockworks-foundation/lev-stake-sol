import { FunctionComponent, ReactNode, memo } from 'react'

interface SwitchProps {
  checked: boolean
  className?: string
  onChange: (x: boolean) => void
  children?: ReactNode
  disabled?: boolean
  small?: boolean
}

const Switch: FunctionComponent<SwitchProps> = ({
  checked = false,
  className = '',
  children,
  onChange,
  disabled,
  small,
}) => {
  const handleClick = () => {
    onChange(!checked)
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2 text-th-fgd-1">{children}</span>
      <button
        type="button"
        className={`${
          checked ? 'bg-th-success' : 'bg-th-bkg-4'
        } relative inline-flex ${
          small ? 'h-4 w-8' : 'h-5 w-10'
        } inner-shadow-top-sm flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-th-fgd-4 ${
          disabled ? 'opacity-60' : ''
        }`}
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="sr-only">{children}</span>
        <span
          aria-hidden="true"
          className={`${
            checked
              ? small
                ? 'translate-x-4'
                : 'translate-x-5'
              : 'translate-x-0'
          } pointer-events-none inline-block ${
            small ? 'h-3 w-3' : 'h-4 w-4'
          } inner-shadow-bottom-sm 
          rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
        ></span>
      </button>
    </div>
  )
}

export default memo(Switch)
