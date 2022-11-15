import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import CarretDownIcon from 'icons/CarretDown'
import clsx from 'clsx'

type SelectProps = {
  options: Utils.IOption<string>[]
  selected: string
  onChange: (value: string) => void
}

const Select = ({ options, selected, onChange }: SelectProps) => {
  const selectedOption = options?.find((option) => option.value === selected)

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative z-0 w-full border border-placeholder cursor-default rounded-lg bg-white px-4 py-3 text-left focus:outline-none text-sm">
            <span className="block truncate">{selectedOption?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <CarretDownIcon />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-sm ring-2 ring-placeholder ring-opacity-5 focus:outline-none">
              {options?.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active, selected }) =>
                    clsx('relative cursor-default select-none py-2 px-4', {
                      'bg-primary text-white': active || selected,
                    })
                  }
                  value={option.value}
                >
                  <span className="block truncate">{option.label}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default Select
