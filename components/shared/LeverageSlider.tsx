import usePrevious from 'hooks/usePrevious'
import { useEffect, useState } from 'react'
import RangeSlider from 'react-range-slider-input'

const LeverageSlider = ({
  startingValue,
  leverageMax,
  onChange,
  step,
}: {
  startingValue: number
  leverageMax: number
  onChange: (x: number) => void
  step: number
}) => {
  const [value, setValue] = useState([0, startingValue])
  const prevMax = usePrevious(leverageMax)

  // if leverageMax changes, force rerender
  useEffect(() => {
    if (prevMax !== leverageMax) {
      window.dispatchEvent(new Event('resize'))
    }
  }, [leverageMax, prevMax])

  const handleSliderChange = (v: number[]) => {
    setValue(v)
    onChange(v[1])
  }

  return (
    <RangeSlider
      id="range-slider-gradient"
      onInput={handleSliderChange}
      min={1}
      max={leverageMax}
      value={value}
      step={step}
      thumbsDisabled={[true, false]}
    />
  )
}

export default LeverageSlider
