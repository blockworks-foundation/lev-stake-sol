const NumberBg = ({ className }: { className: string }) => {
  return (
    <svg
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="currentColor"
    >
      <circle cx="20" cy="20" r="20" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7604 4.06282C8.95851 5.29984 2.82599 13.438 4.06301 22.2398C5.30003 31.0417 13.4382 37.1742 22.24 35.9372C31.0419 34.7002 37.1744 26.562 35.9374 17.7602C34.7004 8.95831 26.5622 2.8258 17.7604 4.06282ZM2.82517 22.4138C1.49207 12.9283 8.1009 4.15808 17.5864 2.82498C27.0719 1.49188 35.8421 8.10071 37.1752 17.5862C38.5083 27.0717 31.8995 35.8419 22.414 37.175C12.9285 38.5081 4.15827 31.8993 2.82517 22.4138Z"
        fill="#EBF441"
      />
    </svg>
  )
}

export default NumberBg
