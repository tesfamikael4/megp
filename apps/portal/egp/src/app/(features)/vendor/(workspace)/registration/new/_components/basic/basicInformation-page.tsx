'use client';
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useGetVendorQuery } from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { BasicInformation } from './basicInformation';
import { useRouter } from 'next/navigation';

export default function BasicInformationPage() {
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  console.log(requestInfo);

  useEffect(() => {
    if (requestInfo.error) {
      NotificationService.requestErrorNotification('Error on fetching data');
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
        <BasicInformation
          defaultValues={{
            name: requestInfo.data.basic.name ?? '',
            origin: requestInfo.data.basic.origin ?? '',
            tinNumber: requestInfo.data.basic.tinNumber ?? '',
            tinIssuedDate: requestInfo.data.basic.tinIssuedDate ?? '',
          }}
        />
      ) : (
        <BasicInformation
          defaultValues={{
            name: '',
            origin: '',
            tinNumber: '',
            tinIssuedDate: '',
          }}
        />
      )}
    </section>
  );
}
