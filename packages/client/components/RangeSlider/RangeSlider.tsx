import { InputHTMLAttributes } from 'react'

type RangeSliderProps = InputHTMLAttributes<HTMLInputElement>

const RangeSlider = (props: RangeSliderProps) => {
  return (
    <input
      {...props}
      type="range"
      className="w-full h-[6px] accent-primary bg-primary rounded-lg appearance-none cursor-pointer"
    />
  )
}

export default RangeSlider
