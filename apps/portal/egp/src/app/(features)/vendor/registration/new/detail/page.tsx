'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetFormQuery } from '../../_api/query';
import RegistrationForm from '../_components/detail/formShell';

export default function Page() {
  const router = useRouter();
  const requestInfo = useGetFormQuery({});
  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.initial.status === 'Submitted') {
      router.push(`/vendor/track-applications`);
    }
    return () => {};
  }, [requestInfo.data, requestInfo.error]);

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <RegistrationForm
          vendorInfo={requestInfo.data.initial}
          initialValues={{
            ...requestInfo.data,
          }}
        />
      ) : (
        <></>
      )}
    </section>
  );
}
