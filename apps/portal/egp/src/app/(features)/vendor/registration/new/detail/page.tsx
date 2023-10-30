'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetFormQuery } from '../_api/query';
import RegistrationForm from '../_components/detail/formShell';
import { setCookie, hasCookie, getCookie } from 'cookies-next';

export default function Page() {
  const auth = process.env.NEXT_PUBLIC_UI_ENV_MODE || 'production';
  const vendorId = getCookie('vendorId') || ' ';
  const router = useRouter();
  const requestInfo = useGetFormQuery({
    vendorId,
  });
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification(
        'Error on fetching form data',
      );
      router.push(`basic`);
    }
    if (requestInfo.data?.status === 'Submitted') {
      router.push(`/vendor/track-applications`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <section className="w-full">
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
