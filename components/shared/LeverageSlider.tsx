import { useState } from 'react'
import RangeSlider from 'react-range-slider-input'

const LeverageSlider = ({
  leverageMax,
  onChange,
  step,
}: {
  leverageMax: number
  onChange: (x: number) => void
  step: number
}) => {
  const [value, setValue] = useState([0, 1])

  const handleSliderChange = (v: number[]) => {
    setValue(v)
    onChange(v[1])
  }

  return (
    <>
      <RangeSlider
        id="range-slider-gradient"
        onInput={handleSliderChange}
        min={1}
        max={leverageMax}
        value={value}
        step={step}
        thumbsDisabled={[true, false]}
      />
    </>
  )
}

export default LeverageSlider
