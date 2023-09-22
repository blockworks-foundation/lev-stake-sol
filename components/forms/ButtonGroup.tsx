type Values = string | number

interface ButtonGroupProps<T extends Values> {
  activeValue: T
  className?: string
  disabled?: boolean
  onChange: (x: T) => void
  unit?: string
  values: T[]
  names?: Array<string>
}

const ButtonGroup = <T extends Values>(
  {
    activeValue,
    className,
    disabled,
    unit,
    values,
    onChange,
    names,
  }: ButtonGroupProps<T>,
) => {
  return (
    <div className={`rounded-lg ${disabled ? 'opacity-50' : ''}`}>
      <div className="relative flex">
        {activeValue && values.includes(activeValue) ? (
          <div
            className={`absolute left-0 top-0 h-full transform bg-th-primary-2 ${
              activeValue === values[0] ? 'rounded-l-[7px]' : ''
            } ${
              activeValue === values[values.length - 1] ? 'rounded-r-[7px]' : ''
            }`}
            style={{
              transform: `translateX(${
                values.findIndex((v) => v === activeValue) * 100
              }%)`,
              width: `${100 / values.length}%`,
            }}
          />
        ) : null}
        {values.map((v, i) => {
          const activeIndex = values.findIndex((val) => val === activeValue)
          return (
            <button
              className={`${className} relative h-12 w-1/2 border-y border-r px-3 text-center text-sm font-normal focus-visible:bg-th-bkg-4 focus-visible:text-th-fgd-2 disabled:cursor-not-allowed
            ${v === values[0] ? 'rounded-l-lg border-l' : ''} ${
              v === values[values.length - 1] ? 'rounded-r-lg' : ''
            }
              ${
                v === activeValue
                  ? `inner-shadow-top-sm border-l border-th-primary-3 text-th-active`
                  : `transition-color inner-shadow-bottom-sm border-th-bkg-3 bg-th-bkg-1 text-th-fgd-2 duration-300 md:hover:bg-th-bkg-2 md:hover:text-th-fgd-1`
              }
              ${
                activeIndex && activeIndex > 0 && i === activeIndex - 1
                  ? 'border-r-0'
                  : ''
              }
            `}
              disabled={disabled}
              key={`${v}${i}`}
              onClick={() => onChange(v)}
              style={{
                width: `${100 / values.length}%`,
              }}
              type="button"
            >
              {names
                ? unit
                  ? names[i] + unit
                  : names[i]
                : unit
                ? v + unit
                : v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ButtonGroup
