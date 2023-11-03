'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetFormQuery } from '../_api/query';
import RegistrationForm from '../_components/detail/formShell';
import { getCookie } from 'cookies-next';

export default function Page() {
  const vendorId = getCookie('vendorId') || ' ';
  const router = useRouter();
  const requestInfo = useGetFormQuery({
    vendorId,
  });
  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.status === 'Submitted') {
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
          vendorId={vendorId}
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
