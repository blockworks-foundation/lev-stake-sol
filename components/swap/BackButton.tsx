import { ArrowLeftIcon } from '@heroicons/react/20/solid'

const BackButton = ({ onClick }: { onClick: (x: boolean) => void }) => {
  return (
    <button
      onClick={() => onClick(false)}
      className="absolute left-4 top-4 z-40 w-6 text-th-fgd-4 focus:outline-none focus-visible:text-th-active md:right-2 md:top-2 md:hover:text-th-active"
    >
      <ArrowLeftIcon className={`h-6 w-6`} />
    </button>
  )
}

export default BackButton
