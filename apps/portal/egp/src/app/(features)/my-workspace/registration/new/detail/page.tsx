'use client';
import { Suspense, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useGetVendorQuery } from '../../_api/query';
import RegistrationForm from '../../_components/detail/formShell';
import { usePrivilege } from '../_context/privilege-context';
import { getInitialValues } from '../../_utils';
import { NotificationService } from '../../../_components/notification';

export default function Page() {
  const router = useRouter();

  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { checkAccess, lockElements } = usePrivilege();

  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo.data, requestInfo.error]);

  if (
    requestInfo?.data?.status === 'Approved' ||
    requestInfo?.data?.status === 'Completed'
  ) {
    return router.push('/vendor/service');
  }

  return (
    <Suspense>
      <section className="w-full relative">
        <LoadingOverlay
          visible={requestInfo.isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {requestInfo.data && requestInfo.isSuccess ? (
          <RegistrationForm
            vendorInfo={requestInfo.data.initial}
            initialValues={getInitialValues(requestInfo.data)}
            disabled={!checkAccess('detail')}
            lockElements={lockElements('detail')}
            isProfileUpdate={false}
          />
        ) : (
          <></>
        )}
      </section>
    </Suspense>
  );
}
