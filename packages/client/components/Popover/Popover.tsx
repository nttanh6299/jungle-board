import { Fragment, PropsWithChildren } from 'react'
import { Popover as HPopover, Transition } from '@headlessui/react'
import CarretDownTinyIcon from 'icons/CarretDownTiny'

type PopoverProps = PropsWithChildren<{
  title: string
  className?: string
}>

const Popover = ({ children, title, className }: PopoverProps) => {
  return (
    <HPopover className="relative z-20">
      <>
        <HPopover.Button className="focus:outline-none focus-visible:outline-0">
          <div className="flex items-center text-sm bg-corange rounded-lg px-3 py-1 text-white font-medium">
            {title}
            <div className="ml-2">
              <CarretDownTinyIcon />
            </div>
          </div>
        </HPopover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <HPopover.Panel className="absolute left-0 z-10 mt-3 max-w-xl">
            <div className="overflow-hidden rounded-lg bg-white shadow-[0_2px_16px] shadow-cardShadow/25">
              <div className={className}>{children}</div>
            </div>
          </HPopover.Panel>
        </Transition>
      </>
    </HPopover>
  )
}

export default Popover
