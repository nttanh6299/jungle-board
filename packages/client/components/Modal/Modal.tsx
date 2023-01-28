import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
  title: string
  description?: string
  okButtonTitle?: string
  cancelButtonTitle?: string
  isOkLoading?: boolean
}

function noop() {
  console.log()
}

const Modal = ({
  isOpen,
  onClose,
  onOk,
  title,
  description,
  okButtonTitle,
  cancelButtonTitle,
  isOkLoading,
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={noop}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-4 md:p-5 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-cgray text-white focus-visible:outline-none"
                    onClick={onClose}
                  >
                    {cancelButtonTitle}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-primary text-white disabled:opacity-75 focus-visible:outline-none"
                    onClick={onOk}
                    disabled={isOkLoading}
                  >
                    {okButtonTitle}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
