import UserCantViewRecordedClassAlert from '@components/Modals/UserCantViewRecordedEventAlert';
import { errorToast } from '@components/Toast/ErrorToast';
import { successToast } from '@components/Toast/SuccessToast';
import useUser from '@hooks/useUser';
import { api } from '@lib/api';
import convertErrorMessage from '@lib/error/convertErrorMessage';
import { queryClient } from '@lib/queryClient';
import getCheckInStatuses from '@lib/utilities/getCheckInStatuses';
import { EventFromAPI } from '@models/events/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CheckInButtonProps {
  event: EventFromAPI;
}

export default function CheckInButton({ event }: CheckInButtonProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { user, fetchUser } = useUser();

  const userId = user?.id || '';

  const userCheckInsQuantity = user?.checkInsQuantity || 0;

  // if (!event.startDate || !event.checkInsMaxQuantity) {
  //   return null;
  // }

  const {
    alreadyCheckedIn,
    eventAlreadyStarted,
    canEnterTheEvent,
    stillHasVacancy,
    canViewRecordedEvent,
    canCheckIn,
  } = getCheckInStatuses({
    event,
    userId,
    userCheckInsQuantity,
    isUserSubscribed: user?.isSubscribed || false,
  });

  const recordedUrl = event?.recordedUrl;

  const liveUrl = event?.liveUrl;

  const handleCheckIn = async () => {
    setIsCheckingIn(true);

    try {
      await api.post<{
        checkInsRemaining: number;
      }>(`/events/check-in?eventId=${event.id}`);

      await fetchUser();

      queryClient.invalidateQueries({
        queryKey: [
          'events',
          {
            isLive: true,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['events', 'byId', event.id],
      });

      await queryClient.refetchQueries({
        queryKey: ['events'],
      });

      await queryClient.refetchQueries({
        queryKey: ['events', 'next'],
      });

      successToast({
        message: 'check-in realizado com sucesso',
      });
    } catch (err) {
      const { message, description } = convertErrorMessage({
        err,
      });

      errorToast({
        message,
        description,
      });
    }

    setIsCheckingIn(false);
  };

  return (
    <>
      {eventAlreadyStarted && !canEnterTheEvent ? (
        recordedUrl ? (
          canViewRecordedEvent ? (
            <a
              href={recordedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
            >
              ver aula gravada
            </a>
          ) : (
            <UserCantViewRecordedClassAlert />
          )
        ) : (
          <button
            disabled
            className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
          >
            link ainda não disponível
          </button>
        )
      ) : alreadyCheckedIn ? (
        liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
          >
            ir para aula
          </a>
        ) : (
          <button
            disabled
            className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
          >
            link ainda não disponível
          </button>
        )
      ) : stillHasVacancy ? (
        canCheckIn ? (
          <button
            onClick={handleCheckIn}
            className="flex h-7 min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
          >
            {isCheckingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'check-in'
            )}
          </button>
        ) : (
          <button
            disabled
            className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
          >
            evento já começou :(
          </button>
        )
      ) : (
        <button
          disabled
          className="flex min-w-max max-w-fit justify-center rounded-md border border-transparent bg-brand-purple-900 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-800 focus:outline-none"
        >
          evento esgotado :(
        </button>
      )}
    </>
  );
}
