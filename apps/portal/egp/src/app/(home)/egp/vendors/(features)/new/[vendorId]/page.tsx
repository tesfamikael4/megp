'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useGetFormQuery } from '@/store/api/vendor_registration/query';
import RegistrationForm from './_components/formShell';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../_components/notification';

export default function Page({ params }: { params: { vendorId: string } }) {
  const auth = process.env.NEXT_PUBLIC_UI_ENV_MODE || 'production';

  const router = useRouter();
  const requestInfo = useGetFormQuery({
    vendorId: params.vendorId,
  });
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification(
        'Error on fetching form data',
      );
      router.push(`/egp/vendors/new`);
    }
    if (requestInfo.data?.status === 'Submitted') {
      router.push(`/egp/vendors/track-applications`);
    }
    return () => {};
  }, [requestInfo, router]);

  return (
    <section>
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && requestInfo.isSuccess ? (
        <RegistrationForm
          vendorId={params.vendorId}
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
