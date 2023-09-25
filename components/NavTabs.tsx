type Values = string | number

interface NavTabsProps<T extends Values> {
  activeValue: string
  onChange: (x: T) => void
  values: T[]
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
      {values.map((value, i) => (
        <button
          className={`mx-auto w-full border-y-2 border-r border-th-fgd-1 py-3.5 font-bold first:rounded-l-lg first:border-l-2 last:rounded-r-lg last:border-r-2 ${
            activeValue === value
              ? 'inner-shadow-top-sm bg-th-active text-th-fgd-1'
              : 'inner-shadow-bottom-sm default-transition bg-th-bkg-1 text-th-fgd-1 md:hover:bg-th-bkg-2'
          }`}
          key={`${value}` + i}
          onClick={() => onChange(value)}
        >
          {names ? names[i] : value}
        </button>
      ))}
    </>
  )
}

export default NavTabs
