type Values = string | number

interface NavTabsProps<T extends Values> {
  activeValue: string
  onChange: (x: T) => void
  values: [T, number][]
  names?: Array<string>
}

const NavTabs = <T extends Values>({
  activeValue,
  values,
  names,
  onChange,
}: NavTabsProps<T>) => {
  return (
    <>
      {values.map(([value, count], i) => (
        <button
          className={`mx-auto flex w-full items-center justify-center border-y-2 border-r border-th-fgd-1 py-3.5 font-bold first:rounded-l-lg first:border-l-2 last:rounded-r-lg last:border-r-2 ${
            activeValue === value
              ? 'inner-shadow-top-sm bg-th-active text-th-fgd-1'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          key={`${value}` + i}
          onClick={() => onChange(value)}
        >
          {names ? names[i] : value}
          {count ? (
            <div
              className={`ml-2 rounded ${
                value === activeValue ? 'bg-th-bkg-1' : 'bg-th-bkg-3'
              } px-1.5 py-0.5 `}
            >
              <span className="text-sm text-th-fgd-2">{count}</span>
            </div>
          ) : null}
        </button>
      ))}
    </>
  )
}

export default NavTabs
