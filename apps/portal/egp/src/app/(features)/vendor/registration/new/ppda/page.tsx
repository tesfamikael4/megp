'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';
import { useGetFormQuery } from '../_api/query';
import { getCookie } from 'cookies-next';

import { AreasOfBusinessInterestForm } from '../_components/ppda/formShell';

function Page() {
  const router = useRouter();
  const requestInfo = useGetFormQuery({});

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (requestInfo.data?.initial.status === 'Submitted') {
      router.push(`/vendor/track-applications`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <section className="w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <AreasOfBusinessInterestForm
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

export default Page;
