import { cloneElement, Fragment, ReactElement, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChoosePlan } from './SubscribeModal';

interface UserCantAccessPremiumSystemResourceAlertProps {
  triggerButton: ReactElement;
  title: string;
  description: string;
}

export default function UserCantAccessPremiumSystemResourceAlert({
  triggerButton,
  title,
  description,
}: UserCantAccessPremiumSystemResourceAlertProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const clonedTriggerButton = cloneElement(triggerButton, {
    onClick: handleOpen,
  });

  return (
    <>
      {clonedTriggerButton}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  <div>
                    <div className="mt text-center">
                      <Dialog.Title
                        as="h3"
                        className="mb-2 text-base font-semibold leading-6 text-purple-700"
                      >
                        {title}
                      </Dialog.Title>

                      <Dialog.Description>
                        <p className="text-sm text-gray-600">{description}</p>
                        <ChoosePlan />
                      </Dialog.Description>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
