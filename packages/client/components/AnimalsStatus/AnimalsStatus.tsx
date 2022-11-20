import NextImage from 'next/image'
import { AnimalPath } from 'constants/url'
import { Animal } from 'jungle-board-service'
import clsx from 'clsx'

interface AnimalsStatusProps {
  alive: string[]
}

const AnimalsStatus = ({ alive }: AnimalsStatusProps) => {
  return (
    <div className="grid gap-1 grid-cols-4">
      {Object.keys(Animal).map((animal) => (
        <div
          key={animal}
          className={clsx('w-[36px] h-[36px] p-0.5 bg-gray-100', {
            'opacity-10': !alive?.includes(animal),
          })}
        >
          {AnimalPath[animal] && (
            <NextImage src={AnimalPath[animal]} alt={animal} width="100%" height="100%" priority />
          )}
        </div>
      ))}
    </div>
  )
}

export default AnimalsStatus
