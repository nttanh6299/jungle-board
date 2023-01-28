import Image from 'next/image'
import CheckIcon from 'icons/Check'
import CoinsIcon from 'icons/Coins'
import LockIcon from 'icons/Lock'
import clsx from 'clsx'

interface ThemeItemProps {
  image: string
  price: number
  isChecked: boolean
  isLocked: boolean
  canBuy: boolean
  onClick: () => void
}

const ThemeItem = ({ image, price, isLocked, isChecked, canBuy, onClick }: ThemeItemProps) => {
  const handleClick = () => {
    if (isLocked || isChecked) {
      return
    }

    onClick()
  }

  return (
    <div className="relative bg-black/75 md:w-auto md:h-[166px]" onClick={handleClick}>
      <Image src={image} layout="fill" priority />
      <div
        className={clsx('absolute inset-0 flex justify-center items-center cursor-pointer transition-[background]', {
          'bg-black/75': isChecked || canBuy || (!isChecked && isLocked),
        })}
      >
        <div className="flex flex-col items-center">
          {isChecked && <CheckIcon />}
          {!isChecked && isLocked && <LockIcon />}
          {canBuy && (
            <div className="text-sm text-primary font-light flex items-center">
              <div className="scale-75 mr-0.5">
                <CoinsIcon />
              </div>
              {price}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThemeItem
