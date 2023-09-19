const Label = ({
  text,
  optional,
  className,
}: {
  text: string
  optional?: boolean
  className?: string
}) => (
  <p
    className={`mb-2 text-left text-base font-medium text-th-fgd-1 ${className}`}
  >
    {text}{' '}
    {optional ? (
      <span className="ml-1 text-xs text-th-fgd-4">(Optional)</span>
    ) : null}
  </p>
)

export default Label
